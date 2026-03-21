import asyncio
import json
from playwright.async_api import async_playwright
from sqlalchemy.exc import IntegrityError
from app.config import LINKEDIN_USER, LINKEDIN_PASS, SEARCH_KEYWORD, SEARCH_LOCATION, MAX_RESULTS_PER_RUN
from app.db import SessionLocal, Job, init_db

SEARCH_URL_TEMPLATE = "https://www.linkedin.com/jobs/search/?keywords={keywords}&location={location}"

async def run_search():
    if not LINKEDIN_USER or not LINKEDIN_PASS:
        raise RuntimeError("Missing LINKEDIN_USER or LINKEDIN_PASS")

    init_db()
    session = SessionLocal()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Login
        await page.goto("https://www.linkedin.com/login")
        await page.fill('input[name="session_key"]', LINKEDIN_USER)
        await page.fill('input[name="session_password"]', LINKEDIN_PASS)
        await page.click('button[type="submit"]')
        await page.wait_for_load_state('networkidle')

        search_url = SEARCH_URL_TEMPLATE.format(keywords=SEARCH_KEYWORD.replace(' ', '%20'), location=SEARCH_LOCATION.replace(' ', '%20'))
        await page.goto(search_url)
        await page.wait_for_load_state('networkidle')

        # Minimal scraping: find job cards on page
        job_cards = await page.query_selector_all('ul.jobs-search__results-list li')
        count = 0
        for card in job_cards:
            if count >= MAX_RESULTS_PER_RUN:
                break
            try:
                title_el = await card.query_selector('h3')
                company_el = await card.query_selector('.base-search-card__subtitle')
                location_el = await card.query_selector('.job-search-card__location')
                link_el = await card.query_selector('a')

                title = (await title_el.inner_text()) if title_el else ''
                company = (await company_el.inner_text()) if company_el else ''
                location = (await location_el.inner_text()) if location_el else ''
                url = (await link_el.get_attribute('href')) if link_el else ''

                # dedup key: use url or combination
                job_id = url.split('?')[0] if url else (title + company)

                job = Job(job_id=job_id.strip(), title=title.strip(), company=company.strip(), location=location.strip(), url=url, raw='')
                session.add(job)
                session.commit()
                count += 1
            except IntegrityError:
                session.rollback()  # already exists
            except Exception:
                session.rollback()
                continue

        await browser.close()
        session.close()

if __name__ == '__main__':
    asyncio.run(run_search())

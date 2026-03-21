import os

# Scraper config
LINKEDIN_USER = os.getenv("LINKEDIN_USER")
LINKEDIN_PASS = os.getenv("LINKEDIN_PASS")
SEARCH_KEYWORD = os.getenv("SEARCH_KEYWORD", "software engineer")
SEARCH_LOCATION = os.getenv("SEARCH_LOCATION", "")

# DB
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@postgres:5432/postgres")

# Scrape settings
MAX_RESULTS_PER_RUN = int(os.getenv("MAX_RESULTS_PER_RUN", "50"))

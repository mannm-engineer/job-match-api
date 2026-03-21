FROM python:3.11-slim

# Install dependencies for Playwright
RUN apt-get update && apt-get install -y wget gnupg libnss3 libatk1.0-0 libatk-bridge2.0-0 libx11-6 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libasound2 libcups2 libxss1 libxkbcommon0 ca-certificates --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browsers
RUN playwright install --with-deps

COPY . /app

ENV PYTHONUNBUFFERED=1
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

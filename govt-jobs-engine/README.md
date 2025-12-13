# Govt Jobs AI Engine

A standalone Node.js microservice that scrapes government job websites, extracts details using Google Gemini AI, translates summaries to Hindi, and saves them to a Supabase database.

## Features

- **Multi-Source Scraping**: Supports official govt sites (SSC, IBPS, etc.) and private aggregators.
- **AI Extraction**: Uses Gemini Pro to parse unstructured text/PDFs into JSON.
- **Hindi Localization**: Auto-generates easy-to-understand Hindi summaries for students.
- **Automated Workflow**: Scheduled via `node-cron` to run every 6 hours.
- **REST API**: Exposes job data for external consumption (e.g., CareerRaah).

## Tech Stack

- **Runtime**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Scraping**: Cheerio, Puppeteer
- **Scheduling**: node-cron

## Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Create a `.env` file in the root:
   ```env
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. **Database Setup**:
   Run the following SQL in your Supabase SQL Editor:
   ```sql
   create table jobs (
     id uuid primary key default gen_random_uuid(),
     title text,
     department text,
     source text,
     url text,
     pdf_url text,
     raw_text text,
     structured jsonb,
     hindi_summary text,
     created_at timestamptz default now(),
     unique(url)
   );
   ```

## API Endpoints

- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Get job details
- `GET /api/search?q=...` - Search jobs

## Deployment

### Render / Railway
1. Connect GitHub repo.
2. Set build command: `npm install`
3. Set start command: `node app.js`
4. Add Environment Variables.

## Project Structure
- `src/scrapers`: Logic to fetch HTML/Links from sites.
- `src/pdf`: Tools to download and parse PDFs.
- `src/ai`: Prompts and logic for Gemini API.
- `src/workers`: Orchestrates the flow (Scrape -> PDF -> AI -> DB).
- `src/api`: Express routes.

# Daily tech news digest

This project can fetch real TechCrunch RSS headlines, ask Gemini for short summaries, save them in a Supabase Postgres database, and show them in Streamlit. GitHub Actions runs the journalist daily. The headline and link come from the publisher; the AI only summarizes the RSS text, so read the linked article for the full story.

The old local FastAPI + file watcher demo is still available. Without `DATABASE_URL`, the dashboard and API use local `news.db`. The cloud journalist requires both `DATABASE_URL` and `GEMINI_API_KEY` so a missing secret cannot silently write to a temporary database.

## 1. Create the cloud database

1. Open the new [ai-news-aggregator Supabase project](https://supabase.com/dashboard/project/gxqxogdbfmvlqfkbdtxr).
2. Click **Connect** and copy the **Transaction pooler** connection URI (port `6543`). Use the URI shown for this project, including its pooler host and `postgres.gxqxogdbfmvlqfkbdtxr` user. The direct `db.PROJECT_REF.supabase.co` address may not work from GitHub Actions because it usually requires IPv6. The app uses SQLAlchemy's `NullPool` so it opens short lived connections suitable for transaction pooling.
3. Replace the password placeholder in the URI with your database password. If the password has URL special characters, URL encode it. Keep this entire URI private.

The `articles` table is already created in this project with Row Level Security enabled. The matching setup SQL is saved in `sql/001_create_articles.sql` for review. The daily job does not change the database schema. The app uses the database URI on the server; it does not use a public Supabase API key.

## 2. Get a Gemini API key

Create an API key in [Google AI Studio](https://aistudio.google.com/app/apikey). The project uses the current `google-genai` Python package and defaults to `gemini-3.5-flash-lite`. Check your account's available models and free-tier limits in AI Studio. You can change the model with `GEMINI_MODEL` if needed.

## 3. Put the code on GitHub and add secrets

Create a GitHub repository and upload this project's source files, including `.github/workflows/news_bot.yml`. **Do not upload** `.venv/`, `news.db`, `.env`, or `.streamlit/secrets.toml`; `.gitignore` excludes them. The repository can be public because credentials stay in secrets.

In the repository, open **Settings > Secrets and variables > Actions** and add two repository secrets:

| Secret name | Value |
| --- | --- |
| `DATABASE_URL` | Supabase **Transaction pooler** URI (port `6543`) |
| `GEMINI_API_KEY` | Google AI Studio API key |

The workflow runs at **7:30 AM Asia/Kolkata** each day and can also be started from **Actions > Daily AI Tech Journalist > Run workflow**. GitHub scheduled jobs can start late or occasionally be dropped. A scheduled workflow in a public repository may be disabled after 60 days without repository activity.

Run the workflow manually once. Check that it succeeds and that the Supabase Table Editor shows rows in `articles` before deploying the dashboard.

## 4. Deploy the dashboard

1. Go to [Streamlit Community Cloud](https://share.streamlit.io/), connect GitHub, and create a new app from this repository.
2. Set the main file path to `dashboard.py`.
3. In **Advanced settings > Secrets**, add this TOML line, replacing the placeholder with the same Supabase pooler URI:

   ```toml
   DATABASE_URL = "postgresql://postgres.gxqxogdbfmvlqfkbdtxr:URL_ENCODED_PASSWORD@POOLER_HOST:6543/postgres"
   ```

4. Deploy the app. The dashboard only needs `DATABASE_URL`; keep `GEMINI_API_KEY` in GitHub Actions, where the daily script runs.

Streamlit Community Cloud and Supabase free plans have limits and can pause inactive apps or projects. A free project is not a guarantee of permanent, uninterrupted hosting.

## Local development

Install Python 3.12, then run in PowerShell from this folder:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

For a local journalist run, set the secrets only in your current PowerShell session, then run the script:

```powershell
$env:DATABASE_URL = "YOUR_SUPABASE_TRANSACTION_POOLER_URI"
$env:GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
.\.venv\Scripts\python.exe ai_journalist.py
```

To view the dashboard locally:

```powershell
.\.venv\Scripts\python.exe -m streamlit run dashboard.py
```

You can instead put only `DATABASE_URL` in a local `.streamlit/secrets.toml` file. See `.streamlit/secrets.toml.example` for the shape of the value. That real secrets file is ignored by Git.

If you want to use the older SQLite demo, leave `DATABASE_URL` unset and start `main.py` with Uvicorn plus `watchdog_script.py`. The new `ai_journalist.py` no longer creates fictional JSON files.

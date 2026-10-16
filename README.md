# College Placement Preparation & AI Readiness Engine
### Automated Coding Profile Synchronization + Hugging Face AI Placement Analytics

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?style=flat&logo=React&logoColor=black)](https://react.dev)
[![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-FFD21E.svg?style=flat&logo=HuggingFace&logoColor=black)](https://huggingface.co)
[![SQLite](https://img.shields.io/badge/SQLite-Zero--Config-003B57.svg?style=flat&logo=SQLite&logoColor=white)](https://sqlite.org)

An applied AI software engineering platform engineered for B.Tech CSE students preparing for campus technical placements. The system eliminates manual problem logging by automatically synchronizing live submissions and contest ratings from **LeetCode**, **Codeforces**, and **GitHub**, and applies **Hugging Face Transformer Models** to objectively evaluate placement readiness, diagnose weak algorithmic topics with recency decay, benchmark against company hiring bars, and schedule spaced-repetition revisions.

---

## 🌟 Key Technical Breakthroughs

1. **Automated Multi-Platform Data Ingestion:**
   - **LeetCode GraphQL API:** Direct integration with `https://leetcode.com/graphql` to extract solved difficulty distributions (Easy, Medium, Hard), contest rating, global ranking, and topic problem counts.
   - **Codeforces REST API:** Ingests live contest rating, title rank (`pupil`, `specialist`, `expert`), and problem tag distributions.
   - **GitHub REST API v3:** Ingests public repositories, repository stars, language distributions, and commit recency.
   - **Non-blocking Workers:** All sync tasks run asynchronously in FastAPI background workers without locking the user interface.

2. **Hugging Face AI Placement Intelligence:**
   - **Model 1 (`sentence-transformers/all-MiniLM-L6-v2`):** Generates dense vector representations of the student's preparation summary and calculates cosine similarity against real-world Job Descriptions for Tier-1, Mid-Tier, and Enterprise companies.
   - **Model 2 (`facebook/bart-large-mnli`):** Zero-shot classifier predicting placement hireability tier distributions with calibrated confidence.
   - **Composite Placement Readiness Index:**
     $$\text{Readiness} = 0.40 \times \text{DSA} + 0.25 \times \text{HF Semantic} + 0.15 \times \text{CS} + 0.10 \times \text{Aptitude} + 0.10 \times \text{Interview}$$

3. **Weak-Area Diagnosis & Spaced-Repetition:**
   - Evaluates topic proficiency weighted by target company difficulty and recency decay:
     $$\text{Priority} = (100 - \text{Proficiency}) \times \text{Topic Weight} \times \text{Recency Decay Factor}$$
   - Automatically flags critical topics (DP, Graphs, Trees) with 0 solves in 21 days as **"Urgent Revision Required"**.
   - Spaced-repetition review calendar utilizing exponential intervals ($1 \to 3 \to 7 \to 14 \to 30$ days).

4. **Interactive AI Mock Technical Interviewer:**
   - Allows candidates to practice core technical interview questions (ACID, Deadlocks, Indexing, TCP/UDP, SOLID) and computes semantic answer relevance and identifies missing technical terminology using NLP.

---

## 📂 Target Folder Architecture

```
college-placement-system/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes_auth.py          # Register, login, JWT /me
│   │   │   ├── routes_platforms.py     # Connect handles, background sync, metrics
│   │   │   ├── routes_ai.py            # HF AI evaluation, company match, interview
│   │   │   ├── routes_academics.py     # CS topics mastery & aptitude tracking
│   │   │   └── routes_revision.py      # Spaced repetition due reviews & logging
│   │   ├── core/
│   │   │   ├── config.py               # Pydantic settings from .env
│   │   │   ├── database.py             # SQLAlchemy engine & session factory
│   │   │   └── security.py             # Bcrypt hashing & JWT token validation
│   │   ├── models/
│   │   │   └── db_models.py            # Relational database models (SQLite/PostgreSQL)
│   │   ├── schemas/
│   │   │   └── pydantic_schemas.py     # Request/response validation schemas
│   │   ├── services/
│   │   │   ├── leetcode_scraper.py     # Official GraphQL client
│   │   │   ├── codeforces_scraper.py   # REST API client
│   │   │   ├── github_scraper.py       # REST API v3 client
│   │   │   ├── sync_service.py         # Multi-platform sync orchestrator
│   │   │   ├── huggingface_service.py  # Transformer models & offline fallback
│   │   │   ├── scoring_service.py      # Composite scoring & weak-area detection
│   │   │   └── revision_service.py     # Spaced repetition interval calculator
│   │   ├── data/
│   │   │   └── company_benchmarks.json # JDs for Google, Amazon, Microsoft, TCS, etc.
│   │   └── main.py                     # FastAPI application, CORS, routers
│   ├── tests/
│   │   └── smoke.py                    # End-to-end automated verification suite
│   ├── requirements.txt
│   ├── .env
│   ├── .env.example
│   └── run.py                          # Uvicorn launcher
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js               # Fetch wrapper with Bearer token
│   │   ├── components/
│   │   │   ├── AIReadinessGauge.jsx    # Chart.js semi-doughnut gauge
│   │   │   ├── PlatformCards.jsx       # LeetCode/CF/GitHub summary cards
│   │   │   ├── TopicRadarChart.jsx     # Chart.js topic proficiency radar
│   │   │   ├── RevisionCalendar.jsx    # Due revisions with recall rating buttons
│   │   │   └── SyncModal.jsx           # Handle connection and live sync trigger
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx           # Unified overview
│   │   │   ├── CodingProfiles.jsx      # Ingested submissions and topic tags
│   │   │   ├── AIAnalysis.jsx          # Company matching & AI interview scorer
│   │   │   ├── CSFundamentals.jsx      # DBMS/OS/CN/OOP & Aptitude practice
│   │   │   ├── Login.jsx               # Student authentication
│   │   │   └── Register.jsx            # Student registration
│   │   ├── styles/
│   │   │   └── global.css              # Dark glassmorphism design system
│   │   ├── App.jsx                     # Router & protected layout
│   │   └── main.jsx                    # React 18 entry
│   ├── package.json
│   ├── vite.config.js                  # Proxy configuration (/api -> :8000)
│   └── index.html
│
├── docs/
│   ├── AI_Model_Architecture.md        # Detailed NLP pipeline specifications
│   └── API_Documentation.md            # Endpoint reference with sample payloads
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.10+** (Python 3.11 recommended)
- **Node.js 18+** & **npm**

### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment (Windows)
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
python run.py
```
- Backend will be live at: `http://localhost:8000`
- Interactive Swagger API docs: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
- Open your browser at: `http://localhost:5173`

---

## 🧪 Automated Verification & Smoke Testing

Run the end-to-end automated verification script:
```bash
cd backend
.\venv\Scripts\python tests/smoke.py
```
The test suite validates:
1. `GET /api/health` -> `{"status": "ok"}`
2. Registration with standard CS topic seeding
3. Login and JWT Bearer token generation
4. Authenticated `/api/auth/me` and unauthorized rejection (401)
5. Platform connection (`leetcode`, `codeforces`, `github`)
6. CS topic status update & Aptitude quiz submission
7. Hugging Face AI pipeline evaluation, tier classification, and company match
8. Spaced repetition due retrieval and recall recalibration

---

## 🎓 Academic Viva Defense Talking Points

- **Q: Why use Hugging Face transformers instead of basic weighted averages?**  
  *A:* Basic formulas cannot analyze qualitative portfolio depth or compare semantic alignment with real-world job descriptions. By utilizing `sentence-transformers/all-MiniLM-L6-v2`, we generate dense semantic embeddings of the candidate's skills and compute cosine similarity against company JDs, catching mismatches that raw solve counts miss.

- **Q: How does the system handle platform rate limits or API downtime?**  
  *A:* The system implements local database caching with a configurable cooldown period (`SYNC_COOLDOWN_SECONDS = 600`). If a platform API fails or is unreachable, the system retains the previously cached snapshot without zeroing out historical progress, marks the status as `error`, and displays a user-friendly diagnostic.

- **Q: What is the benefit of the spaced-repetition forgetting curve algorithm?**  
  *A:* Placement preparation often spans months where earlier topics are forgotten. Our algorithm monitors submission recency and automatically schedules reviews using expanding intervals ($1, 3, 7, 14, 30$ days) calibrated by self-reported recall performance.

- **Q: What happens if there is no internet connection for Hugging Face?**  
  *A:* The system features an automatic deterministic offline fallback engine that computes compliant placement readiness scores and tier classifications without crashing, returning `is_fallback: true`.

# Advocate Saathi — AI Legal Assistant

An AI-powered legal assistant for Indian users built with a custom ML pipeline.
No external AI API required — your own ML model does all the work.

---

## How it works

```
User describes legal problem
          ↓
   ML Classifier (Python)
   → Identifies case type
   → Labour / Cyber / Consumer / Property / Family / Criminal / Civil
          ↓
   Follow-up Questions Engine
   → Asks 4-5 targeted questions
          ↓
   FIR Logic Engine
   → Decides: FIR applicable? Yes / No
          ↓
   Guidance Engine
   → Applicable Indian laws
   → Step-by-step action plan
   → Required documents
   → Authority to approach
   → Helpline numbers
          ↓
   Lawyer Matching
   → Finds lawyers by specialisation + location + rating
```

---

## Project Structure

```
advocate-saathi/
├── frontend/                    # UI — open index.html with Live Server
│   ├── index.html
│   ├── css/                     # variables, base, components, screens, animations
│   └── js/
│       ├── app.js               # Bootstrap
│       ├── api/claude.js        # Calls your backend (+ offline fallback)
│       ├── utils/               # router, storage, toast, helpers
│       ├── components/          # navbar, statusbar, chatbubble, casecard
│       └── screens/             # splash, onboarding, auth, home, chat,
│                                  history, notifications, profile
│
├── backend/                     # Node.js + Express REST API
│   ├── server.js
│   ├── config/db.js             # MongoDB connection
│   ├── models/                  # User, Case, Lawyer
│   ├── controllers/             # auth, chat (ML proxy), cases, lawyers
│   ├── routes/                  # auth, chat, cases, lawyers
│   ├── middleware/              # JWT auth, error handler
│   ├── package.json
│   └── .env.example
│
├── ml_server/                   # Python Flask ML server
│   ├── app.py                   # Flask app — runs on port 8000
│   ├── classifier.py            # Case type classifier (keyword + ML)
│   ├── questions.py             # Follow-up question engine
│   ├── fir_logic.py             # FIR applicability decision engine
│   ├── guidance.py              # Full legal guidance generator
│   ├── train.py                 # Train your ML model (run once)
│   ├── requirements.txt
│   └── data/
│       └── training_data.csv    # 70 labeled training examples
│
└── docs/
    └── API.md                   # Full API reference
```

---

## Quick Start

### 1. Frontend only (no backend needed)
```bash
# Open frontend/index.html with Live Server in VS Code
# App works fully with built-in fallback responses
```

### 2. Full stack

**Terminal 1 — Backend**
```bash
cd backend
npm install
cp .env.example .env        # fill in MONGO_URI and JWT_SECRET
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — ML Server**
```bash
cd ml_server
pip install -r requirements.txt
python app.py
# Runs on http://localhost:8000
```

**Terminal 3 — Frontend**
```bash
# Open frontend/index.html with Live Server
# Runs on http://127.0.0.1:5500
```

---

## Train your ML model

```bash
cd ml_server
python train.py
# Creates models/classifier.pkl
# Restart app.py to use it
```

Add more examples to `data/training_data.csv` for better accuracy.
Format: `text,category`

---

## Seed test lawyers

After backend is running:
```
POST http://localhost:5000/api/lawyers/seed
```
This adds 5 dummy verified lawyers to MongoDB.

---

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/advocate_saathi
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
ML_MODEL_URL=http://localhost:8000
ALLOWED_ORIGINS=http://127.0.0.1:5500
```

---

## Tech Stack

| Layer     | Technology                            |
|-----------|---------------------------------------|
| Frontend  | Vanilla JS, CSS3, HTML5               |
| Backend   | Node.js, Express, MongoDB, Mongoose   |
| ML Server | Python, Flask, scikit-learn, TF-IDF   |
| Auth      | JWT (JSON Web Tokens)                 |
| Database  | MongoDB                               |

---

## Roadmap

- [ ] Hindi language support
- [ ] Voice input
- [ ] Lawyer appointment booking
- [ ] Payment integration (Razorpay)
- [ ] PDF export of guidance
- [ ] Fine-tune ML model with more data
- [ ] Regional language support

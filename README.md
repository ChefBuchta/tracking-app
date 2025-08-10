# Tracking App

A full-stack nutrition and activity tracking application built with FastAPI (Python) for the backend and React (Vite, TypeScript, Tailwind) for the frontend.

---

## Features
- User authentication and profiles
- Food search and diary (with macros and calories)
- Daily statistics and history
- Goals and progress tracking
- Responsive mobile-friendly UI

---

## Project Structure

```
tracking-app/
  backend/         # FastAPI backend
    app/
      main.py      # FastAPI entrypoint
      data.py      # Food data
      database.py  # DB logic
      routes/      # API routes
    requirements.txt
    start_server.py
  frontend/        # React + Vite frontend
    src/
      components/  # UI components
      hooks/       # React hooks
      lib/         # Utilities
      pages/       # App pages
      services/    # API calls
    package.json
    vite.config.ts
    tailwind.config.ts
    ...
  start-app.bat    # Script to run both servers
  README.md
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### 1. Clone the repository
```sh
git clone <repo-url>
cd tracking-app
```

### 2. Backend Setup
```sh
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

#### Run backend server:
```sh
python -m uvicorn app.main:app --reload
```
- The backend will be available at [http://localhost:8000](http://localhost:8000)

### 3. Frontend Setup
```sh
cd frontend
npm install
```

#### Run frontend dev server:
```sh
npm run dev
```
- The frontend will be available at [http://localhost:8081](http://localhost:8081) (or [http://localhost:5173](http://localhost:5173) if not configured)

### 4. Run Both (Recommended)
From the root folder, run:
```sh
start-app.bat
```
This will open two terminals for backend and frontend.

---

## Usage
- Open the frontend URL in your browser.
- Register or log in.
- Search for foods, add to your diary, view stats, and manage your goals.

---

## Development
- **Backend:** Edit files in `backend/app/` and restart the server as needed.
- **Frontend:** Edit files in `frontend/src/` and the dev server will hot-reload changes.

---

## Troubleshooting
- If ports are busy, change them in `vite.config.ts` (frontend) or `start-app.bat` (backend/frontend).
- If CORS errors occur, check `allowed_origins` in `backend/app/main.py`.
- For database issues, check `backend/app/database.py` and `tracking_app.db`.

---

## License
MIT

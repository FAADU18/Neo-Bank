# NeoBankX

Full-stack digital banking app: React (Vite) frontend, Flask API, JWT auth, accounts, transfers, loans, fraud alerts, and admin tools.

**Live app:** [https://neobankx.vercel.app](https://neobankx.vercel.app)

---

## Project structure

```
Banking_App/ 
├── api/                 # Vercel serverless entry (Flask WSGI)
│   ├── index.py
│   └── requirements.txt
├── Backend/             # Flask API (local dev + shared logic)
│   ├── app.py
│   ├── config.py
│   ├── models/
│   ├── routes/
│   └── services/
├── frontend/            # React + Vite UI
│   └── src/
├── vercel.json
└── README.md
```

---

## Local development

### 1. Backend

```bash
cd Backend
pip install -r requirements.txt
python app.py
```

API: `http://localhost:5000`  
Health: `http://localhost:5000/api/health`

Optional: copy `Backend/.env.example` to `Backend/.env` (SQLite is used by default).

**Dev test account** (created automatically in debug mode):

| Field    | Value              |
|----------|--------------------|
| Email    | `test@example.com` |
| Password | `TestPass123!`     |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5174` (Vite proxies `/api` → `http://localhost:5000`).

Both processes must be running for login and registration.

---

## Vercel deployment

The repo deploys frontend + API on one Vercel project. Routes in `vercel.json` send `/api/*` to `api/index.py` and static files to `frontend/dist`.

### Required environment variables (Vercel dashboard)

| Variable         | Example / notes |
|------------------|-----------------|
| `DATABASE_URL`   | `postgresql://user:pass@host:5432/db` from [Neon](https://neon.tech) or [Supabase](https://supabase.com). **Do not use** `sqlite:///banking_app.db` on Vercel — the filesystem is read-only and registration will fail. |
| `JWT_SECRET_KEY` | Long random string |
| `CORS_ORIGINS`   | `https://neobankx.vercel.app,http://localhost:5174` |
| `VITE_API_URL`   | `/api` (set at build; also in `vercel.json` build command) |

After changing env vars, **redeploy** from the Vercel dashboard or push to Git.

### Verify deployment

```bash
curl https://neobankx.vercel.app/api/health
```

Expected: `{"success":true,"message":"NeoBankX API is running",...}`

---

## API overview

Base URL: `/api` (production and local via Vite proxy).

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register (`full_name`, `email`, `phone`, `password`) |
| POST | `/auth/login` | Login (`email`, `password`) |
| GET | `/auth/me` | Current user (Bearer token) |
| PUT | `/auth/profile` | Update profile (Bearer token) |

### Accounts, transactions, loans, admin

| Area | Paths |
|------|--------|
| Accounts | `GET/POST /accounts/`, `GET /accounts/{id}`, `GET /accounts/{id}/balance` |
| Transactions | `POST /transactions/transfer`, `GET /transactions/{account_id}` |
| Loans | `POST /loans/apply`, `GET /loans/my-loans`, approve/reject (admin) |
| Admin | `GET /admin/users`, fraud alerts, freeze account, dashboard |

All protected routes need:

```
Authorization: Bearer <access_token>
```

### Response format

```json
{
  "success": true,
  "message": "Login successful",
  "data": { "user": {}, "tokens": { "access_token": "...", "token_type": "Bearer" } }
}
```

Errors:

```json
{
  "success": false,
  "message": "Invalid email or password",
  "errors": []
}
```

---

## Password rules

- At least 8 characters  
- One uppercase letter  
- One digit  
- One special character (`!@#$%^&*()` etc.)

Example: `SecurePass123!`

---

## Frontend integration

- **HTTP client:** `frontend/src/services/api.js` (Axios, base URL `/api`)
- **Auth state:** `frontend/src/context/AuthContext.jsx` — token in `localStorage.accessToken`
- **Protected routes:** `frontend/src/components/ProtectedRoute.jsx`

```javascript
const { user, isAuthenticated, login, register, logout } = useAuth();
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Login fails locally with generic error | Start backend: `cd Backend && python app.py` |
| `/api/health` returns 500 on Vercel | Set `DATABASE_URL` (PostgreSQL); redeploy. Check Vercel function logs. |
| CORS error in browser | Add your site URL to `CORS_ORIGINS` in Vercel env |
| Frontend calls wrong API | Build must use `VITE_API_URL=/api` (see `vercel.json`) |
| `Email already registered` | Use another email or log in |
| API 500 after deploy | Confirm `DATABASE_URL` uses `postgresql://` (app normalizes `postgres://`) |
| `attempt to write a readonly database` | Remove `sqlite:///…` from Vercel env; set PostgreSQL `DATABASE_URL`, or delete `DATABASE_URL` to use `/tmp` (not persistent) |

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 18, Vite, Tailwind, Framer Motion, Axios |
| Backend | Flask, SQLAlchemy, Flask-JWT-Extended, Flask-CORS |
| Deploy | Vercel (static + Python serverless) |
| Database | SQLite (local), PostgreSQL (production) |

---

## License

Educational / portfolio project.

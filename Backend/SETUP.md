# Backend Setup & Configuration Guide

## Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd Backend
pip install -r requirements.txt
```

### Step 2: Create .env File
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
FLASK_ENV=development
JWT_SECRET_KEY=change-this-to-a-random-string
DATABASE_URL=sqlite:///banking_app.db
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Step 3: Run Backend
```bash
python app.py
```

Backend will start on: `http://localhost:5000`

---

## Database Setup

### SQLite (Default - No Setup Needed)
Database file `banking_app.db` is created automatically.

### PostgreSQL Setup

1. **Install PostgreSQL** on your system

2. **Create database:**
```bash
createdb neobankx_db
```

3. **Update .env:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/neobankx_db
```

### MySQL Setup

1. **Install MySQL** on your system

2. **Create database:**
```bash
mysql -u root -p
CREATE DATABASE neobankx_db;
```

3. **Update .env:**
```env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/neobankx_db
```

4. **Install MySQL driver:**
```bash
pip install PyMySQL
```

---

## JWT Configuration

### Generate Secure Secret Key

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### Update .env
```env
JWT_SECRET_KEY=your-generated-secret-key
```

---

## CORS Configuration

### Add Frontend URLs

```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

Separate multiple URLs with commas (no spaces).

---

## Testing the API

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "TestPass123!"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

Save the returned `access_token`.

### 4. Get Accounts (Authenticated)
```bash
curl -X GET http://localhost:5000/api/accounts/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Password Requirements

Passwords must include:
- ✓ Minimum 8 characters
- ✓ At least 1 uppercase letter
- ✓ At least 1 digit
- ✓ At least 1 special character

**Example:** `SecurePass123!`

---

## Project Structure Explained

```
Backend/
├── app.py
│   └── Main Flask application - entry point
│
├── config.py
│   └── Configuration classes for dev/prod/test
│
├── models/
│   ├── user.py           - User authentication & profile
│   ├── account.py        - Bank accounts with balances
│   ├── transaction.py    - Transfer records
│   ├── loan.py           - Loan applications & tracking
│   ├── fraud_alert.py    - Suspicious transaction flags
│   └── notification.py   - User notifications
│
├── routes/
│   ├── auth.py           - /api/auth/* endpoints
│   ├── accounts.py       - /api/accounts/* endpoints
│   ├── transactions.py   - /api/transactions/* endpoints
│   ├── loans.py          - /api/loans/* endpoints
│   └── admin.py          - /api/admin/* endpoints
│
├── services/
│   ├── auth_service.py        - Login/Register logic
│   ├── account_service.py     - Account operations
│   ├── transaction_service.py - Transfers + Fraud detection
│   └── loan_service.py        - Loan processing
│
├── middleware/
│   └── __init__.py       - JWT verification (@token_required)
│
├── utils/
│   ├── jwt_helper.py     - Token generation
│   ├── response.py       - Standard response formatting
│   ├── validation.py     - Email, phone, password validation
│   └── __init__.py       - Utility functions
│
└── database/
    └── __init__.py       - SQLAlchemy initialization
```

---

## Key Concepts

### JWT Authentication
- User logs in → Gets JWT token
- Token sent with each request in `Authorization` header
- Server verifies token and extracts user ID
- Token expires after 24 hours

### Fraud Detection
Automatic detection for:
- Transfers > ₹50,000
- More than 5 transfers in 5 minutes
- Daily transfers > ₹500,000

### Account Types
- **Savings**: Regular savings account
- **Checking**: Daily transaction account
- **Business**: For business users

---

## Common Issues

### Issue: ModuleNotFoundError: No module named 'flask'

**Solution:**
```bash
pip install -r requirements.txt
```

### Issue: "Cannot import models"

**Solution:** Ensure you're in the `Backend` directory:
```bash
cd Backend
python app.py
```

### Issue: Database locked error

**Solution:** Delete `banking_app.db` and restart:
```bash
rm banking_app.db
python app.py
```

### Issue: JWT_SECRET_KEY error

**Solution:** Add to `.env`:
```env
JWT_SECRET_KEY=your-secret-key-here
```

---

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `FLASK_ENV` | development | Environment mode |
| `JWT_SECRET_KEY` | required | Secret for JWT signing |
| `DATABASE_URL` | sqlite:///banking_app.db | Database connection URL |
| `CORS_ORIGINS` | http://localhost:5173 | Allowed frontend origins |
| `HIGH_AMOUNT_THRESHOLD` | 50000 | Fraud detection limit (₹) |
| `RAPID_TRANSFER_THRESHOLD` | 5 | Max transfers in 5 min |
| `DAILY_LIMIT` | 500000 | Daily transfer limit (₹) |

---

## Database Initialization

The database is automatically created on first run with all tables:

```
✓ users
✓ accounts
✓ transactions
✓ loans
✓ fraud_alerts
✓ notifications
```

---

## Running in Production

1. **Use Gunicorn:**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

2. **Use environment variables:**
```bash
export FLASK_ENV=production
export JWT_SECRET_KEY=your-production-key
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

3. **Set up reverse proxy (Nginx):**
- Forward requests to Gunicorn on port 5000
- Handle HTTPS/SSL
- Configure rate limiting

---

## Next Steps

1. ✅ Backend running
2. ✅ Database configured
3. ✅ API endpoints ready
4. 🔄 Frontend integration (React component setup)
5. 🔄 Test with real transactions
6. 🔄 Monitor fraud alerts
7. 🔄 Deploy to production

---

For detailed API documentation, see [README.md](./README.md)

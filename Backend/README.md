# NeoBankX Backend - SQL-Powered Banking API

Complete production-style banking backend with SQL persistence, JWT authentication, and fraud detection.

## ✨ Features

✅ **Database Persistence** - SQLAlchemy ORM with SQLite/PostgreSQL/MySQL support
✅ **JWT Authentication** - Secure token-based authentication
✅ **User Management** - Registration, login, profile management
✅ **Account Management** - Multiple accounts per user, balance tracking
✅ **Money Transfers** - Secure fund transfers with validation
✅ **Fraud Detection** - Automated detection of suspicious transactions
✅ **Loan Management** - Loan applications with approval workflow
✅ **Admin Dashboard** - User management, fraud alerts, freeze accounts
✅ **Notifications** - User notifications for important events
✅ **Error Handling** - Comprehensive error responses
✅ **CORS Enabled** - Frontend integration ready

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd Backend
pip install -r requirements.txt
```

### 2. Run Backend

```bash
python app.py
```

Backend runs on: `http://localhost:5000`

### 3. Health Check

```bash
curl http://localhost:5000/api/health
```

---

## 📋 API Endpoints

### Authentication Routes

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePass123!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "customer",
      "is_active": true,
      "created_at": "2026-05-11T10:00:00"
    },
    "account": {
      "id": 1,
      "account_number": "123456789012",
      "balance": 0.0,
      "account_type": "savings",
      "status": "active"
    },
    "tokens": {
      "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
      "token_type": "Bearer"
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "tokens": { ... }
  }
}
```

#### Get Current User Profile
```http
GET /api/auth/me
Authorization: Bearer {access_token}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "full_name": "John Updated",
  "phone": "9876543211"
}
```

---

### Account Routes

#### Get All Accounts
```http
GET /api/accounts/
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Accounts retrieved",
  "data": {
    "accounts": [
      {
        "id": 1,
        "account_number": "123456789012",
        "balance": 50000.00,
        "account_type": "savings",
        "status": "active",
        "created_at": "2026-05-11T10:00:00"
      }
    ]
  }
}
```

#### Get Account Details
```http
GET /api/accounts/{account_id}
Authorization: Bearer {access_token}
```

#### Get Account Balance
```http
GET /api/accounts/{account_id}/balance
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Balance retrieved",
  "data": {
    "account_number": "123456789012",
    "balance": 50000.00,
    "account_type": "savings",
    "status": "active"
  }
}
```

#### Create New Account
```http
POST /api/accounts/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "account_type": "checking",
  "initial_balance": 1000.00
}
```

---

### Transaction Routes

#### Transfer Funds
```http
POST /api/transactions/transfer
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "sender_account_id": 1,
  "receiver_account_number": "987654321098",
  "amount": 5000.00,
  "description": "Payment for services"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Transfer successful",
  "data": {
    "id": 1,
    "sender_account_id": 1,
    "receiver_account_id": 2,
    "amount": 5000.00,
    "transaction_type": "transfer",
    "description": "Payment for services",
    "status": "completed",
    "timestamp": "2026-05-11T10:05:00",
    "reference_id": "TX001A2B3C4D"
  }
}
```

#### Get Transaction History
```http
GET /api/transactions/{account_id}?limit=50&offset=0
Authorization: Bearer {access_token}
```

#### Get Transaction Details
```http
GET /api/transactions/{transaction_id}
Authorization: Bearer {access_token}
```

---

### Loan Routes

#### Apply for Loan
```http
POST /api/loans/apply
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "amount": 100000.00,
  "loan_term": 12
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Loan application submitted",
  "data": {
    "id": 1,
    "user_id": 1,
    "amount": 100000.00,
    "interest_rate": 5.0,
    "loan_term": 12,
    "monthly_payment": 8604.50,
    "status": "pending",
    "created_at": "2026-05-11T10:00:00"
  }
}
```

#### Get My Loans
```http
GET /api/loans/my-loans
Authorization: Bearer {access_token}
```

#### Get Loan Details
```http
GET /api/loans/{loan_id}
Authorization: Bearer {access_token}
```

#### Approve Loan (Admin)
```http
POST /api/loans/{loan_id}/approve
Authorization: Bearer {admin_token}
```

#### Reject Loan (Admin)
```http
POST /api/loans/{loan_id}/reject
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "reason": "Insufficient credit history"
}
```

---

### Admin Routes

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer {admin_token}
```

#### Get Fraud Alerts
```http
GET /api/admin/fraud-alerts
Authorization: Bearer {admin_token}
```

#### Review Fraud Alert
```http
POST /api/admin/fraud-alerts/{alert_id}/review
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "action": "approve"
}
```

#### Freeze Account
```http
POST /api/admin/accounts/{account_id}/freeze
Authorization: Bearer {admin_token}
```

#### Deactivate User
```http
POST /api/admin/user/{user_id}/deactivate
Authorization: Bearer {admin_token}
```

#### Admin Dashboard
```http
GET /api/admin/dashboard
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard stats",
  "data": {
    "total_users": 150,
    "total_accounts": 220,
    "pending_loans": 15,
    "unreviewed_fraud_alerts": 3
  }
}
```

---

## 🔒 Fraud Detection System

### Automatic Fraud Detection Triggers

1. **High Amount Transfer** (> ₹50,000)
   - Flags transaction as HIGH risk
   - Requires review before completion

2. **Rapid Multiple Transfers** (5+ in 5 minutes)
   - Flags as CRITICAL risk
   - Immediate freeze recommended

3. **Daily Limit Exceeded** (> ₹500,000)
   - Flags as MEDIUM risk
   - Prevents further transfers

### Fraud Detection Response

```json
{
  "flagged": true,
  "risk_level": "high",
  "reason": "Large transfer amount ₹50,000 exceeds threshold"
}
```

---

## 📁 Project Structure

```
Backend/
├── app.py                 # Main Flask application
├── config.py              # Configuration management
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── models/
│   ├── user.py           # User model
│   ├── account.py        # Account model
│   ├── transaction.py    # Transaction model
│   ├── loan.py           # Loan model
│   ├── fraud_alert.py    # Fraud alert model
│   └── notification.py   # Notification model
├── routes/
│   ├── auth.py           # Authentication endpoints
│   ├── accounts.py       # Account endpoints
│   ├── transactions.py   # Transaction endpoints
│   ├── loans.py          # Loan endpoints
│   └── admin.py          # Admin endpoints
├── services/
│   ├── auth_service.py        # Authentication logic
│   ├── account_service.py     # Account operations
│   ├── transaction_service.py # Transaction & fraud logic
│   └── loan_service.py        # Loan operations
├── middleware/
│   └── __init__.py       # JWT verification decorators
├── utils/
│   ├── jwt_helper.py     # JWT token generation
│   ├── response.py       # Response formatting
│   ├── validation.py     # Input validation
│   └── __init__.py       # Utility functions
└── database/
    └── __init__.py       # Database initialization
```

---

## 🔑 Authentication

### JWT Token Structure

All protected endpoints require:

```
Authorization: Bearer {access_token}
```

### Token Expiration

- **Access Token**: 24 hours
- **Generated on**: Register or Login

### Example Usage

```bash
# Register and get token
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "SecurePass123!"
  }'

# Use token for authenticated request
curl -X GET http://localhost:5000/api/accounts/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

---

## 🛡️ Password Requirements

Passwords must contain:

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 digit
- At least 1 special character (!@#$%^&*()_+-)

**Example:** `SecurePass123!`

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
FLASK_ENV=development
JWT_SECRET_KEY=your-secret-key-change-in-production
DATABASE_URL=sqlite:///banking_app.db
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Database Options

**SQLite (Default):**
```
DATABASE_URL=sqlite:///banking_app.db
```

**PostgreSQL:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/neobankx_db
```

**MySQL:**
```
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/neobankx_db
```

---

## 📊 Database Schema

### Users Table
```sql
- id (Primary Key)
- full_name
- email (Unique)
- phone (Unique)
- password_hash
- role (customer, admin)
- is_active
- created_at
- updated_at
```

### Accounts Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- account_number (Unique)
- balance
- account_type (savings, checking, business)
- status (active, frozen, closed)
- created_at
- updated_at
```

### Transactions Table
```sql
- id (Primary Key)
- sender_account_id (Foreign Key)
- receiver_account_id (Foreign Key)
- amount
- transaction_type (transfer, deposit, withdrawal)
- description
- status (pending, completed, failed, reversed)
- timestamp
- reference_id (Unique)
```

### Loans Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- amount
- interest_rate
- loan_term
- monthly_payment
- status (pending, approved, rejected, active, closed)
- created_at
- approved_at
- updated_at
```

### FraudAlerts Table
```sql
- id (Primary Key)
- transaction_id (Foreign Key)
- user_id (Foreign Key)
- risk_level (low, medium, high, critical)
- reason
- is_reviewed
- action_taken
- created_at
```

### Notifications Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- title
- message
- notification_type (info, warning, alert, success)
- is_read
- created_at
```

---

## 🧪 Testing

### Test User Registration

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

### Test Transfer

```bash
curl -X POST http://localhost:5000/api/transactions/transfer \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "sender_account_id": 1,
    "receiver_account_number": "987654321098",
    "amount": 1000,
    "description": "Test transfer"
  }'
```

---

## 🐛 Error Handling

### Standard Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Specific error 1", "Specific error 2"]
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🚢 Deployment Considerations

For production deployment:

1. **Use PostgreSQL** instead of SQLite
2. **Enable HTTPS/SSL**
3. **Use environment variables** for secrets
4. **Use Gunicorn** or uWSGI instead of Flask dev server
5. **Set up database backups**
6. **Enable rate limiting**
7. **Monitor fraud alerts in real-time**
8. **Set up logging and monitoring**

---

## 📝 Notes

- All monetary amounts are in ₹ (Indian Rupees)
- Passwords are hashed using bcrypt
- JWT tokens are signed with HS256 algorithm
- Fraud detection is automatic and real-time
- Admin features require `admin` role
- Database is created automatically on first run

---

## 🤝 Integration with Frontend

The backend is fully compatible with the NeoBankX React frontend.

### CORS Configuration

```python
CORS_ORIGINS=http://localhost:5173
```

### API Base URL (Frontend)

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://sqlalchemy.org/)
- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/)
- [JWT.io](https://jwt.io/) - JWT Debugger

---

**Status**: ✅ Production-Ready  
**Version**: 1.0.0  
**Last Updated**: May 11, 2026

# Transaction System Migration Guide

## Quick Start for Database Setup

### Step 1: Backup Current Database
```bash
# Windows
copy Backend\banking_app.db Backend\banking_app.db.backup
```

### Step 2: Verify Backend Changes
Ensure these files are updated:
- ✅ Backend/models/transaction.py
- ✅ Backend/utils/__init__.py
- ✅ Backend/services/transaction_service.py
- ✅ Backend/routes/transactions.py
- ✅ Backend/routes/admin.py

### Step 3: Initialize/Migrate Database

The Flask app automatically creates tables on startup.

**Option A: Fresh Database** (Recommended for Development)
```bash
# Delete old database
del Backend\banking_app.db

# Restart Flask - creates new schema automatically
cd Backend
$env:SQLALCHEMY_WARN_20=1
python app.py
```

**Option B: Migrate Existing Database**
```bash
# Start Flask - it will add missing columns
cd Backend
$env:SQLALCHEMY_WARN_20=1
python app.py
```

### Step 4: Verify Migration

Connect to database and check:
```bash
cd Backend
sqlite3 banking_app.db

-- Check transaction table schema
.schema transactions

-- Should show:
-- transaction_id VARCHAR(50) UNIQUE
-- sender_account_id INTEGER
-- receiver_account_id INTEGER  
-- status VARCHAR(20)
-- timestamp DATETIME

-- Count transactions
SELECT COUNT(*) FROM transactions;
```

### Step 5: Test the System

#### 1. Create Test Account
```bash
# Go to http://localhost:5174
# Register new account with name "Sender User"
# Note the account number shown
```

#### 2. Create Second Test Account
```bash
# Logout and register another account "Receiver User"
# Note the account number
```

#### 3. Test Transfer
```bash
# Login as Sender User
# Go to Transfer page
# Fill:
#   From Account: Sender's account
#   Receiver Account: Receiver's account number
#   Amount: 1000
#   Description: "Test Transfer"
# Click "Send money instantly"
```

#### 4. Verify Transaction ID
```bash
# Should see success message with:
# ✓ Transfer successful
# Transaction ID: TXN202605140001 (or similar)
# [Copy] button
```

#### 5. Check Transaction History
```bash
# Click Copy button - clipboard should have transaction ID
# Go to Transactions page
# Should see transaction with:
#   - Transaction ID (TXN...)
#   - "Sent to [account]"
#   - Amount: -₹1000 (red)
#   - Status: completed
```

#### 6. Check Receiver's View
```bash
# Logout and login as Receiver User
# Go to Transactions page
# Should see SAME transaction with:
#   - Same Transaction ID (TXN...)
#   - "Received from [account]"
#   - Amount: +₹1000 (green)
#   - Status: completed
```

#### 7. Admin Dashboard
```bash
# Make Receiver User an admin:
#   - Connect to DB: sqlite3 Backend\banking_app.db
#   - UPDATE users SET role='admin' WHERE id=2;
#
# Login as Admin
# Go to /admin page
# Should see:
#   - Total Transactions: 1
#   - Transaction listed with TXN...
#   - Amount shown
#   - Status shown
```

#### 8. Search by Transaction ID
```bash
# Admin dashboard -> search box
# Paste transaction ID (TXN...)
# Should find the transaction
```

### Step 6: Verify Data Integrity

```bash
# Check balances were updated
SELECT a.account_number, a.balance, u.full_name 
FROM accounts a 
JOIN users u ON a.user_id = u.id;

-- Sender should have reduced balance
-- Receiver should have increased balance

# Check transaction record
SELECT * FROM transactions 
WHERE transaction_id LIKE 'TXN%';

-- Should show:
-- transaction_id: TXN202605140001
-- sender_account_id: 1
-- receiver_account_id: 2  
-- amount: 1000
-- status: completed
```

### Step 7: Test Error Cases

#### Test 1: Insufficient Balance
```
- Try to send more than available balance
- Should get error: "Insufficient balance"
- Balance should NOT change
- No transaction created
```

#### Test 2: Invalid Account
```
- Try to send to non-existent account number
- Should get error: "Receiver account not found"
- Balance should NOT change
- No transaction created
```

#### Test 3: Self Transfer
```
- Try to send to your own account
- Should get error: "Cannot transfer to the same account"
- Balance should NOT change
- No transaction created
```

#### Test 4: Fraud Detection
```
- Send amount > ₹50,000
- Should see: "Transfer successful" but status "pending"
- Transaction should be flagged in fraud_alerts table
- Admin should see fraud alert
```

### Troubleshooting

#### Issue: transaction_id column doesn't exist
**Solution:**
```bash
# Delete old database and restart
del Backend\banking_app.db
# Restart Flask - creates new schema
```

#### Issue: Transaction appears only for sender, not receiver
**Solution:**
- Check receiver_account_id is saved correctly
- Verify receiver can query transaction history
- Check authorization isn't blocking receiver

#### Issue: Balances not updating
**Solution:**
- Ensure both balance updates are in same transaction
- Check commit is happening
- Look for exceptions in Flask logs

#### Issue: Transaction ID not unique
**Solution:**
- Check generate_transaction_id() is working
- Ensure database commit happens
- Try deleting banking_app.db and restarting

---

## Performance Testing

### Load Test Script
```python
# Test with 1000 transactions
import requests
import time

BASE_URL = "http://localhost:5174"
TX_URL = "http://localhost:5000/api/transactions/transfer"

# Login
response = requests.post(f"{BASE_URL}/api/auth/login", json={
    "email": "test@gmail.com",
    "password": "Test@1234"
})

token = response.json()["tokens"]["access_token"]

# Create 1000 transactions
headers = {"Authorization": f"Bearer {token}"}

start = time.time()
for i in range(1000):
    requests.post(TX_URL, json={
        "sender_account_id": 1,
        "receiver_account_number": "123456789012",
        "amount": 100 + i,
        "description": f"Test transaction {i}"
    }, headers=headers)
    
    if i % 100 == 0:
        print(f"Created {i} transactions")

elapsed = time.time() - start
print(f"Total time: {elapsed}s")
print(f"Rate: {1000/elapsed:.0f} transactions/sec")
```

---

## Deployment Checklist

- [ ] Backup database
- [ ] Update all backend files
- [ ] Update all frontend files
- [ ] Start fresh or run migration
- [ ] Test basic transfer flow
- [ ] Test sender/receiver perspective
- [ ] Test transaction history
- [ ] Test admin dashboard
- [ ] Test search by transaction ID
- [ ] Test error cases
- [ ] Check database indexes
- [ ] Verify transaction IDs are unique
- [ ] Monitor performance
- [ ] Document any issues

---

## Rollback Plan

If something goes wrong:

### Option 1: Restore from Backup
```bash
del Backend\banking_app.db
copy Backend\banking_app.db.backup Backend\banking_app.db
```

### Option 2: Revert Code Changes
```bash
git checkout Backend/
git checkout frontend/
```

---

## Verification Commands

```bash
# Count transactions
sqlite3 Backend\banking_app.db "SELECT COUNT(*) FROM transactions;"

# Check transaction IDs
sqlite3 Backend\banking_app.db "SELECT transaction_id, amount, status FROM transactions LIMIT 10;"

# Check balances
sqlite3 Backend\banking_app.db "SELECT a.account_number, a.balance FROM accounts a;"

# Check fraud alerts
sqlite3 Backend\banking_app.db "SELECT t.transaction_id, f.reason FROM fraud_alerts f JOIN transactions t ON f.transaction_id = t.id;"
```

---

## Next Steps After Migration

1. **Monitor**: Watch for errors in first 24 hours
2. **Backup**: Keep backup for 1 week
3. **Performance**: Monitor transaction processing time
4. **User Feedback**: Collect feedback on transaction ID display
5. **Enhancement**: Plan Phase 2 features (receipts, QR codes, etc.)

---

**Last Updated**: May 14, 2026  
**Version**: 1.0  

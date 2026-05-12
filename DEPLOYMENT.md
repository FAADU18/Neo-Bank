# Deployment & Verification Guide

## System Requirements
- Node.js 16+ (for frontend)
- Python 3.9+ (for backend)
- npm or yarn
- SQLite or PostgreSQL (backend database)

## Getting Started (Development)

### 1. Terminal 1: Start Backend
```bash
cd Backend
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database
python -c "from app import app, db; app.app_context().push(); db.create_all()"

# Run backend
python app.py
# Backend runs on http://localhost:5000
```

### 2. Terminal 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5174
```

### 3. Verify Integration
1. Open http://localhost:5174 in browser
2. You should see the NeoBankX login page
3. Register a new account or login with test credentials
4. Dashboard should load with real data
5. All pages should display data from backend

## Environment Configuration

### Backend (.env file)
Create `.env` in Backend/ directory:
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-this
JWT_SECRET_KEY=your-jwt-secret-change-this
DATABASE_URL=sqlite:///banking_app.db  # or postgresql://user:password@localhost/bankingapp
CORS_ORIGINS=http://localhost:5174,http://localhost:3000
```

### Frontend (.env files)
Development (`.env.development`):
```env
VITE_API_URL=http://localhost:5000/api
```

Production (`.env.production`):
```env
VITE_API_URL=/api
```

## Database Setup

### SQLite (Default)
- Automatically created at `Backend/banking_app.db`
- No additional setup needed
- Good for development

### PostgreSQL (Recommended for Production)
1. Install PostgreSQL
2. Create database:
   ```sql
   CREATE DATABASE banking_app;
   ```
3. Update `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost/banking_app
   ```
4. Run migrations:
   ```bash
   python -c "from app import app, db; app.app_context().push(); db.create_all()"
   ```

## Verification Steps

### Backend Verification
```bash
# Check health
curl http://localhost:5000/api/health

# Should return:
# {"success": true, "message": "API is healthy"}

# Check if database is initialized
ls -la Backend/banking_app.db
```

### Frontend Verification
1. Register new account
2. Verify token in localStorage:
   - Open DevTools → Application → Storage → Local Storage
   - Should see `accessToken` and `user` keys
3. Navigate to different pages
4. Verify data loads correctly

### API Verification
```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "TestPassword123!"
  }'

# Should return user object with tokens
```

## Production Deployment

### Frontend Build
```bash
cd frontend
npm run build
# Creates optimized dist/ folder
```

### Backend Production Setup
1. Use production-grade database (PostgreSQL)
2. Set `FLASK_ENV=production`
3. Use proper WSGI server:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

### Full Stack Deployment
1. **Backend**: Deploy backend server (separate port or same origin)
2. **Frontend**: Build and serve from backend static folder
3. **Database**: Use PostgreSQL on production server
4. **Domain**: Point domain to backend server
5. **HTTPS**: Enable SSL/TLS certificates

### Docker Deployment (Recommended)
```dockerfile
# Backend Dockerfile
FROM python:3.9
WORKDIR /app
COPY Backend/requirements.txt .
RUN pip install -r requirements.txt
COPY Backend . 
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]

# Frontend Dockerfile
FROM node:16 as build
WORKDIR /app
COPY frontend/package*.json .
RUN npm install
COPY frontend . 
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
```

## Testing Scenarios

### Test Case 1: Registration Flow
1. Click "Register" on login page
2. Fill in: Name, Email, Phone, Password
3. Accept terms and submit
4. Should see "Account created successfully"
5. Dashboard loads automatically
6. Can see default savings account created

### Test Case 2: Transfer Flow
1. Go to Transfer page
2. Select account from dropdown
3. Enter receiver account number (from another account)
4. Enter amount
5. Submit transfer
6. Should see success notification
7. Transaction appears in history

### Test Case 3: Loan Application
1. Go to Loans page
2. Enter loan amount and tenure
3. See estimated monthly payment
4. Click "Apply for loan"
5. See success notification
6. Loan appears in "Your loans" section

### Test Case 4: Admin Access
1. Login with admin account
2. Go to Admin page
3. Should see:
   - Dashboard stats (users, accounts, pending loans)
   - Recent transactions
   - Fraud alerts
   - Security status
4. Verify all data loads correctly

### Test Case 5: Fraud Detection
1. Create transfer with amount > ₹50,000
2. Should see fraud alert in system
3. Go to Fraud Monitor page
4. Alert should appear with risk level
5. Admin can review alert

## Troubleshooting

### Issue: Frontend can't connect to backend
**Solutions**:
- Verify backend is running: `curl http://localhost:5000/api/health`
- Check VITE_API_URL in .env.development
- Check CORS configuration in backend
- Clear browser cache and localStorage

### Issue: Login returns 401
**Solutions**:
- Verify credentials are correct
- Check password meets requirements (8+ chars, uppercase, digit, special char)
- Check if user account exists in database
- Verify JWT_SECRET_KEY is set

### Issue: Database error on startup
**Solutions**:
- Delete `banking_app.db` and let it recreate
- Verify SQLAlchemy models are correct
- Check database permissions
- Run migration: `python -c "from app import app, db; app.app_context().push(); db.create_all()"`

### Issue: CORS errors
**Solutions**:
- Verify CORS is enabled in backend
- Check CORS_ORIGINS includes frontend URL
- Verify frontend and backend are on correct URLs
- Check browser console for exact error

### Issue: Token expiration
**Solutions**:
- JWT tokens expire after 24 hours
- User must re-login after expiration
- Automatic redirect to login on 401 response
- Token refreshed if page reloaded with valid token

## Performance Optimization

### Frontend
- Build optimization: `npm run build` creates minified assets
- Asset compression enabled by default
- Code splitting by route
- Image optimization in Vite config

### Backend
- Database connection pooling
- Query optimization with SQLAlchemy
- Pagination support (limit, offset parameters)
- Caching for frequently accessed data
- GZIP compression enabled

## Security Checklist

### Frontend
- [ ] HTTPS enabled in production
- [ ] No sensitive data in localStorage except token
- [ ] Input validation on all forms
- [ ] CSRF protection (if needed)
- [ ] Rate limiting on forms

### Backend
- [ ] Environment variables for secrets
- [ ] Password hashing with bcrypt
- [ ] JWT verification on protected routes
- [ ] SQL injection prevention via ORM
- [ ] CORS properly configured
- [ ] Rate limiting on API endpoints
- [ ] Database backups configured

## Monitoring & Logging

### What to Monitor
- API response times
- Error rates (4xx, 5xx)
- User registration/login activity
- Transaction volumes
- Fraud alert triggers
- Database performance

### Log Location
- Backend: Console output (can be redirected to file)
- Frontend: Browser console (DevTools)
- Database: Check SQLite/PostgreSQL logs

## Scaling Considerations

### Database
- SQLite → PostgreSQL for concurrent users
- Add indexes on frequently queried columns
- Implement caching layer (Redis)
- Database replication for failover

### Backend
- Horizontal scaling with load balancer
- Session management across instances
- Asynchronous job processing
- Rate limiting per user

### Frontend
- CDN for static assets
- Progressive Web App (PWA) features
- Service workers for offline support
- Code splitting optimization

## Support Resources

- Backend README: `Backend/README.md`
- Database Setup: `Backend/SETUP.md`
- Frontend README: `frontend/README.md`
- Integration Guide: `FRONTEND_INTEGRATION.md`
- Quick Reference: `INTEGRATION_QUICK_REFERENCE.md`

## Version Info
- Backend Framework: Flask 3.0.0
- Frontend Framework: React 18.2.0
- Database ORM: SQLAlchemy 2.0.24
- HTTP Client: Axios 1.7.0
- Build Tool: Vite 5.4.21
- CSS Framework: Tailwind CSS 3.4.15
- Animation: Framer Motion 10.16.0

## Next Steps After Deployment
1. Create admin user accounts
2. Test all major workflows
3. Set up database backups
4. Configure monitoring/alerting
5. Plan for maintenance windows
6. Document any customizations
7. Train support team
8. Launch soft beta testing

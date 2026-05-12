# Quick Reference: Frontend-Backend API Integration

## API Base URL
- Development: `http://localhost:5000/api`
- Production: `/api` (relative path)

## Authentication
- Method: JWT Bearer Token
- Header: `Authorization: Bearer {token}`
- Token Storage: `localStorage.accessToken`
- Duration: 24 hours

## Common API Response Format
```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": { /* payload */ }
}
```

## Key Hooks & Components

### useAuth()
```javascript
const { user, isAuthenticated, isAdmin, loading, error, login, register, logout } = useAuth();
```

### useDashboard()
```javascript
const { 
  accounts, 
  transactions, 
  loans, 
  alerts, 
  stats, 
  loading, 
  addTransaction, 
  addLoanApplication 
} = useDashboard();
```

### useNotifications()
```javascript
const { notifications, addNotification } = useNotifications();
addNotification({
  title: "Success",
  message: "Operation completed",
  level: "success",
  time: "Now"
});
```

## API Endpoints Quick Reference

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)

### Accounts
- `GET /api/accounts/` - List all user accounts (requires auth)
- `GET /api/accounts/{id}` - Get account details (requires auth)
- `GET /api/accounts/{id}/balance` - Get account balance (requires auth)
- `POST /api/accounts/` - Create new account (requires auth)

### Transactions
- `POST /api/transactions/transfer` - Send money (requires auth)
- `GET /api/transactions/{account_id}` - Get transaction history (requires auth)
- `GET /api/transactions/{transaction_id}` - Get transaction details (requires auth)

### Loans
- `POST /api/loans/apply` - Apply for loan (requires auth)
- `GET /api/loans/my-loans` - List user loans (requires auth)
- `GET /api/loans/{id}` - Get loan details (requires auth)
- `POST /api/loans/{id}/approve` - Approve loan (requires admin)
- `POST /api/loans/{id}/reject` - Reject loan (requires admin)

### Admin
- `GET /api/admin/users` - List all users (requires admin)
- `GET /api/admin/fraud-alerts` - List fraud alerts (requires admin)
- `POST /api/admin/fraud-alerts/{id}/review` - Review alert (requires admin)
- `POST /api/admin/accounts/{id}/freeze` - Freeze account (requires admin)
- `POST /api/admin/user/{id}/deactivate` - Deactivate user (requires admin)
- `GET /api/admin/dashboard` - Get dashboard stats (requires admin)

## Common Error Codes
- `200` - Success
- `201` - Created
- `400` - Validation error
- `401` - Unauthorized (redirect to login)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

## Component Import Patterns

### Pages
```javascript
import DashboardPage from '@/pages/DashboardPage';
import TransferPage from '@/pages/TransferPage';
import LoansPage from '@/pages/LoansPage';
```

### Components
```javascript
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Toast from '@/components/ui/Toast';
```

### Services
```javascript
import { authAPI, accountAPI, transactionAPI, loanAPI, adminAPI } from '@/services/api';
```

## Form Validation Examples

### Password Validation
```javascript
const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push('8+ characters');
  if (!/[A-Z]/.test(password)) errors.push('Uppercase letter');
  if (!/\d/.test(password)) errors.push('Number');
  if (!/[!@#$%^&*]/.test(password)) errors.push('Special character (!@#$%^&*)');
  return errors;
};
```

### Email Validation
```javascript
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
```

### Phone Validation
```javascript
const validatePhone = (phone) => /^\d{10,15}$/.test(phone);
```

## Error Handling Pattern
```javascript
try {
  const response = await api.call();
  // Success handling
} catch (err) {
  const message = err.response?.data?.message || err.message;
  setError(message);
  addNotification({
    title: 'Error',
    message: message,
    level: 'error',
    time: 'Now'
  });
}
```

## Loading State Pattern
```javascript
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // API call
  } finally {
    setLoading(false);
  }
};

return (
  <Button disabled={loading}>
    {loading ? 'Loading...' : 'Submit'}
  </Button>
);
```

## Protected Route Pattern
```javascript
import ProtectedRoute from '@/components/ProtectedRoute';

<Routes>
  <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
    <Route path="/dashboard" element={<DashboardPage />} />
  </Route>
  
  <Route element={<ProtectedRoute requireAdmin><DashboardLayout /></ProtectedRoute>}>
    <Route path="/admin" element={<AdminPage />} />
  </Route>
</Routes>
```

## Testing Credentials
- Email: test@example.com
- Password: TestPassword123!
- Phone: 9876543210

## Debugging Tips

### Check Token
```javascript
console.log(localStorage.getItem('accessToken'));
```

### Check User State
```javascript
const { user } = useAuth();
console.log(user);
```

### Check API Response
```javascript
const response = await transactionAPI.transfer(data);
console.log(response.data);
```

### Enable API Logging
```javascript
// In api.js, uncomment or add:
console.log('Request:', response.config);
console.log('Response:', response.data);
```

## Common Issues & Solutions

### Issue: 401 Unauthorized
- **Solution**: Check if token is in localStorage
- **Action**: Re-login if token expired or corrupted

### Issue: CORS Error
- **Solution**: Ensure backend has CORS enabled
- **Check**: Backend app.py has `CORS(app)` configured

### Issue: API not found (404)
- **Solution**: Verify backend is running on http://localhost:5000
- **Action**: Check `VITE_API_URL` environment variable

### Issue: Form submission disabled
- **Solution**: Check form validation errors
- **Action**: Verify all required fields are filled

## Performance Monitoring

### Network Tab
- Check request/response sizes
- Monitor API response times
- Verify no 5xx errors

### React DevTools
- Check component render times
- Verify context updates
- Monitor state changes

### Console
- Check for warnings/errors
- Verify no unhandled promise rejections
- Monitor API call logs

## Production Checklist
- [ ] Environment variables set correctly
- [ ] Backend CORS configured for production domain
- [ ] Database backups configured
- [ ] Error logging enabled
- [ ] Rate limiting configured
- [ ] HTTPS enabled
- [ ] Security headers set
- [ ] JWT expiry appropriate
- [ ] Sensitive data not logged
- [ ] Build optimizations applied

## Support & Documentation
- Backend README: `Backend/README.md`
- API Documentation: `Backend/README.md` (API Reference section)
- Database Schema: `Backend/SETUP.md`
- Frontend Setup: `frontend/README.md`
- Integration Details: `FRONTEND_INTEGRATION.md`

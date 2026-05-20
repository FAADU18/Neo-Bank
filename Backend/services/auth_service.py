"""Authentication service"""
from database import db
from models import User, Account
from utils.jwt_helper import generate_tokens
from utils.validation import validate_email, validate_password, validate_phone


def _friendly_db_error(action, exc):
    message = str(exc).lower()
    if 'readonly' in message or 'read-only' in message:
        return (
            f"{action} failed: database is read-only on this server. "
            "In Vercel, set DATABASE_URL to a PostgreSQL URL (Neon/Supabase), "
            "or remove a sqlite:/// DATABASE_URL so the app uses /tmp."
        )
    return f"{action} failed. Please try again later."


class AuthService:
    """Service for authentication operations"""
    
    @staticmethod
    def register(full_name, email, phone, password):
        """Register a new user"""
        try:
            if not validate_email(email):
                return None, "Invalid email format"

            if not validate_phone(phone):
                return None, "Invalid phone format"

            is_valid, errors = validate_password(password)
            if not is_valid:
                return None, "; ".join(errors)

            if User.query.filter_by(email=email).first():
                return None, "Email already registered"

            if User.query.filter_by(phone=phone).first():
                return None, "Phone number already registered"
            user = User(
                full_name=full_name,
                email=email,
                phone=phone,
                role='customer'
            )
            user.set_password(password)
            db.session.add(user)
            db.session.flush()
            
            # Create default account for user
            account = Account(
                user_id=user.id,
                account_number=Account.generate_account_number(),
                account_type='savings',
                balance=0.0,
                status='active'
            )
            db.session.add(account)
            db.session.commit()
            
            tokens = generate_tokens(user.id)
            return {
                'user': user.to_dict(),
                'account': account.to_dict(),
                'tokens': tokens
            }, None
        except Exception as e:
            db.session.rollback()
            return None, _friendly_db_error('Registration', e)

    @staticmethod
    def login(email, password):
        """Authenticate user and return tokens"""
        try:
            user = User.query.filter_by(email=email).first()

            if not user or not user.check_password(password):
                return None, "Invalid email or password"

            if not user.is_active:
                return None, "User account is inactive"

            tokens = generate_tokens(user.id)
            return {
                'user': user.to_dict(),
                'tokens': tokens
            }, None
        except Exception as e:
            db.session.rollback()
            return None, _friendly_db_error('Login', e)
    
    @staticmethod
    def get_user(user_id):
        """Get user by ID"""
        user = User.query.get(user_id)
        if not user:
            return None, "User not found"
        return user.to_dict(), None
    
    @staticmethod
    def update_profile(user_id, **kwargs):
        """Update user profile"""
        user = User.query.get(user_id)
        if not user:
            return None, "User not found"
        
        try:
            for key, value in kwargs.items():
                if key in ['full_name', 'phone'] and value:
                    setattr(user, key, value)
            
            db.session.commit()
            return user.to_dict(), None
        except Exception as e:
            db.session.rollback()
            return None, _friendly_db_error('Update', e)

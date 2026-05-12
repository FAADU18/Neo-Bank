"""JWT verification middleware"""
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from utils.response import error_response

def token_required(f):
    """Decorator to require JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            return f(current_user_id, *args, **kwargs)
        except Exception as e:
            return error_response("Unauthorized", status_code=401)
    return decorated

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            from models import User
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user or user.role != 'admin':
                return error_response("Admin access required", status_code=403)
            
            return f(current_user_id, *args, **kwargs)
        except Exception as e:
            return error_response("Unauthorized", status_code=401)
    return decorated

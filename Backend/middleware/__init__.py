"""JWT verification middleware"""
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import request
from utils.response import error_response

def token_required(f):
    """Decorator to require JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            # Identity is stored as string in JWT, convert back to int
            current_user_id = int(get_jwt_identity())
            return f(current_user_id, *args, **kwargs)
        except Exception as e:
            # Check if Authorization header is present
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return error_response("Missing authorization token", status_code=401)
            
            # Log the error for debugging
            import sys
            print(f"JWT Error: {str(e)}", file=sys.stderr)
            return error_response("Invalid or expired token", status_code=401)
    return decorated

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            from models import User
            # Identity is stored as string in JWT, convert back to int
            current_user_id = int(get_jwt_identity())
            user = User.query.get(current_user_id)
            
            if not user or user.role != 'admin':
                return error_response("Admin access required", status_code=403)
            
            return f(current_user_id, *args, **kwargs)
        except Exception as e:
            return error_response("Unauthorized", status_code=401)
    return decorated

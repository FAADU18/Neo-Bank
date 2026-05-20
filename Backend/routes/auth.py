"""Authentication routes"""
from flask import Blueprint, jsonify, request
from services import AuthService
from utils.response import success_response, error_response


def _json_response(payload, status_code):
    return jsonify(payload), status_code

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register new user"""
    data = request.get_json() or {}
    
    required_fields = ['full_name', 'email', 'phone', 'password']
    if not all(field in data for field in required_fields):
        return error_response("Missing required fields", status_code=400)
    
    result, error = AuthService.register(
        data['full_name'],
        data['email'],
        data['phone'],
        data['password']
    )
    
    if error:
        body, code = error_response(error, status_code=400)
        return _json_response(body, code)

    body, code = success_response("Registration successful", result, 201)
    return _json_response(body, code)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json() or {}
    
    if 'email' not in data or 'password' not in data:
        return error_response("Email and password required", status_code=400)
    
    result, error = AuthService.login(data['email'], data['password'])
    
    if error:
        body, code = error_response(error, status_code=401)
        return _json_response(body, code)

    body, code = success_response("Login successful", result, 200)
    return _json_response(body, code)

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current user profile (requires auth)"""
    from middleware import token_required
    from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
    
    try:
        verify_jwt_in_request()
        current_user_id = int(get_jwt_identity())
        result, error = AuthService.get_user(current_user_id)
        if error:
            return error_response(error, status_code=404)
        return success_response("User found", result)
    except Exception as e:
        return error_response("Invalid or expired token", status_code=401)

@auth_bp.route('/profile', methods=['PUT'])
def update_profile():
    """Update user profile"""
    from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
    
    try:
        verify_jwt_in_request()
        current_user_id = int(get_jwt_identity())
        data = request.get_json() or {}
        result, error = AuthService.update_profile(current_user_id, **data)
        if error:
            return error_response(error, status_code=400)
        return success_response("Profile updated", result)
    except Exception as e:
        return error_response("Invalid or expired token", status_code=401)

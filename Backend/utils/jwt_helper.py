"""JWT Token utilities"""
from flask_jwt_extended import create_access_token
from config import Config

def generate_tokens(user_id):
    """Generate access and refresh tokens for a user"""
    # Convert user_id to string to satisfy JWT requirements
    access_token = create_access_token(
        identity=str(user_id),
        expires_delta=Config.JWT_ACCESS_TOKEN_EXPIRES
    )
    return {
        'access_token': access_token,
        'token_type': 'Bearer'
    }

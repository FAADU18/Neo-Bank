"""NeoBankX Flask API - Main Application"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# Load environment variables (important for local development)
load_dotenv()

# Import configuration
from config import DevelopmentConfig, ProductionConfig, TestingConfig
from database import db, init_db

# Import routes
from routes import auth_bp, account_bp, transaction_bp, loan_bp, admin_bp

def create_app(config_name='development'):
    """Application factory"""
    app = Flask(__name__)
    
    # Load config
    config_dict = {
        'development': DevelopmentConfig,
        'production': ProductionConfig,
        'testing': TestingConfig
    }
    app.config.from_object(config_dict.get(config_name, DevelopmentConfig))
    
    # Initialize extensions
    CORS(app, origins=app.config['CORS_ORIGINS'], supports_credentials=True)
    db.init_app(app)
    jwt = JWTManager(app)
    
    # JWT error handlers
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'success': False,
            'message': 'Request does not contain an access token',
            'error': error
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'success': False,
            'message': 'Invalid access token',
            'error': error
        }), 401
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'message': 'Access token has expired',
        }), 401
    
    # Create database tables
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            # In production, database might already be initialized
            app.logger.warning(f"Database initialization warning: {str(e)}")
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(account_bp)
    app.register_blueprint(transaction_bp)
    app.register_blueprint(loan_bp)
    app.register_blueprint(admin_bp)
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'success': True,
            'message': 'NeoBankX API',
            'version': '1.0.0',
            'endpoints': {
                'health': '/api/health',
                'auth': '/api/auth',
                'accounts': '/api/accounts',
                'transactions': '/api/transactions',
                'loans': '/api/loans',
                'admin': '/api/admin'
            }
        }), 200
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'success': True,
            'message': 'NeoBankX API is running',
            'status': 'healthy',
            'environment': config_name
        }), 200
    
    # Debug token endpoint
    @app.route('/api/debug/token', methods=['GET'])
    def debug_token():
        """Debug endpoint to check token validation"""
        from flask import request
        from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
        
        auth_header = request.headers.get('Authorization')
        
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            return jsonify({
                'success': True,
                'message': 'Token is valid',
                'user_id': user_id,
                'auth_header': auth_header[:20] + '...' if auth_header else None
            }), 200
        except Exception as e:
            return jsonify({
                'success': False,
                'message': str(e),
                'auth_header_present': bool(auth_header),
                'auth_header': auth_header[:50] + '...' if auth_header else 'None'
            }), 401
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'message': 'Endpoint not found',
            'error': str(error)
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Internal server error',
            'error': str(error)
        }), 500
    
    return app

if __name__ == '__main__':
    # Get environment
    env = os.getenv('FLASK_ENV', 'development')
    app = create_app(env)
    
    # Run application
    debug = env == 'development'
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=debug
    )


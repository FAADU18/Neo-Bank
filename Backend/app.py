"""NeoBankX Flask API - Main Application"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# Load environment variables
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
    CORS(app, origins=app.config['CORS_ORIGINS'])
    db.init_app(app)
    JWTManager(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(account_bp)
    app.register_blueprint(transaction_bp)
    app.register_blueprint(loan_bp)
    app.register_blueprint(admin_bp)
    
    # Health check
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'success': True,
            'message': 'NeoBankX API is running',
            'status': 'healthy'
        }), 200
    
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

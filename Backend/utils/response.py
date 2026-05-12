"""Response formatting utilities"""

def success_response(message="Success", data=None, status_code=200):
    """Format successful response"""
    response = {
        'success': True,
        'message': message,
        'data': data or {}
    }
    return response, status_code

def error_response(message="Error", errors=None, status_code=400):
    """Format error response"""
    response = {
        'success': False,
        'message': message,
        'errors': errors or []
    }
    return response, status_code

def paginated_response(items, page=1, per_page=10, total=None, status_code=200):
    """Format paginated response"""
    response = {
        'success': True,
        'data': items,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total or len(items)
        }
    }
    return response, status_code

# app.py - Main Flask application for Route Venture

from flask import Flask, render_template, request, jsonify, redirect, url_for
import database as db
from config import config

app = Flask(__name__)
app.config.from_object(config['development'])

# Initialize database on startup
with app.app_context():
    db.init_db()

# ==================== WEB PAGE ROUTES ====================

@app.route('/')
def index():
    """Home page"""
    return render_template('index.html')

@app.route('/home')
def home():
    """Home page with introduction"""
    return render_template('home.html')

@app.route('/enroll')
def enroll_page():
    """Event enrollment page - shows all available events"""
    return render_template('enroll.html')

@app.route('/create')
def create_page():
    """Event creation page"""
    return render_template('create.html')

@app.route('/admin')
def admin_page():
    """Admin dashboard page"""
    return render_template('admin.html')

# ==================== USER API ENDPOINTS ====================

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users"""
    try:
        users = db.get_all_users()
        return jsonify([dict(user) for user in users]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get specific user by ID"""
    try:
        user = db.get_user_by_id(user_id)
        if user:
            return jsonify(dict(user)), 200
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/add', methods=['POST'])
def add_user():
    """Add a new user"""
    try:
        data = request.get_json()
        
        if not data or 'name' not in data or 'email' not in data:
            return jsonify({'error': 'Name and email are required'}), 400
        
        user_id = db.add_user(data['name'], data['email'])
        return jsonify({
            'message': 'User added successfully',
            'id': user_id
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/update/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user information"""
    try:
        user = db.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        db.update_user(user_id, data.get('name'), data.get('email'))
        
        return jsonify({'message': 'User updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user"""
    try:
        user = db.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        db.delete_user(user_id)
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== EVENT API ENDPOINTS ====================

@app.route('/api/events', methods=['GET'])
def get_events():
    """Get all events"""
    try:
        events = db.get_all_events()
        return jsonify([dict(event) for event in events]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/event/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """Get specific event by ID"""
    try:
        event = db.get_event_by_id(event_id)
        if event:
            return jsonify(dict(event)), 200
        return jsonify({'error': 'Event not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/event/add', methods=['POST'])
def add_event():
    """Add a new event"""
    try:
        data = request.get_json()
        
        required_fields = ['title', 'description', 'event_type', 'location', 'event_date', 'event_time']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'All required fields must be provided'}), 400
        
        event_id = db.add_event(
            data['title'],
            data['description'],
            data['event_type'],
            data['location'],
            data['event_date'],
            data['event_time'],
            data.get('max_participants'),
            data.get('created_by')
        )
        
        return jsonify({
            'message': 'Event created successfully',
            'id': event_id
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/event/update/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    """Update event information"""
    try:
        event = db.get_event_by_id(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        data = request.get_json()
        db.update_event(event_id, **data)
        
        return jsonify({'message': 'Event updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/event/delete/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    """Delete an event"""
    try:
        event = db.get_event_by_id(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        db.delete_event(event_id)
        return jsonify({'message': 'Event deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== ENROLLMENT API ENDPOINTS ====================

@app.route('/api/enroll', methods=['POST'])
def enroll():
    """Enroll a user in an event"""
    try:
        data = request.get_json()
        
        if not data or 'event_id' not in data or 'user_id' not in data:
            return jsonify({'error': 'Event ID and User ID are required'}), 400
        
        enrollment_id = db.enroll_user(data['event_id'], data['user_id'])
        
        if enrollment_id is None:
            return jsonify({'error': 'User is already enrolled in this event'}), 409
        
        return jsonify({
            'message': 'Enrollment successful',
            'id': enrollment_id
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/unenroll', methods=['POST'])
def unenroll():
    """Unenroll a user from an event"""
    try:
        data = request.get_json()
        
        if not data or 'event_id' not in data or 'user_id' not in data:
            return jsonify({'error': 'Event ID and User ID are required'}), 400
        
        db.unenroll_user(data['event_id'], data['user_id'])
        
        return jsonify({'message': 'Unenrollment successful'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/event/<int:event_id>/enrollments', methods=['GET'])
def get_event_enrollments(event_id):
    """Get all enrollments for an event"""
    try:
        enrollments = db.get_event_enrollments(event_id)
        return jsonify([dict(enrollment) for enrollment in enrollments]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/<int:user_id>/enrollments', methods=['GET'])
def get_user_enrollments(user_id):
    """Get all enrollments for a user"""
    try:
        enrollments = db.get_user_enrollments(user_id)
        return jsonify([dict(enrollment) for enrollment in enrollments]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== ADMIN API ENDPOINTS ====================

@app.route('/api/admin/stats', methods=['GET'])
def get_stats():
    """Get statistics for admin dashboard"""
    try:
        stats = db.get_enrollment_stats()
        # Convert sqlite3.Row objects to dicts
        stats['events_by_type'] = [dict(row) for row in stats['events_by_type']]
        stats['popular_events'] = [dict(row) for row in stats['popular_events']]
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ==================== RUN APPLICATION ====================

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)

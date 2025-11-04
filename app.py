"""
Flask Application with SQLite Database
Main application file that initializes the Flask server and database connection
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for
from database import Database
import os

# Initialize Flask application
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production

# Initialize database
db = Database('users.db')

@app.route('/')
def index():
    """
    Home page route
    Returns: Rendered HTML template for the home page
    """
    return render_template('index.html')

@app.route('/users')
def get_users():
    """
    Get all users from database
    Returns: JSON response with list of all users
    """
    users = db.get_all_users()
    return jsonify({'users': users})

@app.route('/user/<int:user_id>')
def get_user(user_id):
    """
    Get a specific user by ID
    Args:
        user_id (int): The ID of the user to retrieve
    Returns: JSON response with user data or error message
    """
    user = db.get_user_by_id(user_id)
    if user:
        return jsonify({'user': user})
    return jsonify({'error': 'User not found'}), 404

@app.route('/user/add', methods=['POST'])
def add_user():
    """
    Add a new user to the database
    Expects JSON data with 'name' and 'email' fields
    Returns: JSON response with success message and user ID
    """
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')

    if not name or not email:
        return jsonify({'error': 'Name and email are required'}), 400

    user_id = db.add_user(name, email)
    return jsonify({'message': 'User added successfully', 'user_id': user_id}), 201

@app.route('/user/update/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """
    Update an existing user
    Args:
        user_id (int): The ID of the user to update
    Expects JSON data with 'name' and/or 'email' fields
    Returns: JSON response with success or error message
    """
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')

    success = db.update_user(user_id, name, email)
    if success:
        return jsonify({'message': 'User updated successfully'})
    return jsonify({'error': 'User not found'}), 404

@app.route('/user/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """
    Delete a user from the database
    Args:
        user_id (int): The ID of the user to delete
    Returns: JSON response with success or error message
    """
    success = db.delete_user(user_id)
    if success:
        return jsonify({'message': 'User deleted successfully'})
    return jsonify({'error': 'User not found'}), 404

@app.errorhandler(404)
def not_found(error):
    """
    Handle 404 errors
    Returns: JSON error response
    """
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """
    Handle 500 errors
    Returns: JSON error response
    """
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Run the Flask development server
    # Debug mode is enabled for development (disable in production)
    app.run(debug=True, host='0.0.0.0', port=5000)

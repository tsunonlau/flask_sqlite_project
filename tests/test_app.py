"""
Unit Tests for Flask Application
Tests all API endpoints and database operations
"""

import unittest
import json
import os
import sys

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app
from database import Database

class FlaskAppTestCase(unittest.TestCase):
    """Test cases for Flask application"""

    def setUp(self):
        """Set up test client and test database before each test"""
        # Use a separate test database
        self.test_db = 'test_users.db'
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.db = Database(self.test_db)

    def tearDown(self):
        """Clean up test database after each test"""
        if os.path.exists(self.test_db):
            os.remove(self.test_db)

    def test_home_page(self):
        """Test that home page loads successfully"""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    def test_add_user(self):
        """Test adding a new user"""
        user_data = {
            'name': 'Test User',
            'email': 'test@example.com'
        }
        response = self.app.post('/user/add',
                                data=json.dumps(user_data),
                                content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertIn('user_id', data)

    def test_add_user_missing_data(self):
        """Test adding user with missing data"""
        user_data = {'name': 'Test User'}  # Missing email
        response = self.app.post('/user/add',
                                data=json.dumps(user_data),
                                content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_get_all_users(self):
        """Test retrieving all users"""
        # Add a test user first
        self.db.add_user('Test User', 'test@example.com')

        response = self.app.get('/users')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('users', data)
        self.assertTrue(len(data['users']) > 0)

    def test_get_user_by_id(self):
        """Test retrieving a specific user by ID"""
        # Add a test user
        user_id = self.db.add_user('Test User', 'test@example.com')

        response = self.app.get(f'/user/{user_id}')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('user', data)
        self.assertEqual(data['user']['id'], user_id)

    def test_get_nonexistent_user(self):
        """Test retrieving a user that doesn't exist"""
        response = self.app.get('/user/9999')
        self.assertEqual(response.status_code, 404)

    def test_update_user(self):
        """Test updating a user"""
        # Add a test user
        user_id = self.db.add_user('Test User', 'test@example.com')

        update_data = {
            'name': 'Updated Name',
            'email': 'updated@example.com'
        }
        response = self.app.put(f'/user/update/{user_id}',
                               data=json.dumps(update_data),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_delete_user(self):
        """Test deleting a user"""
        # Add a test user
        user_id = self.db.add_user('Test User', 'test@example.com')

        response = self.app.delete(f'/user/delete/{user_id}')
        self.assertEqual(response.status_code, 200)

        # Verify user is deleted
        user = self.db.get_user_by_id(user_id)
        self.assertIsNone(user)

    def test_delete_nonexistent_user(self):
        """Test deleting a user that doesn't exist"""
        response = self.app.delete('/user/delete/9999')
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()

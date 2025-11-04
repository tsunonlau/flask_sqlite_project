# database.py - Updated Database operations for Route Venture

import sqlite3
from datetime import datetime

DATABASE_NAME = 'route_venture.db'

def get_db_connection():
    """
    Creates and returns a database connection.
    Sets row_factory to sqlite3.Row for dictionary-like access.
    """
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """
    Initializes the database with required tables.
    Creates users, events, and enrollments tables.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create events table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            event_type TEXT NOT NULL,
            location TEXT NOT NULL,
            event_date DATE NOT NULL,
            event_time TIME NOT NULL,
            max_participants INTEGER,
            created_by INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users(id)
        )
    ''')
    
    # Create enrollments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS enrollments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES events(id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(event_id, user_id)
        )
    ''')
    
    conn.commit()
    conn.close()

# User CRUD operations
def get_all_users():
    """Fetch all users from database"""
    conn = get_db_connection()
    users = conn.execute('SELECT * FROM users').fetchall()
    conn.close()
    return users

def get_user_by_id(user_id):
    """Fetch a specific user by ID"""
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    return user

def add_user(name, email):
    """Add a new user"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (name, email) VALUES (?, ?)', (name, email))
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    return user_id

def update_user(user_id, name=None, email=None):
    """Update user information"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if name and email:
        cursor.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', (name, email, user_id))
    elif name:
        cursor.execute('UPDATE users SET name = ? WHERE id = ?', (name, user_id))
    elif email:
        cursor.execute('UPDATE users SET email = ? WHERE id = ?', (email, user_id))
    
    conn.commit()
    conn.close()

def delete_user(user_id):
    """Delete a user"""
    conn = get_db_connection()
    conn.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()

# Event CRUD operations
def get_all_events():
    """Fetch all events with enrollment count"""
    conn = get_db_connection()
    events = conn.execute('''
        SELECT e.*, u.name as creator_name,
               COUNT(DISTINCT en.user_id) as enrolled_count
        FROM events e
        LEFT JOIN users u ON e.created_by = u.id
        LEFT JOIN enrollments en ON e.id = en.event_id
        GROUP BY e.id
        ORDER BY e.event_date DESC
    ''').fetchall()
    conn.close()
    return events

def get_event_by_id(event_id):
    """Fetch a specific event by ID"""
    conn = get_db_connection()
    event = conn.execute('''
        SELECT e.*, u.name as creator_name,
               COUNT(DISTINCT en.user_id) as enrolled_count
        FROM events e
        LEFT JOIN users u ON e.created_by = u.id
        LEFT JOIN enrollments en ON e.id = en.event_id
        WHERE e.id = ?
        GROUP BY e.id
    ''', (event_id,)).fetchone()
    conn.close()
    return event

def add_event(title, description, event_type, location, event_date, event_time, max_participants, created_by):
    """Add a new event"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO events (title, description, event_type, location, event_date, event_time, max_participants, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (title, description, event_type, location, event_date, event_time, max_participants, created_by))
    conn.commit()
    event_id = cursor.lastrowid
    conn.close()
    return event_id

def update_event(event_id, **kwargs):
    """Update event information"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    fields = []
    values = []
    for key, value in kwargs.items():
        if value is not None:
            fields.append(f"{key} = ?")
            values.append(value)
    
    if fields:
        query = f"UPDATE events SET {', '.join(fields)} WHERE id = ?"
        values.append(event_id)
        cursor.execute(query, values)
        conn.commit()
    
    conn.close()

def delete_event(event_id):
    """Delete an event and its enrollments"""
    conn = get_db_connection()
    conn.execute('DELETE FROM enrollments WHERE event_id = ?', (event_id,))
    conn.execute('DELETE FROM events WHERE id = ?', (event_id,))
    conn.commit()
    conn.close()

# Enrollment operations
def enroll_user(event_id, user_id):
    """Enroll a user in an event"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO enrollments (event_id, user_id) VALUES (?, ?)', (event_id, user_id))
        conn.commit()
        enrollment_id = cursor.lastrowid
        conn.close()
        return enrollment_id
    except sqlite3.IntegrityError:
        conn.close()
        return None  # User already enrolled

def unenroll_user(event_id, user_id):
    """Unenroll a user from an event"""
    conn = get_db_connection()
    conn.execute('DELETE FROM enrollments WHERE event_id = ? AND user_id = ?', (event_id, user_id))
    conn.commit()
    conn.close()

def get_event_enrollments(event_id):
    """Get all users enrolled in an event"""
    conn = get_db_connection()
    enrollments = conn.execute('''
        SELECT u.*, e.enrolled_at
        FROM users u
        JOIN enrollments e ON u.id = e.user_id
        WHERE e.event_id = ?
        ORDER BY e.enrolled_at DESC
    ''', (event_id,)).fetchall()
    conn.close()
    return enrollments

def get_user_enrollments(user_id):
    """Get all events a user is enrolled in"""
    conn = get_db_connection()
    enrollments = conn.execute('''
        SELECT ev.*, en.enrolled_at
        FROM events ev
        JOIN enrollments en ON ev.id = en.event_id
        WHERE en.user_id = ?
        ORDER BY ev.event_date ASC
    ''', (user_id,)).fetchall()
    conn.close()
    return enrollments

def get_enrollment_stats():
    """Get statistics for admin dashboard"""
    conn = get_db_connection()
    
    stats = {
        'total_users': conn.execute('SELECT COUNT(*) as count FROM users').fetchone()['count'],
        'total_events': conn.execute('SELECT COUNT(*) as count FROM events').fetchone()['count'],
        'total_enrollments': conn.execute('SELECT COUNT(*) as count FROM enrollments').fetchone()['count'],
        'upcoming_events': conn.execute('''
            SELECT COUNT(*) as count FROM events 
            WHERE event_date >= date('now')
        ''').fetchone()['count'],
        'events_by_type': conn.execute('''
            SELECT event_type, COUNT(*) as count 
            FROM events 
            GROUP BY event_type
        ''').fetchall(),
        'popular_events': conn.execute('''
            SELECT e.id, e.title, COUNT(en.user_id) as enrollment_count
            FROM events e
            LEFT JOIN enrollments en ON e.id = en.event_id
            GROUP BY e.id
            ORDER BY enrollment_count DESC
            LIMIT 5
        ''').fetchall()
    }
    
    conn.close()
    return stats

"""
Database Module
Handles all SQLite database operations including connection management,
table creation, and CRUD operations
"""

import sqlite3
from typing import List, Dict, Optional, Tuple

class Database:
    """
    Database class for managing SQLite connections and operations
    """

    def __init__(self, db_name: str = 'users.db'):
        """
        Initialize database connection and create tables if they don't exist

        Args:
            db_name (str): Name of the SQLite database file
        """
        self.db_name = db_name
        self.create_tables()

    def get_connection(self) -> sqlite3.Connection:
        """
        Create and return a new database connection

        Returns:
            sqlite3.Connection: Database connection object
        """
        conn = sqlite3.connect(self.db_name)
        # Enable row factory to return rows as dictionaries
        conn.row_factory = sqlite3.Row
        return conn

    def create_tables(self) -> None:
        """
        Create the users table if it doesn't exist
        Table structure:
            - id: Primary key (auto-increment)
            - name: User's name (TEXT, NOT NULL)
            - email: User's email (TEXT, UNIQUE, NOT NULL)
            - created_at: Timestamp of user creation (default: current timestamp)
        """
        conn = self.get_connection()
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

        conn.commit()
        conn.close()

    def add_user(self, name: str, email: str) -> int:
        """
        Add a new user to the database

        Args:
            name (str): User's name
            email (str): User's email address

        Returns:
            int: ID of the newly created user

        Raises:
            sqlite3.IntegrityError: If email already exists
        """
        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            cursor.execute(
                'INSERT INTO users (name, email) VALUES (?, ?)',
                (name, email)
            )
            conn.commit()
            user_id = cursor.lastrowid
            return user_id
        finally:
            conn.close()

    def get_all_users(self) -> List[Dict]:
        """
        Retrieve all users from the database

        Returns:
            List[Dict]: List of user dictionaries with id, name, email, and created_at
        """
        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            cursor.execute('SELECT * FROM users ORDER BY created_at DESC')
            rows = cursor.fetchall()
            # Convert Row objects to dictionaries
            users = [dict(row) for row in rows]
            return users
        finally:
            conn.close()

    def get_user_by_id(self, user_id: int) -> Optional[Dict]:
        """
        Retrieve a specific user by ID

        Args:
            user_id (int): The ID of the user to retrieve

        Returns:
            Optional[Dict]: User dictionary if found, None otherwise
        """
        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
            row = cursor.fetchone()
            return dict(row) if row else None
        finally:
            conn.close()

    def get_user_by_email(self, email: str) -> Optional[Dict]:
        """
        Retrieve a user by email address

        Args:
            email (str): The email address to search for

        Returns:
            Optional[Dict]: User dictionary if found, None otherwise
        """
        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
            row = cursor.fetchone()
            return dict(row) if row else None
        finally:
            conn.close()

    def update_user(self, user_id: int, name: Optional[str] = None, 
                   email: Optional[str] = None) -> bool:
        """
        Update user information

        Args:
            user_id (int): The ID of the user to update
            name (Optional[str]): New name (if provided)
            email (Optional[str]): New email (if provided)

        Returns:
            bool: True if user was updated, False if user not found
        """
        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            # Build dynamic update query based on provided fields
            updates = []
            params = []

            if name is not None:
                updates.append('name = ?')
                params.append(name)

            if email is not None:
                updates.append('email = ?')
                params.append(email)

            if not updates:
                return False

            params.append(user_id)
            query = f'UPDATE users SET {", ".join(updates)} WHERE id = ?'

            cursor.execute(query, params)
            conn.commit()

            return cursor.rowcount > 0
        finally:
            conn.close()

    def delete_user(self, user_id: int) -> bool:
        """
        Delete a user from the database

        Args:
            user_id (int): The ID of the user to delete

        Returns:
            bool: True if user was deleted, False if user not found
        """
        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            conn.close()

    def close(self) -> None:
        """
        Close the database connection
        Note: This method is not typically needed as we use context managers,
        but included for completeness
        """
        pass  # Connections are closed after each operation

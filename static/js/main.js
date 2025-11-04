/**
 * Frontend JavaScript for Flask SQLite Demo
 * Handles user interactions, API calls, and dynamic content updates
 */

// DOM elements
const addUserForm = document.getElementById('addUserForm');
const messageDiv = document.getElementById('message');
const usersList = document.getElementById('usersList');
const refreshBtn = document.getElementById('refreshBtn');

// API base URL
const API_BASE = '';

/**
 * Display a message to the user
 * @param {string} text - The message text to display
 * @param {string} type - The message type ('success' or 'error')
 */
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

    // Auto-hide message after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

/**
 * Fetch and display all users from the database
 */
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/users`);
        const data = await response.json();

        if (data.users && data.users.length > 0) {
            displayUsers(data.users);
        } else {
            usersList.innerHTML = `
                <div class="empty-state">
                    <p>No users found. Add your first user above!</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showMessage('Failed to load users. Please try again.', 'error');
    }
}

/**
 * Display users in the DOM
 * @param {Array} users - Array of user objects to display
 */
function displayUsers(users) {
    usersList.innerHTML = users.map(user => `
        <div class="user-card" data-user-id="${user.id}">
            <div class="user-info">
                <h3>${escapeHtml(user.name)}</h3>
                <p>${escapeHtml(user.email)}</p>
                <small>Created: ${new Date(user.created_at).toLocaleString()}</small>
            </div>
            <button class="btn btn-delete" onclick="deleteUser(${user.id})">Delete</button>
        </div>
    `).join('');
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - The text to escape
 * @returns {string} - The escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Add a new user to the database
 * @param {Event} e - The form submit event
 */
async function addUser(e) {
    e.preventDefault();

    const formData = new FormData(addUserForm);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email')
    };

    try {
        const response = await fetch(`${API_BASE}/user/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('User added successfully!', 'success');
            addUserForm.reset();
            loadUsers(); // Reload the users list
        } else {
            showMessage(data.error || 'Failed to add user', 'error');
        }
    } catch (error) {
        console.error('Error adding user:', error);
        showMessage('Failed to add user. Please try again.', 'error');
    }
}

/**
 * Delete a user from the database
 * @param {number} userId - The ID of the user to delete
 */
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/user/delete/${userId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('User deleted successfully!', 'success');
            loadUsers(); // Reload the users list
        } else {
            showMessage(data.error || 'Failed to delete user', 'error');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showMessage('Failed to delete user. Please try again.', 'error');
    }
}

// Event listeners
addUserForm.addEventListener('submit', addUser);
refreshBtn.addEventListener('click', loadUsers);

// Load users when page loads
document.addEventListener('DOMContentLoaded', loadUsers);

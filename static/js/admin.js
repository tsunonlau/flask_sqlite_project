// admin.js - Admin dashboard functionality

let deleteType = '';
let deleteId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    loadEvents();
    loadUsers();
    loadStatistics();
});

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const response = await fetch('/api/admin/stats');
        const stats = await response.json();
        
        document.getElementById('totalUsers').textContent = stats.total_users;
        document.getElementById('totalEvents').textContent = stats.total_events;
        document.getElementById('totalEnrollments').textContent = stats.total_enrollments;
        document.getElementById('upcomingEvents').textContent = stats.upcoming_events;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load all events
async function loadEvents() {
    try {
        const response = await fetch('/api/events');
        const events = await response.json();
        
        const tbody = document.getElementById('eventsTableBody');
        
        if (events.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No events found</td></tr>';
            return;
        }
        
        tbody.innerHTML = events.map(event => `
            <tr>
                <td>${event.id}</td>
                <td><strong>${event.title}</strong></td>
                <td><span class="badge bg-success">${event.event_type}</span></td>
                <td>${new Date(event.event_date).toLocaleDateString()}</td>
                <td>${event.location}</td>
                <td>${event.enrolled_count}${event.max_participants ? '/' + event.max_participants : ''}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewEventDetails(${event.id})" title="View Details">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="confirmDelete('event', ${event.id}, '${event.title}')" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('eventsTableBody').innerHTML = 
            '<tr><td colspan="7" class="text-center text-danger">Error loading events</td></tr>';
    }
}

// Load all users
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        
        const tbody = document.getElementById('usersTableBody');
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No users found</td></tr>';
            return;
        }
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td><strong>${user.name}</strong></td>
                <td>${user.email}</td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewUserEnrollments(${user.id})" title="View Enrollments">
                        <i class="bi bi-calendar-check"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="confirmDelete('user', ${user.id}, '${user.name}')" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersTableBody').innerHTML = 
            '<tr><td colspan="5" class="text-center text-danger">Error loading users</td></tr>';
    }
}

// Load statistics
async function loadStatistics() {
    try {
        const response = await fetch('/api/admin/stats');
        const stats = await response.json();
        
        // Display events by type
        const eventsByTypeDiv = document.getElementById('eventsByType');
        if (stats.events_by_type.length > 0) {
            eventsByTypeDiv.innerHTML = `
                <div class="list-group">
                    ${stats.events_by_type.map(item => `
                        <div class="list-group-item d-flex justify-content-between align-items-center">
                            <span class="text-capitalize">${item.event_type}</span>
                            <span class="badge bg-success rounded-pill">${item.count}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            eventsByTypeDiv.innerHTML = '<p class="text-muted">No events yet</p>';
        }
        
        // Display popular events
        const popularEventsDiv = document.getElementById('popularEvents');
        if (stats.popular_events.length > 0) {
            popularEventsDiv.innerHTML = `
                <div class="list-group">
                    ${stats.popular_events.map((event, index) => `
                        <div class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <span class="badge bg-warning me-2">#${index + 1}</span>
                                <span>${event.title}</span>
                            </div>
                            <span class="badge bg-success rounded-pill">${event.enrollment_count} enrolled</span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            popularEventsDiv.innerHTML = '<p class="text-muted">No enrollments yet</p>';
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// View event details
async function viewEventDetails(eventId) {
    try {
        const response = await fetch(`/api/event/${eventId}/enrollments`);
        const enrollments = await response.json();
        
        const eventResponse = await fetch(`/api/event/${eventId}`);
        const event = await eventResponse.json();
        
        alert(`Event: ${event.title}\nEnrolled: ${enrollments.length} people\n\nParticipants:\n${enrollments.map(e => e.name).join('\n')}`);
    } catch (error) {
        alert('Error loading event details');
    }
}

// View user enrollments
async function viewUserEnrollments(userId) {
    try {
        const response = await fetch(`/api/user/${userId}/enrollments`);
        const enrollments = await response.json();
        
        const userResponse = await fetch(`/api/user/${userId}`);
        const user = await userResponse.json();
        
        if (enrollments.length === 0) {
            alert(`${user.name} has not enrolled in any events yet.`);
        } else {
            alert(`${user.name}'s Enrollments:\n\n${enrollments.map(e => `${e.title} - ${e.event_date}`).join('\n')}`);
        }
    } catch (error) {
        alert('Error loading user enrollments');
    }
}

// Confirm delete
function confirmDelete(type, id, name) {
    deleteType = type;
    deleteId = id;
    
    document.getElementById('deleteMessage').textContent = 
        `Are you sure you want to delete ${type} "${name}"? This action cannot be undone.`;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

// Execute delete
document.getElementById('confirmDelete').addEventListener('click', async function() {
    try {
        let endpoint = deleteType === 'event' ? `/api/event/delete/${deleteId}` : `/api/user/delete/${deleteId}`;
        
        const response = await fetch(endpoint, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Deleted successfully!');
            
            // Reload appropriate data
            if (deleteType === 'event') {
                loadEvents();
            } else {
                loadUsers();
            }
            
            loadDashboardStats();
            loadStatistics();
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        alert('Delete failed. Please try again.');
    }
    
    bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
});

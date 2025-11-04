// enroll.js - Event enrollment page functionality

let currentUserId = null;
let currentEventId = null;
let allEvents = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    setupEventListeners();
    checkStoredUser();
});

// Check if user info is stored in localStorage
function checkStoredUser() {
    const storedUser = localStorage.getItem('routeVentureUser');
    if (storedUser) {
        const userData = JSON.parse(storedUser);
        currentUserId = userData.id;
        document.getElementById('userName').value = userData.name;
        document.getElementById('userEmail').value = userData.email;
        showUserStatus(`Welcome back, ${userData.name}!`, 'success');
    }
}

// Setup event listeners
function setupEventListeners() {
    // User registration form
    document.getElementById('userForm').addEventListener('submit', handleUserRegistration);
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', filterEvents);
    
    // Filter by type
    document.getElementById('filterType').addEventListener('change', filterEvents);
}

// Handle user registration
async function handleUserRegistration(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    
    try {
        const response = await fetch('/api/user/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUserId = data.id;
            // Store user info in localStorage
            localStorage.setItem('routeVentureUser', JSON.stringify({ id: data.id, name, email }));
            showUserStatus('Registration successful! You can now enroll in events.', 'success');
        } else {
            showUserStatus(`Error: ${data.error}`, 'danger');
        }
    } catch (error) {
        showUserStatus('Registration failed. Please try again.', 'danger');
    }
}

// Show user status message
function showUserStatus(message, type) {
    const statusDiv = document.getElementById('userStatus');
    statusDiv.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show mt-2">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

// Load all events
async function loadEvents() {
    try {
        const response = await fetch('/api/events');
        const events = await response.json();
        allEvents = events;
        displayEvents(events);
    } catch (error) {
        document.getElementById('eventsList').innerHTML = 
            '<div class="col-12"><div class="alert alert-danger">Failed to load events</div></div>';
    } finally {
        document.getElementById('loadingSpinner').style.display = 'none';
    }
}

// Display events
function displayEvents(events) {
    const eventsList = document.getElementById('eventsList');
    
    if (events.length === 0) {
        eventsList.innerHTML = '<div class="col-12"><div class="alert alert-info">No events found</div></div>';
        return;
    }
    
    eventsList.innerHTML = events.map(event => createEventCard(event)).join('');
}

// Create event card HTML
function createEventCard(event) {
    const eventDate = new Date(event.event_date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
    });
    
    const typeIcons = {
        'hiking': 'bi-mountain',
        'camping': 'bi-trees',
        'cleanup': 'bi-recycle',
        'biking': 'bi-bicycle',
        'kayaking': 'bi-water',
        'rock-climbing': 'bi-arrow-up-circle'
    };
    
    const icon = typeIcons[event.event_type] || 'bi-calendar-event';
    const spotsText = event.max_participants 
        ? `${event.enrolled_count}/${event.max_participants} spots filled`
        : `${event.enrolled_count} enrolled`;
    
    const isFull = event.max_participants && event.enrolled_count >= event.max_participants;
    
    return `
        <div class="col-md-6 col-lg-4" data-event-type="${event.event_type}">
            <div class="card h-100 shadow-sm event-card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-success"><i class="bi ${icon} me-1"></i>${event.event_type}</span>
                        ${isFull ? '<span class="badge bg-danger">Full</span>' : '<span class="badge bg-info">Available</span>'}
                    </div>
                    <h5 class="card-title fw-bold">${event.title}</h5>
                    <p class="card-text text-muted small">${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</p>
                    <div class="event-details small">
                        <p class="mb-1"><i class="bi bi-calendar3 text-success me-2"></i>${formattedDate}</p>
                        <p class="mb-1"><i class="bi bi-clock text-success me-2"></i>${event.event_time}</p>
                        <p class="mb-1"><i class="bi bi-geo-alt text-success me-2"></i>${event.location}</p>
                        <p class="mb-2"><i class="bi bi-people text-success me-2"></i>${spotsText}</p>
                    </div>
                </div>
                <div class="card-footer bg-white border-top-0">
                    <button class="btn btn-success w-100" onclick="enrollInEvent(${event.id}, '${event.title}')" ${isFull || !currentUserId ? 'disabled' : ''}>
                        <i class="bi bi-check-circle me-2"></i>${isFull ? 'Event Full' : 'Enroll Now'}
                    </button>
                    ${!currentUserId ? '<small class="text-muted d-block mt-2 text-center">Register first to enroll</small>' : ''}
                </div>
            </div>
        </div>
    `;
}

// Enroll in event
function enrollInEvent(eventId, eventTitle) {
    if (!currentUserId) {
        alert('Please register first before enrolling in events');
        return;
    }
    
    currentEventId = eventId;
    document.getElementById('enrollmentMessage').textContent = 
        `Are you sure you want to enroll in "${eventTitle}"?`;
    
    const modal = new bootstrap.Modal(document.getElementById('enrollModal'));
    modal.show();
}

// Confirm enrollment
document.getElementById('confirmEnroll').addEventListener('click', async function() {
    try {
        const response = await fetch('/api/enroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_id: currentEventId,
                user_id: currentUserId
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Enrollment successful!');
            loadEvents(); // Reload events to update enrollment count
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        alert('Enrollment failed. Please try again.');
    }
    
    bootstrap.Modal.getInstance(document.getElementById('enrollModal')).hide();
});

// Filter events
function filterEvents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterType = document.getElementById('filterType').value;
    
    const filtered = allEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm) || 
                            event.description.toLowerCase().includes(searchTerm) ||
                            event.location.toLowerCase().includes(searchTerm);
        const matchesType = !filterType || event.event_type === filterType;
        
        return matchesSearch && matchesType;
    });
    
    displayEvents(filtered);
}

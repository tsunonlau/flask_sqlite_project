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
    const eventCard = `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title">${event.title}</h5>
                        <span class="badge bg-primary">${event.event_type}</span>
                    </div>
                    <p class="card-text text-muted">${event.description}</p>
                    <div class="event-details mt-3">
                        <p class="mb-1"><i class="bi bi-geo-alt"></i> ${event.location}</p>
                        <p class="mb-1"><i class="bi bi-calendar"></i> ${event.event_date}</p>
                        <p class="mb-1"><i class="bi bi-clock"></i> ${event.event_time}</p>
                    </div>
                    
                    <!-- QR Code Thumbnail (NEW) -->
                    <div class="qr-code-thumbnail mt-3 text-center">
                        <img src="/api/event/${event.id}/qrcode" 
                            alt="QR Code" 
                            class="img-thumbnail" 
                            style="width: 80px; height: 80px; cursor: pointer;"
                            onclick="showQRCodeModal(${event.id}, '${event.title.replace(/'/g, "\\'")}')"
                            title="Click to view full QR code">
                        <p class="small text-muted mb-0">Scan to share</p>
                    </div>
                </div>
                <div class="card-footer bg-transparent">
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary btn-sm" onclick="enrollEvent(${event.id})">
                            <i class="bi bi-person-plus"></i> Enroll Now
                        </button>
                        <button class="btn btn-outline-secondary btn-sm" onclick="showQRCodeModal(${event.id}, '${event.title.replace(/'/g, "\\'")}')">
                            <i class="bi bi-qr-code"></i> View QR Code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    return eventCard;
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

/**
 * Show QR Code Modal
 * Displays the QR code for a specific event in a modal
 */
function showQRCodeModal(eventId, eventTitle) {
    // Set the QR code image source
    const qrImage = document.getElementById('qrCodeImage');
    qrImage.src = `/api/event/${eventId}/qrcode`;
    
    // Set the event title
    document.getElementById('qrEventTitle').textContent = eventTitle;
    
    // Set download link
    const downloadLink = document.getElementById('qrDownloadLink');
    downloadLink.href = `/api/event/${eventId}/qrcode`;
    downloadLink.download = `event-${eventId}-qrcode.png`;
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('qrCodeModal'));
    modal.show();
}
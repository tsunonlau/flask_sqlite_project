// create.js - Event creation page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('eventDate').setAttribute('min', today);
    
    // Setup form submission
    document.getElementById('createEventForm').addEventListener('submit', handleEventCreation);
});

// Handle event creation
async function handleEventCreation(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        event_type: document.getElementById('eventType').value,
        location: document.getElementById('eventLocation').value,
        event_date: document.getElementById('eventDate').value,
        event_time: document.getElementById('eventTime').value,
        max_participants: document.getElementById('maxParticipants').value || null,
        created_by: null // Will be set after organizer registration
    };
    
    const organizerName = document.getElementById('organizerName').value;
    const organizerEmail = document.getElementById('organizerEmail').value;
    
    try {
        // First, register or get the organizer
        const userResponse = await fetch('/api/user/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: organizerName,
                email: organizerEmail
            })
        });
        
        const userData = await userResponse.json();
        
        if (userResponse.ok) {
            formData.created_by = userData.id;
        } else if (userResponse.status === 500 && userData.error.includes('UNIQUE')) {
            // User already exists, try to find them
            const usersResponse = await fetch('/api/users');
            const users = await usersResponse.json();
            const existingUser = users.find(u => u.email === organizerEmail);
            if (existingUser) {
                formData.created_by = existingUser.id;
            }
        }
        
        // Create the event
        const eventResponse = await fetch('/api/event/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const eventData = await eventResponse.json();
        
        if (eventResponse.ok) {
            showStatus('Event created successfully! Redirecting...', 'success');
            
            // Reset form
            document.getElementById('createEventForm').reset();
            
            // Redirect to browse events page after 2 seconds
            setTimeout(() => {
                window.location.href = '/enroll';
            }, 2000);
        } else {
            showStatus(`Error: ${eventData.error}`, 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus('Failed to create event. Please try again.', 'danger');
    }
}

// Show status message
function showStatus(message, type) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Scroll to status message
    statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

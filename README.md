# Route Venture - Outdoor Adventure Hub

A Flask-based web application for organizing and joining outdoor activities including hiking, camping, community cleanups, and more.

## Overview

Route Venture is a platform that connects outdoor enthusiasts to explore nature together. The name reflects the fusion of **"Route"** (the paths we explore) and **"Venture"** (the thrill of adventure and discovering nature).

## Features

### 4 Main Pages

1. **Home Page** - Welcome page with platform introduction and features
2. **Browse Events** - View and enroll in upcoming outdoor events
3. **Create Event** - Organize new outdoor adventures
4. **Admin Dashboard** - Manage events, users, and view statistics

### Key Functionality

- **Event Management**: Create, view, update, and delete outdoor events
- **User Registration**: Quick sign-up to participate in events
- **Event Enrollment**: Join events with real-time availability tracking
- **Admin Dashboard**: Comprehensive statistics and management tools
- **Responsive Design**: Bootstrap 5 for mobile-friendly interface
- **RESTful API**: Complete API for all CRUD operations

## Project Structure

```
flask_sqlite_project/
│
├── app.py                    # Main Flask application
├── database.py               # Database operations
├── config.py                 # Configuration settings
├── requirements.txt          # Python dependencies
├── README.md                 # Project documentation
│
├── templates/                # HTML templates
│   ├── index.html           # Home page
│   ├── enroll.html          # Event enrollment page
│   ├── create.html          # Event creation page
│   └── admin.html           # Admin dashboard
│
├── static/                   # Static files
│   ├── css/
│   │   └── style.css        # Custom styles
│   └── js/
│       ├── enroll.js        # Enrollment page logic
│       ├── create.js        # Event creation logic
│       └── admin.js         # Admin dashboard logic
│
└── route_venture.db         # SQLite database (auto-created)
```

## Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `created_at` - Registration timestamp

### Events Table
- `id` - Primary key
- `title` - Event title
- `description` - Event details
- `event_type` - Type (hiking, camping, cleanup, etc.)
- `location` - Event location
- `event_date` - Event date
- `event_time` - Event time
- `max_participants` - Maximum attendees (optional)
- `created_by` - Organizer user ID
- `created_at` - Creation timestamp

### Enrollments Table
- `id` - Primary key
- `event_id` - Foreign key to events
- `user_id` - Foreign key to users
- `enrolled_at` - Enrollment timestamp
- Unique constraint on (event_id, user_id)

## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Setup Instructions

1. **Clone the repository**
   ```bash
   cd ~/Downloads/flask_sqlite_project
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   ```

3. **Activate virtual environment**
   
   **macOS/Linux:**
   ```bash
   source venv/bin/activate
   ```
   
   **Windows:**
   ```bash
   venv\Scripts\activate
   ```

4. **Install dependencies**
   ```bash
   pip3 install -r requirements.txt
   ```

5. **Run the application**
   ```bash
   python3 app.py
   ```

6. **Access the application**
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## API Endpoints

### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/user/<id>` - Get specific user
- `POST /api/user/add` - Create new user
- `PUT /api/user/update/<id>` - Update user
- `DELETE /api/user/delete/<id>` - Delete user

### Event Endpoints
- `GET /api/events` - Get all events
- `GET /api/event/<id>` - Get specific event
- `POST /api/event/add` - Create new event
- `PUT /api/event/update/<id>` - Update event
- `DELETE /api/event/delete/<id>` - Delete event

### Enrollment Endpoints
- `POST /api/enroll` - Enroll user in event
- `POST /api/unenroll` - Unenroll user from event
- `GET /api/event/<id>/enrollments` - Get event participants
- `GET /api/user/<id>/enrollments` - Get user's enrollments

### Admin Endpoints
- `GET /api/admin/stats` - Get dashboard statistics

## Usage Guide

### Creating an Event

1. Navigate to **Create Event** page
2. Fill in event details:
   - Event title and description
   - Event type (hiking, camping, etc.)
   - Location
   - Date and time
   - Maximum participants (optional)
3. Provide your organizer information
4. Click **Create Event**

### Enrolling in an Event

1. Navigate to **Browse Events** page
2. Register your user account (quick form at top)
3. Browse available events
4. Click **Enroll Now** on desired event
5. Confirm enrollment

### Managing Events (Admin)

1. Navigate to **Admin** page
2. View statistics dashboard
3. Use tabs to manage:
   - Events Management
   - Users Management
   - Statistics

## Technology Stack

- **Backend**: Flask 3.0.0 (Python web framework)
- **Database**: SQLite3 (lightweight database)
- **Frontend**: Bootstrap 5.3.0 (responsive UI framework)
- **Icons**: Bootstrap Icons 1.11.0
- **JavaScript**: Vanilla JS (ES6+)

## Features in Detail

### Bootstrap Integration
- Responsive navigation bar
- Card-based layout for events
- Form validation
- Modal dialogs
- Tabbed interface
- Toast notifications
- Mobile-first design

### Event Types Supported
- Hiking
- Camping
- Community Cleanup
- Biking
- Kayaking
- Rock Climbing
- Other

### User Experience
- Quick user registration
- Real-time event availability
- Search and filter events
- Visual event type indicators
- Enrollment confirmation
- LocalStorage for user persistence

## Configuration

The application uses `config.py` for environment settings:
- **Development**: Debug mode enabled
- **Production**: Debug mode disabled
- **Testing**: Separate test database

## Security Notes

⚠️ **For Production Deployment:**
- Change SECRET_KEY in config.py
- Use environment variables for sensitive data
- Implement proper authentication
- Add input validation
- Enable HTTPS
- Use production WSGI server (Gunicorn/uWSGI)
- Implement rate limiting
- Add CORS protection

## Troubleshooting

### Common Issues

**Port 5000 already in use (macOS)**
- Disable AirPlay Receiver in System Preferences
- Or change port in app.py to 5001

**Database locked error**
- Close other database connections
- Restart the application

**Module not found errors**
- Ensure virtual environment is activated
- Reinstall requirements: `pip3 install -r requirements.txt`

## Future Enhancements

Planned features:
- [ ] QR code event sign-up links
- [ ] Email confirmation for enrollments
- [ ] WhatsApp messaging integration
- [ ] Interactive map API integration
- [ ] Admin charts for demographics (age, gender)
- [ ] User authentication (JWT tokens)
- [ ] Photo upload for events
- [ ] Rating and review system
- [ ] Calendar integration
- [ ] Mobile app version

## File Placement Guide

Place the generated files in your project structure as follows:

```
flask_sqlite_project/
├── app.py                    # [2] Updated Flask application
├── database.py               # [3] Updated database operations
├── requirements.txt          # [12] Python dependencies
├── templates/
│   ├── index.html           # [4] Home page
│   ├── enroll.html          # [5] Enrollment page
│   ├── create.html          # [6] Event creation page
│   └── admin.html           # [7] Admin dashboard
└── static/
    ├── css/
    │   └── style.css        # [11] Custom styles
    └── js/
        ├── enroll.js        # [8] Enrollment logic
        ├── create.js        # [9] Creation logic
        └── admin.js         # [10] Admin logic
```

## License

This project is for educational and demonstration purposes.

## Support

For issues or questions:
1. Check all prerequisites are installed
2. Verify virtual environment is activated
3. Ensure all files are in correct directories
4. Check Flask server is running
5. Review browser console for JavaScript errors

## About Route Venture

Route Venture brings together outdoor enthusiasts and tech innovation. Whether organizing a mountain hike, beach camping trip, or park cleanup, our platform makes it easy to connect with like-minded adventurers.

**Built with ❤️ for the outdoor community**

---

*Happy Adventuring! 🏔️🏕️🚴*

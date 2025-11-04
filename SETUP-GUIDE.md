# Route Venture - Quick Setup Guide

## Step-by-Step File Placement

### 1. Backend Files (Root Directory)

Replace these files in your project root:

- **app.py** - Main Flask application with updated routes
- **database.py** - Database operations with new schema
- **requirements.txt** - Python dependencies (unchanged)
- Keep your existing **config.py** file

### 2. HTML Templates (templates/ folder)

Replace the following files in `templates/` folder:

- **index.html** - New home page with Route Venture branding
- **enroll.html** - New event enrollment page
- **create.html** - New event creation page  
- **admin.html** - New admin dashboard

Delete the old `templates/index.html` if it exists.

### 3. CSS Files (static/css/ folder)

Replace in `static/css/`:

- **style.css** - Updated styles for all pages

### 4. JavaScript Files (static/js/ folder)

Create/replace in `static/js/`:

- **enroll.js** - Handles event enrollment functionality
- **create.js** - Handles event creation functionality
- **admin.js** - Handles admin dashboard functionality

Delete the old `static/js/main.js` as it's no longer needed.

## File Mapping Reference

| File Generated | Destination Path |
|----------------|------------------|
| database.py | `flask_sqlite_project/database.py` |
| app.py | `flask_sqlite_project/app.py` |
| index.html | `flask_sqlite_project/templates/index.html` |
| enroll.html | `flask_sqlite_project/templates/enroll.html` |
| create.html | `flask_sqlite_project/templates/create.html` |
| admin.html | `flask_sqlite_project/templates/admin.html` |
| style.css | `flask_sqlite_project/static/css/style.css` |
| enroll.js | `flask_sqlite_project/static/js/enroll.js` |
| create.js | `flask_sqlite_project/static/js/create.js` |
| admin.js | `flask_sqlite_project/static/js/admin.js` |
| requirements.txt | `flask_sqlite_project/requirements.txt` |

## Installation & Running

### 1. Install Dependencies

If this is your first time or if requirements changed:

```bash
cd flask_sqlite_project
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip3 install -r requirements.txt
```

### 2. Run the Application

```bash
python3 app.py
```

### 3. Access the Application

Open your browser to: **http://localhost:5000**

## Testing the Features

### Test Home Page
1. Navigate to http://localhost:5000
2. Verify the Route Venture branding and introduction text
3. Check responsive navigation

### Test Event Creation
1. Click "Create Event" in navigation
2. Fill out the form with test data:
   - Title: "Sunset Hike at Dragon's Back"
   - Description: "Join us for a beautiful sunset hike..."
   - Type: Hiking
   - Location: "Shek O, Hong Kong"
   - Date: Tomorrow's date
   - Time: 17:00
   - Max Participants: 10
   - Your name and email
3. Submit and verify redirection to events page

### Test Event Enrollment
1. Navigate to "Browse Events"
2. Register as a user (name and email)
3. Find your created event
4. Click "Enroll Now"
5. Confirm enrollment

### Test Admin Dashboard
1. Navigate to "Admin" page
2. Check statistics cards show correct numbers
3. View events table
4. View users table
5. Check statistics tab for event breakdown

## What's New

### Major Changes from Original Project

1. **Database Schema**: Added `events` and `enrollments` tables
2. **4 Distinct Pages**: Home, Browse/Enroll, Create, Admin
3. **Bootstrap Integration**: Modern, responsive UI
4. **New API Endpoints**: Full CRUD for events and enrollments
5. **Route Venture Branding**: Custom introduction and theme
6. **Enhanced Features**: Search, filter, real-time enrollment tracking

### Key Features Added

✅ Event management system
✅ User enrollment functionality  
✅ Admin dashboard with statistics
✅ Search and filter events
✅ Responsive design with Bootstrap 5
✅ Event type categorization
✅ Capacity management for events
✅ LocalStorage for user persistence

## Troubleshooting

### Database Issues

If you get database errors, delete the old database:

```bash
rm users.db  # Delete old database
# New route_venture.db will be created automatically
```

### Port Already in Use

If port 5000 is busy:

**Option 1:** Change port in app.py (last line):
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

**Option 2 (macOS):** Disable AirPlay Receiver in System Preferences → Sharing

### JavaScript Not Loading

Verify file paths in templates match:
- `{{ url_for('static', filename='js/enroll.js') }}`
- `{{ url_for('static', filename='js/create.js') }}`
- `{{ url_for('static', filename='js/admin.js') }}`

### Bootstrap Not Loading

Check internet connection - Bootstrap is loaded via CDN:
- `https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css`

## Verification Checklist

After setup, verify:

- [ ] All 12 files are in correct locations
- [ ] Virtual environment is activated
- [ ] Dependencies are installed
- [ ] Flask server starts without errors
- [ ] Home page loads at http://localhost:5000
- [ ] All 4 navigation links work
- [ ] Bootstrap styling is applied
- [ ] Can create an event
- [ ] Can register and enroll in events
- [ ] Admin dashboard displays data

## Database Auto-Creation

The application will automatically create `route_venture.db` with the correct schema on first run. The old `users.db` is no longer used.

## Next Steps

Once everything is working:

1. Create sample events to populate the system
2. Test enrollment workflow end-to-end
3. Explore admin dashboard features
4. Customize colors/styling in style.css if desired
5. Add more event types in create.html if needed

## Support

If you encounter issues:

1. Check browser console (F12) for JavaScript errors
2. Check terminal for Flask errors
3. Verify all files are in correct locations
4. Ensure virtual environment is activated
5. Try deleting old database and restarting

---

**You're all set! Welcome to Route Venture! 🏔️**

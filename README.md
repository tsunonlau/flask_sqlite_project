# Flask SQLite Micro Web Server

A lightweight Flask application demonstrating basic CRUD operations with SQLite database integration.

## Project Structure

```
flask_sqlite_project/
│
├── app.py                 # Main Flask application
├── database.py            # Database operations and connection management
├── config.py              # Configuration settings for different environments
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
│
├── templates/            # HTML templates
│   └── index.html       # Home page template
│
├── static/              # Static files (CSS, JS, images)
│   ├── css/
│   │   └── style.css   # Main stylesheet
│   └── js/
│       └── main.js     # Frontend JavaScript
│
└── tests/               # Test files
    └── test_app.py     # Application tests
```

## Features

- **RESTful API endpoints** for user management
- **SQLite database** integration with proper connection management
- **CRUD operations**: Create, Read, Update, Delete users
- **Error handling** with appropriate HTTP status codes
- **Clean code structure** with separation of concerns
- **Comprehensive comments** for learning purposes

## Prerequisites

Before running this project, ensure you have the following installed:

- **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
  - To check if Python is installed: `python --version` or `python3 --version`
- **pip** (Python package installer) - Usually comes with Python
  - To check if pip is installed: `pip --version` or `pip3 --version`

### Installing Python (if not already installed)

**macOS (Recommended Method - Using Homebrew):**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python 3
brew install python3

# Verify installation
python3 --version
pip3 --version
```

**macOS (Alternative - Direct Download):**
1. Download Python from [python.org](https://www.python.org/downloads/macos/)
2. Run the .pkg installer
3. Verify installation by opening Terminal and running: `python3 --version`

**Windows:**
1. Download Python from [python.org](https://www.python.org/downloads/)
2. Run the installer and **check "Add Python to PATH"**
3. Verify installation: `python --version`

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install python3 python3-pip
```

## Installation

Follow these steps to set up and run the project:

### 1. Clone or Download the Project

Open Terminal (Command + Space, type "Terminal") and navigate to the project directory:

**macOS/Linux:**
```bash
cd ~/Downloads/flask_sqlite_project
# Or wherever you saved the project
```

**Windows:**
```bash
cd C:\Users\YourUsername\Downloads\flask_sqlite_project
```

### 2. Create a Virtual Environment (Recommended)

A virtual environment keeps your project dependencies isolated from other Python projects.

**macOS/Linux:**
```bash
python3 -m venv venv
```

**Windows:**
```bash
python -m venv venv
```

### 3. Activate the Virtual Environment

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows (Command Prompt):**
```bash
venv\Scripts\activate
```

**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

**Note for macOS users:** You should see `(venv)` appear at the beginning of your terminal prompt, indicating the virtual environment is active. It will look something like:
```
(venv) username@MacBook-Pro flask_sqlite_project %
```

### 4. Install Python Requirements

**macOS/Linux:**
```bash
pip3 install -r requirements.txt
```

**Windows:**
```bash
pip install -r requirements.txt
```

This will install:
- Flask 3.0.0 - Web framework
- Werkzeug 3.0.1 - WSGI utility library
- Jinja2 3.1.2 - Template engine
- Click 8.1.7 - CLI framework
- MarkupSafe 2.1.3 - String handling
- itsdangerous 2.1.2 - Secure session cookies

**Troubleshooting Installation:**
- **macOS/Linux:** If `pip3` doesn't work, try just `pip` (after activating venv)
- **Windows:** If `pip` command doesn't work, try `pip3`
- If you get permission errors, make sure your virtual environment is activated
- To upgrade pip on macOS: `pip3 install --upgrade pip`
- To upgrade pip on Windows: `pip install --upgrade pip`

### 5. Verify Installation

Check that all packages are installed correctly:

**macOS/Linux:**
```bash
pip3 list
```

**Windows:**
```bash
pip list
```

You should see Flask and its dependencies listed.

## Usage

### Running the Application

1. **Make sure your virtual environment is activated** 
   - You should see `(venv)` at the beginning of your terminal prompt

2. **Start the Flask server:**

   **macOS/Linux:**
   ```bash
   python3 app.py
   ```
   
   **Windows:**
   ```bash
   python app.py
   ```

3. **You should see output like:**
   ```
    * Serving Flask app 'app'
    * Debug mode: on
    * Running on http://127.0.0.1:5000
    * Running on http://0.0.0.0:5000
   ```

4. **Access the application:**
   - Open your web browser (Safari, Chrome, Firefox, etc.)
   - Navigate to: `http://localhost:5000`
   - You'll see the user management interface

5. **To stop the server:**
   - Press `Control + C` in the Terminal (Mac) or `Ctrl + C` (Windows)

### API Endpoints

The application provides the following RESTful API endpoints:

- **GET** `/` - Home page with interactive UI
- **GET** `/users` - Get all users (returns JSON)
- **GET** `/user/<id>` - Get specific user by ID (returns JSON)
- **POST** `/user/add` - Add new user (expects JSON body: `{"name": "...", "email": "..."}`)
- **PUT** `/user/update/<id>` - Update user (expects JSON body with `name` and/or `email`)
- **DELETE** `/user/delete/<id>` - Delete user by ID

## Example API Requests

### Using the Web Interface
Simply open `http://localhost:5000` in your browser and use the form to add users.

### Using curl (Command Line)

**macOS/Linux Terminal:**

Add a new user:
```bash
curl -X POST http://localhost:5000/user/add \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

Get all users:
```bash
curl http://localhost:5000/users
```

Get a specific user:
```bash
curl http://localhost:5000/user/1
```

Update a user:
```bash
curl -X PUT http://localhost:5000/user/update/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Smith", "email": "johnsmith@example.com"}'
```

Delete a user:
```bash
curl -X DELETE http://localhost:5000/user/delete/1
```

**Windows Command Prompt:**

Add a new user:
```cmd
curl -X POST http://localhost:5000/user/add -H "Content-Type: application/json" -d "{\"name\": \"John Doe\", \"email\": \"john@example.com\"}"
```

Get all users:
```cmd
curl http://localhost:5000/users
```

### Using Python requests library

```python
import requests

# Add a user
response = requests.post('http://localhost:5000/user/add', 
                        json={'name': 'Jane Doe', 'email': 'jane@example.com'})
print(response.json())

# Get all users
response = requests.get('http://localhost:5000/users')
print(response.json())
```

## Database Schema

### Users Table

| Column     | Type      | Constraints                    |
|-----------|-----------|--------------------------------|
| id        | INTEGER   | PRIMARY KEY, AUTOINCREMENT     |
| name      | TEXT      | NOT NULL                       |
| email     | TEXT      | UNIQUE, NOT NULL               |
| created_at| TIMESTAMP | DEFAULT CURRENT_TIMESTAMP      |

The database file (`users.db`) is automatically created in the project directory when you run the application for the first time.

## Running Tests

Run the unit tests to verify everything is working:

**macOS/Linux:**
```bash
python3 -m pytest tests/test_app.py -v
```

Or using unittest:
```bash
python3 tests/test_app.py
```

**Windows:**
```bash
python -m pytest tests/test_app.py -v
```

Or using unittest:
```bash
python tests/test_app.py
```

## Configuration

Configuration settings are managed in `config.py`. You can switch between different environments:

- **Development** - Debug mode enabled, separate database
- **Production** - Debug mode disabled, uses environment variables
- **Testing** - Uses test database

## Deactivating the Virtual Environment

When you're done working on the project:

**macOS/Linux/Windows:**
```bash
deactivate
```

This returns your terminal to the normal system Python environment.

## macOS-Specific Tips

### Opening Terminal
- Press `Command + Space` to open Spotlight
- Type "Terminal" and press Enter
- Or find Terminal in Applications → Utilities

### Navigating Directories in Terminal
```bash
# Go to your home directory
cd ~

# Go to Downloads folder
cd ~/Downloads

# Go to Documents folder
cd ~/Documents

# Go up one directory level
cd ..

# List files in current directory
ls

# List files with details
ls -la

# Show current directory path
pwd
```

### Text Editing on Mac
- Use `nano` for simple editing: `nano app.py`
- Use `vim` for advanced editing: `vim app.py`
- Or use TextEdit, VS Code, or any other editor

### Useful Mac Terminal Shortcuts
- `Control + C` - Stop running program (like Flask server)
- `Control + D` - Exit terminal
- `Command + T` - New terminal tab
- `Command + K` - Clear terminal screen
- `Command + +` - Increase font size
- `Command + -` - Decrease font size

## Security Notes

⚠️ **Important for Production Use:**

- Change the `SECRET_KEY` in production (use environment variables)
- Use environment variables for all sensitive data
- Implement proper authentication and authorization
- Add input validation and sanitization
- Use HTTPS in production
- Enable CORS protection if building an API
- Implement rate limiting for API endpoints
- Use a production WSGI server like Gunicorn or uWSGI

## Troubleshooting

### macOS-Specific Issues

**Issue: "python: command not found"**
- Solution: Use `python3` instead of `python` on macOS

**Issue: "Permission denied" when installing packages**
- Solution: Make sure your virtual environment is activated (you should see `(venv)`)
- If still having issues, try: `pip3 install --user -r requirements.txt`

**Issue: Port 5000 is already in use (common on macOS Monterey+)**
- Solution: macOS AirPlay Receiver uses port 5000 by default
- Option 1: Disable AirPlay Receiver in System Preferences → Sharing
- Option 2: Change the port in `app.py` to 5001:
  ```python
  app.run(debug=True, host='0.0.0.0', port=5001)
  ```

**Issue: "xcrun: error: invalid active developer path"**
- Solution: Install Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

### General Issues

**Issue: Database locked error**
- Solution: Close any other connections to the database file

**Issue: Module not found errors**
- Solution: Make sure your virtual environment is activated and requirements are installed

**Issue: Browser can't connect to localhost**
- Solution: Check if the Flask server is running in your terminal
- Try using `http://127.0.0.1:5000` instead of `http://localhost:5000`

## Quick Start Commands (macOS)

Here's a complete command sequence to get started on Mac:

```bash
# Navigate to project directory
cd ~/Downloads/flask_sqlite_project

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install requirements
pip3 install -r requirements.txt

# Run the application
python3 app.py

# In your browser, go to:
# http://localhost:5000

# When done, stop the server with Control+C and deactivate:
# Control + C (to stop server)
# deactivate (to exit virtual environment)
```

## Future Enhancements

- Add user authentication and authorization (JWT tokens)
- Implement pagination for user lists
- Add data validation with Flask-WTF or Pydantic
- Migrate to SQLAlchemy ORM for more complex queries
- Add logging functionality
- Create comprehensive test suite with pytest
- Add API documentation with Swagger/OpenAPI
- Implement caching with Redis
- Add email verification for new users

## Project Files Explained

- **app.py** - Contains all Flask routes and application logic
- **database.py** - Handles database connections and CRUD operations
- **config.py** - Configuration for different environments
- **requirements.txt** - Lists all Python package dependencies
- **templates/index.html** - HTML template for the web interface
- **static/css/style.css** - Stylesheet for the web interface
- **static/js/main.js** - Frontend JavaScript for API calls
- **tests/test_app.py** - Unit tests for the application

## Learning Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)
- [RESTful API Design](https://restfulapi.net/)
- [Mac Terminal Basics](https://support.apple.com/guide/terminal/welcome/mac)

## License

This is a sample project for educational purposes.

## Support

If you encounter any issues or have questions, please check:
1. All prerequisites are installed (Python 3.8+)
2. Virtual environment is activated (look for `(venv)` in terminal)
3. All requirements are installed correctly (`pip3 list`)
4. You're in the correct directory (`pwd` to check)
5. Flask server is running (should see output in terminal)

---

**Happy Coding! 🚀**

*Built with ❤️ for learning Flask and Python web development*

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

## Installation

1. **Clone or download this project**

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. **Run the application**:
   ```bash
   python app.py
   ```

2. **Access the application**:
   - Open your browser and navigate to: `http://localhost:5000`

3. **API Endpoints**:

   - **GET** `/` - Home page
   - **GET** `/users` - Get all users
   - **GET** `/user/<id>` - Get specific user by ID
   - **POST** `/user/add` - Add new user (JSON body: `{"name": "...", "email": "..."}`)
   - **PUT** `/user/update/<id>` - Update user (JSON body: `{"name": "...", "email": "..."}`)
   - **DELETE** `/user/delete/<id>` - Delete user

## Example API Requests

### Add a new user (using curl):
```bash
curl -X POST http://localhost:5000/user/add \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Get all users:
```bash
curl http://localhost:5000/users
```

### Update a user:
```bash
curl -X PUT http://localhost:5000/user/update/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Smith", "email": "johnsmith@example.com"}'
```

### Delete a user:
```bash
curl -X DELETE http://localhost:5000/user/delete/1
```

## Database Schema

### Users Table
| Column     | Type      | Constraints                    |
|-----------|-----------|--------------------------------|
| id        | INTEGER   | PRIMARY KEY, AUTOINCREMENT     |
| name      | TEXT      | NOT NULL                       |
| email     | TEXT      | UNIQUE, NOT NULL               |
| created_at| TIMESTAMP | DEFAULT CURRENT_TIMESTAMP      |

## Configuration

Configuration settings are managed in `config.py`. You can switch between development, production, and testing environments.

## Security Notes

- Change the `SECRET_KEY` in production
- Use environment variables for sensitive data
- Implement proper authentication and authorization for production use
- Add input validation and sanitization
- Use HTTPS in production

## Future Enhancements

- Add user authentication and authorization
- Implement pagination for user lists
- Add data validation with Flask-WTF
- Integrate with SQLAlchemy ORM
- Add logging functionality
- Create comprehensive test suite
- Add API documentation with Swagger/OpenAPI

## License

This is a sample project for educational purposes.

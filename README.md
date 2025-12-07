# POSEIFY - Pose Detection & Analysis System

A full-stack application for real-time pose detection using MediaPipe, with automated database backups and email notifications.

## 🚀 Features

- **Real-time Pose Detection**: Extract 33 body landmarks from images using MediaPipe
- **Dual Database Architecture**: PostgreSQL for pose data + MongoDB for image metadata
- **Cloud Storage**: Cloudinary integration for image hosting
- **JWT Authentication**: Secure user registration and login
- **User Management**: Complete CRUD operations for user profiles
- **Automated Backups**: Daily database backups at 11:59 PM
- **Email Notifications**: Backup reports sent via Brevo (formerly Sendinblue)
- **RESTful API**: Complete API endpoints for all operations

---

## 📋 Table of Contents

- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Cron Jobs](#cron-jobs)
- [Database Schema](#database-schema)
- [Testing with Postman](#testing-with-postman)

---

## 🛠️ Technology Stack

### Backend
- **Node.js** (v14+) with Express.js
- **PostgreSQL** - Relational database for pose data
- **MongoDB Atlas** - NoSQL database for image metadata
- **Python 3.12** - MediaPipe pose detection

### Libraries & Services
- **Sequelize** - PostgreSQL ORM
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication (jsonwebtoken + bcryptjs)
- **Cloudinary** - Image hosting
- **Brevo** - Transactional email service
- **node-cron** - Scheduled tasks
- **archiver** - ZIP file creation

---

## ✅ Prerequisites

Before installation, ensure you have:

- **Node.js** v14.x or higher
- **Python** 3.12 (with pip)
- **PostgreSQL** 12.x or higher
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account
- **Brevo** account (for email notifications)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd POSEIFY
```

### 2. Backend Setup

```bash
cd backend
npm install
```

**Install required packages:**
```bash
npm install express cors helmet morgan dotenv
npm install sequelize pg pg-hstore
npm install mongoose
npm install jsonwebtoken bcryptjs
npm install cloudinary multer
npm install node-cron archiver
npm install @getbrevo/brevo
```

### 3. Python Environment Setup

```bash
cd ../python
python -m venv venv

# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install mediapipe opencv-python numpy pillow
```

### 4. PostgreSQL Database Setup

Create a new database:

```sql
CREATE DATABASE poseify;
```

The application will automatically create tables on first run.

### 5. MongoDB Setup

- Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Whitelist your IP address

---

## ⚙️ Configuration

### Environment Variables

Create `backend/.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# PostgreSQL Configuration
DATABASE_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=poseify
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=52428800
UPLOAD_PATH=./uploads

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Python Script Path
PYTHON_SCRIPT_PATH=../python/pose_extractor.py

# Cron Jobs
ENABLE_CRON_JOBS=true

# Brevo Email Configuration
BREVO_API_KEY=xkeysib-your-brevo-api-key
BREVO_FROM_EMAIL=noreply@yourdomain.com
BREVO_FROM_NAME=POSEIFY Backup System
ADMIN_EMAIL=admin@yourdomain.com

# Logging
LOG_LEVEL=debug
```

### Service Configuration

**Cloudinary Setup:**
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get credentials from Dashboard → Settings → API Keys
3. Add to `.env`

**Brevo Setup:**
1. Sign up at [Brevo](https://app.brevo.com/)
2. Go to SMTP & API → API Keys
3. Create new API key
4. Add to `.env`
5. Verify sender email in Senders & IP section

---

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
node server.js
```

Server will start on `http://localhost:5000`

You should see:
```
✓ MongoDB connected successfully
✓ SQL Database connected successfully
✓ SQL Models synchronized
✓ Cron jobs started (Daily backup at 11:59 PM)

╔════════════════════════════════════════╗
║   🚀 Server is running on port 5000   ║
║   Environment: development              ║
╚════════════════════════════════════════╝

📡 API Base URL: http://localhost:5000/api
💊 Health Check: http://localhost:5000/health
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### 1. Register User

**POST** `/api/users/register`

**Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login User

**POST** `/api/users/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "last_login": "2025-12-07T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 👤 User Management Endpoints

**All endpoints require Authentication Header:**
```
Authorization: Bearer <your_jwt_token>
```

### 3. Get Current User Profile

**GET** `/api/users/me`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2025-12-07T10:00:00.000Z",
    "last_login": "2025-12-07T10:30:00.000Z"
  }
}
```

### 4. Update User Profile

**PUT** `/api/users/me`

**Body:**
```json
{
  "username": "john_updated",
  "email": "john_new@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "username": "john_updated",
    "email": "john_new@example.com"
  }
}
```

### 5. Change Password

**PUT** `/api/users/change-password`

**Body:**
```json
{
  "currentPassword": "SecurePass123",
  "newPassword": "NewSecurePass456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 6. Get My Images

**GET** `/api/users/me/images?page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": {
    "images": [
      {
        "id": "674d5e8f123abc456def7890",
        "user_id": 1,
        "image_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234/poseify/poses/abc123.jpg",
        "cloudinary_public_id": "poseify/poses/abc123",
        "uploaded_at": "2025-12-07T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalImages": 25,
      "imagesPerPage": 10
    }
  }
}
```

### 7. Get My Poses

**GET** `/api/users/me/poses?page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": {
    "poses": [
      {
        "id": 1,
        "user_id": 1,
        "image_id": "674d5e8f123abc456def7890",
        "nose_x": 0.5,
        "nose_y": 0.3,
        "nose_z": -0.1,
        "left_eye_x": 0.45,
        "left_eye_y": 0.28,
        "created_at": "2025-12-07T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalPoses": 15,
      "posesPerPage": 10
    }
  }
}
```

### 8. Delete Account

**DELETE** `/api/users/me`

**Response:**
```json
{
  "success": true,
  "message": "User account deleted successfully"
}
```

---

## 🖼️ Image Management Endpoints

### 9. Get All Images

**GET** `/api/images`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "images": [
      {
        "_id": "674d5e8f123abc456def7890",
        "user_id": 1,
        "image_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234/poseify/poses/abc123.jpg",
        "cloudinary_public_id": "poseify/poses/abc123",
        "filename": "pose_1733590000.jpg",
        "original_name": "workout.jpg",
        "file_size": 245678,
        "mime_type": "image/jpeg",
        "width": 1920,
        "height": 1080,
        "uploaded_at": "2025-12-07T10:00:00.000Z",
        "pose_extracted": true,
        "sql_record_id": 1,
        "status": "completed"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalImages": 25,
      "imagesPerPage": 10
    }
  }
}
```

### 10. Get Single Image

**GET** `/api/images/:id`

**Parameters:**
- `id`: MongoDB ObjectId of the image

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "674d5e8f123abc456def7890",
    "user_id": 1,
    "image_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234/poseify/poses/abc123.jpg",
    "cloudinary_public_id": "poseify/poses/abc123",
    "uploaded_at": "2025-12-07T10:00:00.000Z"
  }
}
```

### 11. Delete Image

**DELETE** `/api/images/:id`

**Parameters:**
- `id`: MongoDB ObjectId of the image

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "data": {
    "id": "674d5e8f123abc456def7890",
    "cloudinary_public_id": "poseify/poses/abc123"
  }
}
```

---

## 📸 Pose Detection Endpoints

### 12. Extract Pose from Image

**POST** `/api/poses/extract-pose`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Body:** (Form-data)
- `image`: (File) - Image file (JPG, PNG, JPEG)

**Response:**
```json
{
  "success": true,
  "message": "Pose extracted and saved successfully",
  "data": {
    "image": {
      "id": "674d5e8f123abc456def7890",
      "user_id": 1,
      "image_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234/poseify/poses/abc123.jpg",
      "cloudinary_public_id": "poseify/poses/abc123"
    },
    "pose": {
      "id": 1,
      "user_id": 1,
      "image_id": "674d5e8f123abc456def7890",
      "landmarks": {
        "nose": { "x": 0.5, "y": 0.3, "z": -0.1, "visibility": 0.98 },
        "left_eye": { "x": 0.45, "y": 0.28, "z": -0.12, "visibility": 0.95 },
        "right_eye": { "x": 0.55, "y": 0.28, "z": -0.12, "visibility": 0.94 }
        // ... 30 more landmarks
      }
    }
  }
}
```

**Error Response (No Pose Detected):**
```json
{
  "success": false,
  "message": "No pose detected in the image",
  "pythonError": "No pose landmarks found"
}
```

### 13. Get All Poses

**GET** `/api/poses`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "image_id": "674d5e8f123abc456def7890",
      "created_at": "2025-12-07T10:00:00.000Z",
      "updated_at": "2025-12-07T10:00:00.000Z",
      "image": {
        "_id": "674d5e8f123abc456def7890",
        "image_url": "https://res.cloudinary.com/.../pose.jpg"
      }
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "pages": 2
  }
}
```

### 14. Get Pose by ID

**GET** `/api/poses/:id`

**Parameters:**
- `id`: PostgreSQL pose record ID (integer)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "image_id": "674d5e8f123abc456def7890",
    "created_at": "2025-12-07T10:00:00.000Z",
    "updated_at": "2025-12-07T10:00:00.000Z",
    "image": {
      "_id": "674d5e8f123abc456def7890",
      "image_url": "https://res.cloudinary.com/.../pose.jpg"
    },
    "landmarks": [
      {
        "name": "nose",
        "x": 0.498,
        "y": 0.312,
        "z": -0.089,
        "visibility": 0.986
      },
      {
        "name": "left_eye_inner",
        "x": 0.445,
        "y": 0.287,
        "z": -0.112,
        "visibility": 0.952
      }
      // ... 31 more landmarks (33 total)
    ]
  }
}
```

### 15. Get Pose by Image ID

**GET** `/api/poses/image/:imageId`

**Parameters:**
- `imageId`: MongoDB ObjectId of the image

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "image_id": "674d5e8f123abc456def7890",
    "created_at": "2025-12-07T10:00:00.000Z",
    "updated_at": "2025-12-07T10:00:00.000Z",
    "image": {
      "_id": "674d5e8f123abc456def7890",
      "image_url": "https://res.cloudinary.com/.../pose.jpg"
    },
    "landmarks": [
      {
        "name": "nose",
        "x": 0.498,
        "y": 0.312,
        "z": -0.089,
        "visibility": 0.986
      }
      // ... 32 more landmarks
    ]
  }
}
```

### 16. Delete Pose

**DELETE** `/api/poses/:id`

**Parameters:**
- `id`: PostgreSQL pose record ID (integer)

**Response:**
```json
{
  "success": true,
  "message": "Pose data deleted successfully",
  "data": {
    "id": 1,
    "image_id": "674d5e8f123abc456def7890"
  }
}
```

---

## 💾 Backup Management Endpoints

### 17. Create Backup (Manual)

**POST** `/api/backup/create?sendEmail=true`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
- `sendEmail` (optional): Set to `true` to send email notification

**Response:**
```json
{
  "success": true,
  "message": "Backup created successfully",
  "data": {
    "filename": "2025-12-07-backup.zip",
    "path": "C:\\path\\to\\backend\\backups\\2025-12-07-backup.zip",
    "duration": "0.08s",
    "alreadyExists": false,
    "emailSent": true,
    "emailRecipient": "admin@example.com"
  }
}
```

### 18. List All Backups

**GET** `/api/backup/list`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "backups": [
      {
        "filename": "2025-12-07-backup.zip",
        "path": "C:\\path\\to\\backend\\backups\\2025-12-07-backup.zip",
        "size": "8.23 KB",
        "created": "2025-12-07T10:30:00.000Z"
      },
      {
        "filename": "2025-12-06-backup.zip",
        "path": "C:\\path\\to\\backend\\backups\\2025-12-06-backup.zip",
        "size": "7.95 KB",
        "created": "2025-12-06T23:59:00.000Z"
      }
    ],
    "count": 2
  }
}
```

### 19. Download Backup

**GET** `/api/backup/download/:filename`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Example:**
```
GET /api/backup/download/2025-12-07-backup.zip
```

**Response:** ZIP file download

### 20. Delete Backup

**DELETE** `/api/backup/:filename`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Example:**
```
DELETE /api/backup/2025-12-06-backup.zip
```

**Response:**
```json
{
  "success": true,
  "message": "Backup deleted successfully",
  "data": {
    "filename": "2025-12-06-backup.zip"
  }
}
```

---

## ⏰ Cron Jobs Configuration

### Automated Daily Backup

**Schedule:** Every day at 11:59 PM

**Configuration:** `backend/cron/jobs.js`

```javascript
const cron = require('node-cron');
const { performBackup } = require('../services/backupService');

// Schedule: '59 23 * * *' = 11:59 PM daily
const backupJob = cron.schedule('59 23 * * *', async () => {
  console.log('[Cron] Running daily backup job...');
  
  const result = await performBackup(true); // true = send email
  
  if (result.success) {
    console.log(`[Cron] ✓ Backup completed: ${result.filename}`);
    console.log(`[Cron] Email sent: ${result.emailSent}`);
  } else {
    console.error(`[Cron] ✗ Backup failed:`, result.error);
  }
}, {
  scheduled: true,
  timezone: "America/New_York" // Change to your timezone
});
```

### Enable/Disable Cron Jobs

Set in `.env`:
```env
ENABLE_CRON_JOBS=true   # Enable
ENABLE_CRON_JOBS=false  # Disable
```

### Backup Contents

Each backup ZIP contains:

```
2025-12-07-backup.zip
├── postgres.json          # PostgreSQL data (users, pose_data)
├── mongodb/
│   ├── images.json       # MongoDB images collection
│   └── metadata.json     # Collection summary
└── backup-info.json      # Backup metadata
```

### Backup Retention

- Automatically keeps the last **30 backups**
- Older backups are deleted automatically
- Manual backups also count toward this limit

---

## 🗄️ Database Schema

### PostgreSQL Tables

#### `users` Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

#### `pose_data` Table
```sql
CREATE TABLE pose_data (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  image_id VARCHAR(255),
  
  -- 33 landmarks × 4 values (x, y, z, visibility) = 132 columns
  nose_x FLOAT,
  nose_y FLOAT,
  nose_z FLOAT,
  nose_visibility FLOAT,
  
  left_eye_inner_x FLOAT,
  left_eye_inner_y FLOAT,
  left_eye_inner_z FLOAT,
  left_eye_inner_visibility FLOAT,
  
  -- ... (29 more landmarks)
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### MongoDB Collections

#### `images` Collection
```javascript
{
  _id: ObjectId("674d5e8f123abc456def7890"),
  user_id: 1,                    // References PostgreSQL users.id
  image_url: "https://res.cloudinary.com/...",
  cloudinary_public_id: "poseify/poses/abc123",
  uploaded_at: ISODate("2025-12-07T10:00:00.000Z")
}
```

---

## 🧪 Testing with Postman

### Setup Postman Collection

1. **Import Environment Variables**

Create a new environment with:
```
base_url = http://localhost:5000/api
jwt_token = (leave empty, will be set automatically)
```

2. **Set Authorization**

For protected endpoints, use:
- Type: **Bearer Token**
- Token: `{{jwt_token}}`

### Testing Workflow

#### Step 1: Register & Login

1. **Register User**
   - POST `{{base_url}}/users/register`
   - Body: JSON with username, email, password
   - Save the token from response

2. **Login User**
   - POST `{{base_url}}/users/login`
   - Body: JSON with email, password
   - Copy token from response
   - Set environment variable: `jwt_token = <copied_token>`

#### Step 2: Upload Image & Extract Pose

1. **Extract Pose**
   - POST `{{base_url}}/poses/extract-pose`
   - Authorization: Bearer `{{jwt_token}}`
   - Body: form-data
     - Key: `image`
     - Type: File
     - Value: Select an image file
   - Response shows image URL and 33 landmarks

#### Step 3: Manage Backups

1. **Create Backup with Email**
   - POST `{{base_url}}/backup/create?sendEmail=true`
   - Authorization: Bearer `{{jwt_token}}`
   - Check email inbox for backup notification

2. **List Backups**
   - GET `{{base_url}}/backup/list`
   - Authorization: Bearer `{{jwt_token}}`

3. **Download Backup**
   - GET `{{base_url}}/backup/download/2025-12-07-backup.zip`
   - Authorization: Bearer `{{jwt_token}}`
   - Save response as file

### Example Postman Responses

#### Successful Pose Detection
```json
{
  "success": true,
  "message": "Pose extracted and saved successfully",
  "data": {
    "image": {
      "id": "674d5e8f123abc456def7890",
      "image_url": "https://res.cloudinary.com/.../pose.jpg"
    },
    "pose": {
      "id": 1,
      "landmarks": {
        "nose": { "x": 0.498, "y": 0.312, "z": -0.089, "visibility": 0.986 }
      }
    }
  }
}
```

#### Backup Created with Email
```json
{
  "success": true,
  "message": "Backup created successfully",
  "data": {
    "filename": "2025-12-07-backup.zip",
    "duration": "0.08s",
    "emailSent": true,
    "emailRecipient": "admin@example.com"
  }
}
```

---

## 📧 Email Notification Sample

When a backup is created with `sendEmail=true`, you'll receive:

**Subject:** `Daily DB Backup - 2025-12-07`

**Body:**
```
✅ Database Backup Completed

Your daily database backup has been completed successfully.

Backup Details:
📁 Filename: 2025-12-07-backup.zip
💾 Size: 8.23 KB
📅 Date: 2025-12-07
🕐 Time: 12/7/2025, 11:59:00 PM

The backup file contains:
• PostgreSQL database (users, pose_data)
• MongoDB collections (images metadata)
• Backup metadata

[Attachment: 2025-12-07-backup.zip]
```

---

## 🔍 Use Cases

### Use Case 1: Fitness Application
- Users upload workout photos
- System detects body pose and tracks form
- Store progression over time
- Daily backups ensure data safety

### Use Case 2: Physical Therapy
- Patients upload exercise photos
- Therapists review pose accuracy
- Track rehabilitation progress
- Automated backups for compliance

### Use Case 3: Sports Analytics
- Athletes upload training photos
- Coaches analyze body mechanics
- Compare poses across sessions
- Secure backup of training data

---

## 🐛 Troubleshooting

### Common Issues

**1. Python Script Not Found**
```
Error: Python script execution failed
```
**Solution:** Update `PYTHON_SCRIPT_PATH` in `.env` to absolute path

**2. Email Not Sending**
```
[Email] Failed to send backup notification: Request failed with status code 401
```
**Solution:** 
- Verify Brevo API key
- Check sender email is verified in Brevo dashboard

**3. Cloudinary Upload Failed**
```
Error: Invalid Cloudinary credentials
```
**Solution:** Verify `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in `.env`

**4. JWT Token Expired**
```
{"success": false, "message": "Token expired"}
```
**Solution:** Login again to get a new token (default: 7 days expiry)

---

## 📝 Notes

- JWT tokens expire after 7 days (configurable via `JWT_EXPIRE`)
- Images uploaded to Cloudinary are NOT deleted when user deletes account
- Backup ZIP files are stored in `backend/backups/` directory
- Maximum file upload size: 50 MB (configurable via `MAX_FILE_SIZE`)
- Python virtual environment must be activated before running pose detection

---

## 📊 API Endpoints Summary

**Total: 20 API Endpoints**

### Authentication & User Management (8 routes)
1. POST `/api/users/register` - User registration
2. POST `/api/users/login` - User login
3. GET `/api/users/me` - Get current user profile
4. PUT `/api/users/me` - Update profile
5. PUT `/api/users/change-password` - Change password
6. GET `/api/users/me/images` - Get user's images
7. GET `/api/users/me/poses` - Get user's poses
8. DELETE `/api/users/me` - Delete account

### Image Management (3 routes)
9. GET `/api/images` - Get all images with pagination
10. GET `/api/images/:id` - Get single image by MongoDB ID
11. DELETE `/api/images/:id` - Delete image from MongoDB and Cloudinary

### Pose Detection & Management (5 routes)
12. POST `/api/poses/extract-pose` - Extract pose from image (requires auth)
13. GET `/api/poses` - Get all poses with pagination
14. GET `/api/poses/:id` - Get pose by SQL ID with landmarks
15. GET `/api/poses/image/:imageId` - Get pose by MongoDB image ID
16. DELETE `/api/poses/:id` - Delete pose and associated data

### Backup Management (4 routes)
17. POST `/api/backup/create?sendEmail=true` - Manual backup with optional email
18. GET `/api/backup/list` - List all backups
19. GET `/api/backup/download/:filename` - Download backup ZIP
20. DELETE `/api/backup/:filename` - Delete specific backup

---

## 📸 API Response Screenshots

### 1. User Authentication

#### GET `/api/users/` - Get All Users
![Get All Users](screenshots/get-all-users.png)

**Description**: Retrieves list of all registered users with pagination support.

**Response**: 
- Shows user details including username, email, first_name, last_name
- Includes user status (is_active) and last login timestamp
- Example users: "Doe", "testuser", "admin"

---

#### POST `/api/poses/extract-pose` - Extract Pose from Image
![Extract Pose](screenshots/extract-pose.png)

**Description**: Uploads an image and extracts 33 pose landmarks using MediaPipe.

**Response**:
- `image_id`: MongoDB reference
- `sql_record_id`: PostgreSQL reference
- `filename`: Original image name
- `image_url`: Cloudinary hosted URL
- `cloudinary_public_id`: Cloud storage identifier
- `num_landmarks`: 33 body keypoints detected
- `image_dimensions`: Width and height
- `landmarks`: Array of all detected keypoints with name, x, y, z coordinates and visibility score

**Key Landmarks**:
- nose, left_eye_inner, left_eye, right_eye_inner, right_eye
- left_shoulder, right_shoulder, left_elbow, right_elbow
- left_wrist, right_wrist, left_hip, right_hip
- And 21 more keypoints for complete body tracking

---

#### GET `/api/poses` - Get All Poses
![Get All Poses](screenshots/get-all-poses.png)

**Description**: Retrieves all detected poses with pagination.

**Response**:
- Complete pose data with all 33 landmark coordinates
- Each pose includes image reference and user association
- Raw coordinate data (nose_x, nose_y, nose_z, visibility scores)
- Linked to specific image_id in MongoDB

---

#### GET `/api/users/me/images` - Get User's Images
![Get User Images](screenshots/get-user-images.png)

**Description**: Retrieves all images uploaded by the authenticated user.

**Response**:
- `images`: Array of image objects
- Each image includes:
  - MongoDB `_id`
  - `filename` and `original_name`
  - `file_path`: Local upload path
  - `image_url`: Cloudinary CDN URL
  - `cloudinary_public_id`: Cloud identifier
  - `file_size`: Image size in bytes
  - `mime_type`: Image format (e.g., image/jpeg)
  - `width` and `height`: Image dimensions
  - `user_id`: Owner reference
  - `status`: Processing status
  - `pose_extracted`: Boolean flag
  - `sql_record_id`: PostgreSQL reference
  - Timestamps: `createdAt` and `updatedAt`
- `pagination`: Current page and total counts

---

### 2. Backup System

#### POST `/api/backup/create?sendEmail=true` - Create Backup with Email
![Create Backup with Email](screenshots/create-backup-email.png)

**Description**: Manually triggers a database backup and sends email notification.

**Response**:
- `success`: true
- `message`: "Backup created successfully"
- `data`:
  - `filename`: Timestamped backup file (e.g., 2025-12-07-backup.zip)
  - `path`: Full file system path
  - `duration`: Time taken to create backup
  - `alreadyExists`: false (new backup created)
  - `emailSent`: true
  - `emailRecipient`: Admin email address

**Email Notification**:
- Subject: "✅ Database Backup Completed"
- Contains backup details (filename, size, date, time)
- Includes ZIP file as attachment
- Sent to configured admin email

---

### 3. Database Backup Contents

#### PostgreSQL Export - Users Table
![PostgreSQL Backup](screenshots/postgres-backup.png)

**Description**: Exported PostgreSQL data showing users and pose_data tables.

**Contents**:
- `exportDate`: Timestamp of backup
- `database`: "poseify"
- `tables`:
  - **users**: Complete user records with encrypted passwords
    - id, username, email, first_name, last_name
    - is_active status
    - last_login timestamp
    - created_at and updated_at
  - **pose_data**: Pose landmark records (count: 1)
    - All 33 landmark coordinates (x, y, z, visibility)
    - Linked to image_id and user_id

---

#### MongoDB Export - Images Collection
![MongoDB Backup](screenshots/mongodb-backup-images.png)

**Description**: Exported MongoDB images collection.

**Contents**:
- Image metadata with Cloudinary integration
- Fields:
  - `_id`: MongoDB ObjectId
  - `filename`: Stored filename
  - `original_name`: Original upload name
  - `file_path`: Local storage path
  - `image_url`: Cloudinary CDN URL
  - `cloudinary_public_id`: Cloud storage ID
  - `file_size`: 7485 bytes
  - `mime_type`: "image/jpeg"
  - `width` and `height`: 225x225
  - `user_id`: 5 (owner reference)
  - `status`: "processed"
  - `pose_extracted`: true
  - `sql_record_id`: 8 (PostgreSQL reference)

---

#### MongoDB Export - Summary
![MongoDB Summary](screenshots/mongodb-backup-summary.png)

**Description**: Backup summary showing database structure.

**Contents**:
- `exportDate`: "2025-12-07T07:55:00.103Z"
- `database`: "MongoDB"
- `note`: "Images are stored in MongoDB, pose landmarks are stored in PostgreSQL"
- `collections`:
  - **images**: 
    - `count`: 1
    - `description`: "Image metadata including Cloudinary URLs and user associations"

This shows the dual-database architecture where MongoDB stores image metadata and PostgreSQL stores pose landmark coordinates.

---

### 4. Email Notification Preview

#### Brevo Email - Backup Completed
![Backup Email Notification](screenshots/email-notification.png)

**Description**: Automated email sent via Brevo service after successful backup.

**Email Details**:
- **Subject**: ✅ Database Backup Completed
- **Message**: "Your daily database backup has been completed successfully."
- **Backup Details**:
  - 📋 Filename: 2025-12-07-backup.zip
  - 💾 Size: 0.01 MB
  - 📅 Date: 2025-12-07
  - 🕐 Time: 12/7/2025, 12:40:43 PM
- **Attachment**: ZIP file containing PostgreSQL and MongoDB exports
- **From**: vk5884074@gmail.com
- **To**: vamsi989596@gmail.com

---

## 🎯 Key Features Demonstrated

### ✅ Complete CRUD Operations
- User registration and authentication
- Image upload and management
- Pose detection and retrieval
- Backup creation and management

### ✅ Dual Database Architecture
- **PostgreSQL**: Structured pose landmark data (33 coordinates per pose)
- **MongoDB**: Flexible image metadata with Cloudinary integration

### ✅ Cloud Integration
- **Cloudinary**: Image hosting with CDN
- **Brevo**: Reliable email notifications

### ✅ Automated Workflows
- Daily backups at 11:59 PM
- Email notifications with attachments
- Automatic cleanup of old backups (keeps last 30)

### ✅ Security & Authentication
- JWT tokens with 7-day expiration
- bcrypt password hashing
- Protected API endpoints
- User ownership validation

---

## 🚀 Deployment to Render

### Quick Setup (5 minutes)

#### 1. Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Name: `poseify-postgres`, Plan: **Free**
4. Copy the **Internal Database URL**

#### 2. Deploy Web Service
1. Click **New +** → **Web Service**
2. Connect GitHub: `your-username/poseify`
3. Configure:
   - **Name**: `poseify-api`
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     cd backend && npm install && cd ../python && pip install --no-cache-dir -r requirements.txt
     ```
   - **Start Command**: 
     ```bash
     cd backend && node server.js
     ```

#### 3. Environment Variables
Add these in Render's Environment tab:
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<paste-postgres-internal-url>
MONGO_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
BREVO_API_KEY=<your-brevo-key>
BREVO_FROM_EMAIL=<your-email>
ADMIN_EMAIL=<your-admin-email>
```

### ⚠️ Important Note About MediaPipe

**MediaPipe is NOT compatible with Render's free tier environment.** 

For production deployment on Render, you have these options:

1. **Remove pose detection temporarily** - Deploy without MediaPipe, add it later
2. **Use alternative platforms**:
   - **Railway** (supports Python binary dependencies)
   - **Google Cloud Run** (supports Docker with MediaPipe)
   - **AWS EC2** (full control over environment)
3. **Use TensorFlow Lite or ONNX Runtime** - Lighter alternatives to MediaPipe

**For now**: The app will deploy successfully but pose extraction endpoint will fail. All other features (user auth, images, backups, email) work perfectly!

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**POSEIFY Development Team**

- Backend: Node.js + Express
- Pose Detection: Python + MediaPipe
- Databases: PostgreSQL + MongoDB
- Cloud Services: Cloudinary + Brevo

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@poseify.com
- Documentation: [Full API Docs](http://localhost:5000/api/docs)

---

**Built with ❤️ using Node.js, Python, and MediaPipe**

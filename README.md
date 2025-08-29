# Chat With Me

A full-stack real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring modern UI, real-time messaging, and comprehensive user management.

## Features

### Core Chat Functionality

- **Real-time messaging** with Socket.IO
- **Online/offline status** indicators
- **Message history** persistence
- **Image sharing** with Cloudinary integration
- **Responsive design** for desktop and mobile

### Enhanced Features (Added)

- **Email Verification System**
  - SMTP integration with Gmail
  - Crypto-generated verification tokens
  - 24-hour token expiration
  - Rate limiting (5-minute cooldown)
- **Message Read Receipts**

  - `isRead` status tracking
  - Unread message count badges
  - Real-time unread count updates
  - Auto-mark as read when opening conversation

- **Authentication**

  - JWT-based authentication
  - Protected routes for verified users
  - Profile picture updates with Cloudinary
  - Secure logout functionality

- **Route Protection & Error Handling**

  - 404 Not Found page with humor
  - Email verification requirement
  - Protected route middleware
  - Comprehensive error handling

- **Enhanced UI/UX**
  - DaisyUI + Tailwind CSS styling
  - Loading states and skeletons
  - Real-time user reordering by recent activity
  - Notification badges in navbar
  - Online user filtering

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications
- **Vite** - Fast build tool

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage and optimization
- **Nodemailer** - Email sending service
- **Cookie Parser** - Cookie handling middleware
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud)
- **Cloudinary account** (for image uploads)
- **Gmail account** (for email verification)

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/divverma2003/chat-with-me.git
cd chat-with-me
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5001

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=your_gmail_address
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Start the Application

**Backend** (Terminal 1):

```bash
cd backend
npm run dev
```

**Frontend** (Terminal 2):

```bash
cd frontend
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001

## 🔧 Environment Variables

### Backend (.env)

| Variable                | Description                          |
| ----------------------- | ------------------------------------ |
| `MONGODB_URI`           | MongoDB connection string            |
| `JWT_SECRET`            | Secret key for JWT tokens            |
| `NODE_ENV`              | Environment (development/production) |
| `PORT`                  | Server port (default: 5001)          |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                   |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                |
| `EMAIL_USER`            | Gmail address for sending emails     |
| `EMAIL_PASS`            | Gmail app password                   |
| `EMAIL_FROM`            | From email address                   |

## 📱 Key Features Explained

### Email Verification System

- Users must verify their email before accessing the chat
- Verification tokens expire after 24 hours
- Rate limiting prevents spam (5-minute cooldown)
- Fallback UI for manual email entry

### Message Read Receipts

- Messages have `isRead` status (default: false)
- Opening a conversation marks all messages as read
- Real-time unread count badges on sidebar and navbar
- Efficient MongoDB aggregation for unread counts

### Real-time Features

- Instant message delivery with Socket.IO
- Online/offline status updates
- User list reordering by recent activity
- Live unread count updates

### Route Protection

- Email verification required for access
- JWT token validation
- Automatic redirects for unverified users
- 404 page for unknown routes

## Credits

**Base Application Setup & Configuration**: [burakorkmez/fullstack-chat-app](https://github.com/burakorkmez/fullstack-chat-app)

** Features Added**:

- Email verification system with SMTP integration
- Message read receipts and unread count tracking
- Advanced route protection and error handling
- Real-time user reordering and notifications
- Comprehensive authentication flow improvements

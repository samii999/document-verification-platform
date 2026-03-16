# Secure Document Verification Platform

A full-stack application for secure document upload, storage, and verification using cryptographic hashing.

## 🏗️ Architecture

### Frontend (Next.js 16.1.6)
- **Framework**: Next.js 16.1.6 with TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: JWT-based with React Context
- **File Handling**: Client-side SHA256 hash generation
- **State Management**: React hooks and context

### Backend (Node.js + TypeScript)
- **Framework**: Express.js 5.2.1 with TypeScript
- **Database**: MongoDB with Mongoose 9.3.0 ODM
- **Authentication**: JWT with bcryptjs 3.0.3 password hashing
- **File Storage**: Local filesystem with Multer 2.1.1
- **Security**: Express middleware for protection

### Database Schema
- **Users Collection**: email (unique), password (bcrypt hashed), role (user/admin), timestamps
- **Documents Collection**: userId (ref), filename, originalName, hash (unique), fileSize, mimeType, verified (boolean), verificationDate, timestamps

## 🔒 Security Implementation

### Authentication Security
- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ JWT tokens with expiration (7 days)
- ✅ Protected API routes with middleware
- ✅ Role-based access control (user/admin)

### File Upload Security
- ✅ File type restriction (PDF, PNG, JPG)
- ✅ File size limitation (10MB max)
- ✅ Server-side hash verification
- ✅ Secure file storage with unique filenames

### API Security
- ✅ Rate limiting (express-rate-limit)
- ✅ Input validation (express-validator)
- ✅ CORS configuration
- ✅ JWT expiration handling
- ✅ File upload validation
- ✅ NoSQL injection protection (Mongoose)

## 🚀 Installation Instructions

### Prerequisites
- Node.js (v22.20.0 or higher)
- MongoDB (Atlas)
- npm

### 1. Clone Repository
```bash
git clone https://github.com/samii999/document-verification-platform.git
cd document-verification-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Backend Environment Variables
Create `.env` file in backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/document-verification

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Frontend Environment Variables
Create `.env.local` file in frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 6. Start MongoDB
```bash


# Used: MongoDB Atlas (update MONGODB_URI in .env)
```

### 7. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📁 Project Structure

```
document-verification-platform/
├── README.md
├── folderstructure.md
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   ├── .env.example
│   ├── uploads/
│   └── src/
│       ├── server.ts
│       ├── config/
│       │   └── db.ts
│       ├── models/
│       │   ├── User.ts
│       │   └── Document.ts
│       ├── controllers/
│       │   ├── authController.ts
│       │   └── documentController.ts
│       ├── routes/
│       │   ├── authRoutes.ts
│       │   └── documentRoutes.ts
│       ├── middleware/
│       │   ├── authMiddleware.ts
│       │   ├── adminMiddleware.ts
│       │   ├── uploadMiddleware.ts
│       │   ├── rateLimitMiddleware.ts
│       │   └── validationMiddleware.ts
│       ├── services/
│       │   └── hashService.ts
│       ├── utils/
│       │   └── generateHash.ts
│       └── validators/
│           └── authValidator.ts
│
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── .env.local
    ├── .gitignore
    ├── eslint.config.mjs
    ├── next-env.d.ts
    ├── tsconfig.tsbuildinfo
    ├── postcss.config.mjs
    ├── public/
    │   ├── file.svg
    │   ├── globe.svg
    │   └── next.svg
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── login/
        │   │   └── page.tsx
        │   ├── register/
        │   │   └── page.tsx
        │   ├── dashboard/
        │   │   └── page.tsx
        │   ├── upload/
        │   │   └── page.tsx
        │   ├── verify/
        │   │   └── [id]/
        │   │       └── page.tsx
        │   └── admin/
        │       └── page.tsx
        ├── components/
        │   ├── Navbar.tsx
        │   └── FileUpload.tsx
        ├── services/
        │   └── api.ts
        ├── hooks/
        │   └── useAuth.tsx
        ├── context/
        │   └── AuthContext.tsx
        ├── types/
        │   └── index.ts
        ├── utils/
        │   └── hashGenerator.ts
        └── styles/
            └── globals.css
```

## 🎯 Core Features

### 1. User Authentication
- **Registration**: Email validation, password strength requirements
- **Login**: JWT token generation, session management
- **Security**: Bcrypt hashing, protected routes

### 2. Secure Document Upload
- **Client-side**: SHA256 hash generation before upload
- **Server-side**: Hash verification, secure file storage
- **Validation**: File type and size restrictions
- **Metadata**: Complete document tracking

### 3. Document Verification
- **Upload Verification**: Compare file hashes
- **Results Display**: Valid/Modified status with metadata
- **History**: Upload timestamp and original uploader

### 4. Admin Dashboard
- **Document Management**: View all uploaded documents
- **Search**: Filter by hash or user
- **Actions**: Delete suspicious files
- **Access Control**: Admin-only access

## 🔐 Security Features

### Implemented Protections:
1. **Rate Limiting**: Prevents API abuse
2. **Input Validation**: Sanitizes all user inputs
3. **CORS Configuration**: Proper cross-origin setup
4. **JWT Expiration**: Token lifecycle management
5. **File Upload Validation**: Type and size restrictions
6. **Password Security**: Bcrypt hashing (never plain text)
7. **NoSQL Injection**: Mongoose protection

### Security Decisions:
- **JWT Authentication**: Stateless tokens with 7-day expiration
- **Local File Storage**: Direct control over uploaded documents
- **SHA256 Hashing**: Cryptographic integrity verification algorithm
- **Role-based Access Control**: User vs Admin permissions
- **Input Validation**: express-validator for all API inputs
- **Rate Limiting**: express-rate-limit for API protection

## 📋 Live Demonstration Checklist

### Required Demo Flow:
1. ✅ **User Registration**
   - Navigate to `/register`
   - Fill registration form
   - Account created successfully

2. ✅ **User Login**
   - Navigate to `/login`
   - Enter credentials
   - JWT token received and stored

3. ✅ **Document Upload**
   - Navigate to `/upload`
   - Select file (PDF/PNG/JPG)
   - View SHA256 hash
   - Upload successful

4. ✅ **Document Verification**
   - Navigate to `/verify`
   - Upload same/modified file
   - See verification result
   - Display metadata

5. ✅ **Admin Dashboard**
   - Login as admin
   - Navigate to `/admin`
   - View all documents
   - Search and delete functionality

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user documents
- `POST /api/documents/verify/:id` - Verify document
- `GET /api/documents/all` - Get all documents (admin)
- `DELETE /api/documents/:id` - Delete document

## 🛠️ Development Commands

### Backend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

## 📝 Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)
- `MONGODB_URI`: MongoDB connection string (Atlas or local)
- `JWT_SECRET`: JWT signing secret key
- `JWT_EXPIRES_IN`: Token expiration time (default: 7d)
- `FRONTEND_URL`: Frontend URL for CORS configuration
- `MAX_FILE_SIZE`: Maximum upload file size (default: 10485760 bytes)
- `UPLOAD_PATH`: File upload directory (default: ./uploads)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: http://localhost:5000/api)

## 🎨 UI/UX Features

- **Responsive Design**: Works on all devices
- **Real-time Feedback**: Hash generation and verification
- **Error Handling**: Comprehensive error messages
- **Loading States**: User feedback during operations
- **Navigation**: Intuitive user flow

## 🔄 Database Schema

### Users Collection
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  role: String (user/admin, default: user),
  createdAt: Date,
  updatedAt: Date
}
```

### Documents Collection
```javascript
{
  userId: ObjectId (ref: User),
  filename: String (required),
  originalName: String (required),
  hash: String (unique, required),
  fileSize: Number (required),
  mimeType: String (required),
  verified: Boolean (default: false),
  verificationDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment Notes

### Production Considerations:
- Use environment-specific secrets
- Implement HTTPS
- Set up proper file backup
- Configure production MongoDB
- Enable logging and monitoring

## 📞 Support

For technical questions or issues during the demo, please refer to the implementation details above.

---

**Note**: This project demonstrates enterprise-level security practices and full-stack development capabilities suitable for production environments.

# CertifyTrack

CertifyTrack is a comprehensive learning management system (LMS) platform that allows users to enroll in courses, track their progress, and receive certificates upon completion. The platform supports course management, user authentication, task tracking, and certificate issuance.

## Technology Stack

### Frontend
- **Next.js 14** - React framework with server-side rendering and API routes
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **Zustand** - Lightweight state management
- **NextAuth.js** - Authentication solution

### Backend
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **Cloudinary** - Cloud-based image and video management
- **Next.js API Routes** - Serverless API endpoints
- **UUID** - Unique ID generation for certificates

## Project Structure

```
certifytrack/
├── src/
│   ├── app/ - Next.js app directory structure
│   │   ├── api/ - API routes
│   │   ├── admin/ - Admin panel pages
│   │   ├── batch/ - Batch/course detail pages
│   │   ├── courses/ - Course listing pages
│   │   ├── learning/ - Learning pages for enrolled users
│   │   └── ... - Other app routes
│   ├── components/ - Reusable React components
│   │   ├── admin/ - Admin-specific components
│   │   ├── learning/ - Learning-specific components
│   │   └── ... - Other components
│   ├── lib/ - Utility functions and libraries
│   │   ├── fetchUtils.js - API utility functions
│   │   ├── mongodb.js - MongoDB connection
│   │   └── ... - Other utility files
│   ├── models/ - Mongoose models
│   │   ├── Batch.js - Course batch model
│   │   ├── Certificate.js - Certificate model
│   │   ├── Enrollment.js - Enrollment model
│   │   ├── Task.js - Task model
│   │   └── User.js - User model
│   └── store/ - Zustand state management
│       ├── authStore.js - Authentication state
│       ├── batchStore.js - Batch/course state
│       ├── taskStore.js - Task state
│       └── certificateStore.js - Certificate state
└── public/ - Static assets
```

## Features

### User Features
- **Authentication** - Sign up, log in, and manage user profiles
- **Course Catalog** - Browse available courses
- **Course Enrollment** - Enroll in courses and track progress
- **Learning Dashboard** - Access course content and track completion
- **Certificate Verification** - Verify certificates with unique IDs
- **Certificate Management** - View and download earned certificates

### Admin Features
- **Course Management** - Create, edit, and delete courses
- **User Management** - Manage user accounts and permissions
- **Task Creation** - Add tasks to courses with content and resources
- **Certificate Creation** - Design and issue certificates
- **Certificate Issuance** - Issue certificates to course participants
- **Analytics** - View enrollment and completion statistics

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in an existing user
- `GET /api/auth/me` - Get current user information

### Batches (Courses)
- `GET /api/batches` - Get all batches/courses
- `GET /api/batches/:id` - Get a specific batch by ID
- `POST /api/admin/batches` - Create a new batch (admin only)
- `PUT /api/admin/batches/:id` - Update a batch (admin only)
- `DELETE /api/admin/batches/:id` - Delete a batch (admin only)

### Tasks
- `GET /api/tasks/batch/:batchId` - Get tasks for a specific batch
- `GET /api/tasks/:id` - Get a specific task by ID
- `POST /api/admin/tasks` - Create a new task (admin only)
- `PUT /api/admin/tasks/:id` - Update a task (admin only)
- `DELETE /api/admin/tasks/:id` - Delete a task (admin only)
- `POST /api/tasks/:id/complete` - Mark a task as completed
- `POST /api/tasks/:id/uncomplete` - Mark a task as uncompleted

### Enrollments
- `GET /api/enrollments` - Get user enrollments
- `GET /api/enrollment/check` - Check if a user is enrolled in a batch
- `POST /api/enrollments` - Enroll a user in a batch
- `POST /api/enrollments/complete-task` - Mark a task as completed for an enrollment

### Certificates
- `GET /api/admin/certificates` - Get all certificates (admin only)
- `GET /api/admin/certificates/:id` - Get a specific certificate by ID (admin only)
- `POST /api/admin/certificates` - Create a new certificate (admin only)
- `PUT /api/admin/certificates/:id` - Update a certificate (admin only)
- `DELETE /api/admin/certificates/:id` - Delete a certificate (admin only)
- `POST /api/admin/certificates/issue` - Issue certificates to users (admin only)
- `GET /api/user/certificates` - Get certificates for a user
- `GET /api/verify-certificate` - Verify a certificate by ID

## State Management

CertifyTrack uses Zustand for state management with the following stores:

### Auth Store
Manages user authentication state, including login status and user details.

### Batch Store
Manages course batch state, including listings, details, and enrollment status.

### Task Store
Manages task state, including listings, details, and completion status.

### Certificate Store
Manages certificate state, including listings, details, and issuance.



3. Set up environment variables (create .env.local file)
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```


```

5. Access the application at http://localhost:3000

## Deployment



## License

This project is licensed under the MIT License - see the LICENSE file for details. 
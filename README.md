# LearnHub | Online Courses

![LearnHub](public/images/mockup.png)

> A comprehensive online learning platform for managing courses, user enrollment, and educational content with role-based access control.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-learnhub--app.vercel.app-blue?style=for-the-badge&logo=vercel)](https://learnhub-app.vercel.app/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](LICENSE.md)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Default Users](#default-users)
- [API Routes](#api-routes)
- [Scripts](#scripts)
- [File Structure](#file-structure)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Description

A Node.js application for managing courses with user authentication and enrollment features, built with Express.js and a database abstraction layer that supports easy ORM switching.

## Features

- JWT-based authentication for APIs
- Role-based access (public, registered, admin)
- Course management (CRUD operations)
- Course enrollment system
- Admin dashboard
- User profiles with profile picture upload
- Database abstraction layer (easy ORM switching)
- Security middleware: helmet, express-rate-limit
- Multi-environment support (MySQL for dev, PostgreSQL for prod)

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL (development), PostgreSQL (production) with Sequelize ORM
- **Architecture**: Database abstraction layer
- **Authentication**: bcrypt, express-session, jsonwebtoken (JWT)
- **Security**: helmet, express-rate-limit
- **View Engine**: EJS
- **Validation**: express-validator
- **Deployment**: Vercel (serverless)

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/dracudev/learnhub-app
   cd learnhub-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   # Development (MySQL)
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_password
   DB_NAME=course_management
   DB_PORT=3306
   SESSION_SECRET=your_secret_key_here
   NODE_ENV=development
   
   # Production (PostgreSQL)
   POSTGRES_URL=your_postgresql_connection_string
   ```

4. **Set up the database**

   ```bash
   # Run migrations to create tables
   npm run migrate
   
   # Seed the database with initial data
   npm run seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

## Default Users

After seeding, you can log in with:

**Admin User:**

- Email: <admin@admin.com>
- Password: admin

**Regular User:**

- Email: <user@user.com>
- Password: user

## API Routes

### Authentication

- `GET /auth/signup` - Sign up form
- `POST /auth/signup` - Create new user
- `GET /auth/login` - Login form
- `POST /auth/login` - Authenticate user
- `POST /auth/logout` - Logout user

### Courses

- `GET /courses` - List all courses
- `GET /courses/:id` - Course details
- `GET /admin/dashboard` - Admin dashboard (admin only)
- `GET /courses/create` - Create course form (admin only)
- `POST /courses/create` - Create new course (admin only)
- `GET /courses/:id/edit` - Edit course form (admin only)
- `POST /courses/:id/edit` - Update course (admin only)
- `POST /courses/:id/delete` - Delete course (admin only)

### User Profile

- `GET /user/profile` - User profile and enrolled courses
- `POST /user/enroll/:courseId` - Enroll in course
- `POST /user/unenroll/:courseId` - Unenroll from course

## Scripts

- `npm start` - Start production server (with deployment script)
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run seed` - Run all seeders
- `npm run neon:setup` - Set up production database (PostgreSQL)
- `npm run build` - Install dependencies

## File Structure

```tree
├── app.js                   # Main application entry point
├── package.json            # Dependencies and scripts
├── vercel.json             # Deployment configuration
├── api/
│   └── index.js            # Serverless function entry
├── database/
│   ├── config/             # Database configuration
│   ├── migrations/         # Database migrations
│   ├── schemas/           # Database schemas
│   └── seeders/           # Sample data
├── public/
│   ├── images/            # Static images
│   └── styles/            # CSS files
└── src/
    ├── server.js          # Express server
    ├── controllers/       # Route handlers
    ├── middleware/        # Custom middleware
    ├── models/           # Database models
    ├── routes/           # Route definitions
    └── views/            # EJS templates
```

## Database Schema

### Users Table

| Column           | Type         | Details                        |
|------------------|--------------|--------------------------------|
| id               | INTEGER      | Primary Key                    |
| name             | STRING       |                                |
| email            | STRING       | Unique                         |
| password         | STRING       | Hashed                         |
| role             | STRING       | public, registered, admin      |
| profile_picture  | STRING       |                                |
| created_at       | DATETIME     |                                |

### Courses Table

| Column       | Type     | Details                |
|--------------|----------|------------------------|
| id           | INTEGER  | Primary Key            |
| title        | STRING   |                        |
| description  | TEXT     |                        |
| category     | STRING   |                        |
| visibility   | STRING   | public, private        |
| created_at   | DATETIME |                        |

### Enrollments Table

| Column          | Type     | Details                          |
|-----------------|----------|----------------------------------|
| id              | INTEGER  | Primary Key                      |
| user_id         | INTEGER  | Foreign Key (Users)              |
| course_id       | INTEGER  | Foreign Key (Courses)            |
| enrollment_date | DATETIME |                                  |
| (user_id, course_id) | UNIQUE   | Composite unique constraint |

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

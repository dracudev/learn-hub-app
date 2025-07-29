# LearnHub | Online Courses

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

- 🔐 User authentication (sign up, login, logout)
- 👥 Role-based access (public, registered, admin)
- 📚 Course management (CRUD operations)
- 📝 Course enrollment system
- 🛠️ Admin dashboard
- 👤 User profiles with profile picture upload
- 🗄️ Database abstraction layer (easy ORM switching)
- 🔑 JWT-based authentication for APIs
- 🛡️ Security middleware: helmet, express-rate-limit

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM (abstracted)
- **Architecture**: Database abstraction layer
- **Authentication**: bcrypt, express-session, jsonwebtoken (JWT)
- **Security**: helmet, express-rate-limit
- **View Engine**: EJS
- **Validation**: express-validator

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
   PORT=4000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_password
   DB_NAME=course_management
   DB_PORT=3306
   SESSION_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

4. **Set up the database**

   ```bash
   # Run migrations to create tables
   npm run db:migrate
   
   # Seed the database with initial data
   npm run db:seed
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
- `GET /administration` - Admin dashboard (admin only)
- `GET /courses/create` - Create course form (admin only)
- `POST /courses` - Create new course (admin only)
- `GET /courses/:id/edit` - Edit course form (admin only)
- `PUT /courses/:id` - Update course (admin only)
- `DELETE /courses/:id` - Delete course (admin only)

### User Profile

- `GET /user/profile` - User profile and enrolled courses
- `POST /user/enroll/:courseId` - Enroll in course
- `POST /user/unenroll/:courseId` - Unenroll from course

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:migrate` - Run database migrations
- `npm run db:migrate:undo` - Undo last migration
- `npm run db:seed` - Run all seeders
- `npm run db:seed:undo` - Undo all seeders
- `npm run db:reset` - Reset database (undo migrations, migrate, seed)
- `npm run production:setup` - Set up production database

## File Structure

```tree
├── app.js
├── package.json
├── .env
├── LICENSE.md
├── README.md
├── database/
│   ├── index.js
│   ├── config/
│   ├── factories/
│   ├── migrations/
│   ├── schemas/
│   └── seeders/
├── public/
│   ├── favicon.ico
│   ├── images/
│   ├── scripts/
│   ├── styles/
│   └── uploads/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── validations/
│   └── views/
│       └── partials/
└── ...
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the tests
5. Submit a pull request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

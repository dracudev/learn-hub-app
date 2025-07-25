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
- [Database Architecture](#database-architecture)
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
- 👤 User profiles
- 🗄️ Database abstraction layer (easy ORM switching)

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM (abstracted)
- **Architecture**: Database abstraction layer
- **Authentication**: bcrypt, express-session
- **View Engine**: EJS
- **Validation**: express-validator

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/dracudev/learn-hub-app
   cd learn-hub-app
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
├── app.js                 # Main application file
├── package.json
├── .env
├── .sequelizerc          # Sequelize configuration
├── database/             # Database Abstraction Layer
│   ├── index.js             # Database adapter (connection manager)
│   ├── config/
│   │   ├── database.js      # Environment configurations
│   │   └── sequelize.js     # Sequelize instance + model creation
│   ├── factories/
│   │   └── SequelizeModelFactory.js  # Schema → Sequelize converter
│   └── schemas/             # ORM-agnostic schema definitions
│       ├── index.js
│       ├── userSchema.js
│       ├── courseSchema.js
│       └── enrollmentSchema.js
├── migrations/
├── seeders/
├── public/              # Static assets
│   ├── images/
│   ├── scripts/
│   └── styles/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/          # (Abstracted)
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Enrollment.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   └── userRoutes.js
│   └── validations/
│       ├── authValidation.js
│       └── courseValidation.js
└── views/               # EJS templates
    ├── partials/
    └── ...
```

## Database Schema

### Users Table

- `id` (Primary Key)
- `name`
- `email` (Unique)
- `password` (Hashed)
- `role` (public, registered, admin)
- `profile_picture`
- `created_at`

### Courses Table

- `id` (Primary Key)
- `title`
- `description`
- `category`
- `visibility` (public, private)
- `created_at`

### Enrollments Table

- `id` (Primary Key)
- `user_id` (Foreign Key)
- `course_id` (Foreign Key)
- `enrollment_date`
- Unique constraint on (user_id, course_id)

## Database Architecture

### **Abstraction Layers:**

1. **📊 Schemas** (`/database/schemas/`): ORM-agnostic data definitions
2. **🏭 Model Factory** (`/database/factories/`): Converts schemas to ORM models  
3. **⚙️ Config Layer** (`/database/config/`): Environment and connection management
4. **🔌 Database Adapter** (`/database/index.js`): Connection abstraction
5. **📦 Models** (`/src/models/`): Clean model exports

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the tests
5. Submit a pull request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

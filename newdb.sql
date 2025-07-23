-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('public', 'registered', 'admin') DEFAULT 'registered',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Courses table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    visibility ENUM('public', 'private') DEFAULT 'public',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Enrollments table
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, course_id)
);
-- Example users (passwords should be replaced with actual bcrypt hashes)
INSERT INTO users (name, email, password, role)
VALUES (
        'Admin',
        'admin@courses.com',
        '$2b$10$EXAMPLEHASHADMIN',
        'admin'
    ),
    (
        'John Smith',
        'john@email.com',
        '$2b$10$EXAMPLEHASHUSER',
        'registered'
    );
-- Example courses
INSERT INTO courses (title, description, category, visibility)
VALUES (
        'JavaScript Course',
        'Learn JS from scratch',
        'Programming',
        'public'
    ),
    (
        'Advanced Node.js Course',
        'Advanced server-side Node.js',
        'Back-end',
        'private'
    );
-- Example enrollment
INSERT INTO enrollments (user_id, course_id)
VALUES (2, 1);
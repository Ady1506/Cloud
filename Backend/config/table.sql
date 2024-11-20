-- Create 'years' table
CREATE TABLE years (
    year_id INT AUTO_INCREMENT PRIMARY KEY,
    year_name VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create 'branches' table
CREATE TABLE branches (
    branch_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create 'subgroups' table
CREATE TABLE subgroups (
    subgroup_id INT AUTO_INCREMENT PRIMARY KEY,
    subgroup_name VARCHAR(255) NOT NULL,
    branch_id INT,
    year_id INT,
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id) ON DELETE SET NULL,
    FOREIGN KEY (year_id) REFERENCES years(year_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create 'students' table
-- CREATE TABLE students (
--     student_id INT AUTO_INCREMENT PRIMARY KEY,
--     student_name VARCHAR(255) NOT NULL,
--     roll_number INT NOT NULL UNIQUE,
--     subgroup_id INT,
--     FOREIGN KEY (subgroup_id) REFERENCES subgroups(subgroup_id) ON DELETE SET NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- Create 'students' table with email and password fields
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    roll_number INT NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    subgroup_id INT,
    FOREIGN KEY (subgroup_id) REFERENCES subgroups(subgroup_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create 'subjects' table
CREATE TABLE subjects (
    subject_code VARCHAR(10) PRIMARY KEY,
    subject_name VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create 'teachers' table
CREATE TABLE teachers (
    teacher_id VARCHAR(10) PRIMARY KEY,
    teacher_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create 'teacher_subjects' table (Many-to-many relationship between teachers and subjects)
CREATE TABLE teacher_subjects (
    teacher_id VARCHAR(10),
    subject_code VARCHAR(10),
    PRIMARY KEY (teacher_id, subject_code),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_code) REFERENCES subjects(subject_code) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create 'teacher_subgroups' table (Many-to-many relationship between teachers and subgroups)
CREATE TABLE teacher_subgroups (
    teacher_id VARCHAR(10),
    subject_code VARCHAR(10),
    subgroup_id INT,
    PRIMARY KEY (teacher_id, subject_code, subgroup_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_code) REFERENCES subjects(subject_code) ON DELETE CASCADE,
    FOREIGN KEY (subgroup_id) REFERENCES subgroups(subgroup_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create 'attendance' table for students
CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    subject_code VARCHAR(10),
    date DATE,
    status ENUM('Present', 'Absent', 'Late') DEFAULT 'Absent',
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_code) REFERENCES subjects(subject_code) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create 'teachers_attendance' table for teachers marking attendance
CREATE TABLE teachers_attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id VARCHAR(10),
    subject_code VARCHAR(10),
    date DATE,
    status ENUM('Present', 'Absent', 'Late') DEFAULT 'Absent',
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_code) REFERENCES subjects(subject_code) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

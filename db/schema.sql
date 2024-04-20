-- Creating the database
CREATE DATABASE IF NOT EXISTS ExaminationReportingDB;

-- Using the created database
USE ExaminationReportingDB;

-- Student table
CREATE TABLE IF NOT EXISTS Student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100)
);

-- Module table
CREATE TABLE IF NOT EXISTS Module (
    module_id INT AUTO_INCREMENT PRIMARY KEY,
    module_name VARCHAR(100)
);

-- Lecturer table
CREATE TABLE IF NOT EXISTS Lecturer (
    lecturer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100)
);

-- Grade table
CREATE TABLE IF NOT EXISTS Grade (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    grade_name VARCHAR(10),
    score_range VARCHAR(10)
);

-- Sample data into the Grade table
INSERT INTO Grade (grade_name) VALUES 
('A'),
('B'),
('C'),
('D'),
('E'),
('F');

-- Update Grade table with score ranges
UPDATE Grade 
SET score_range =
    CASE
        WHEN grade_name = 'A' THEN '90-100'
        WHEN grade_name = 'B' THEN '80-89'
        WHEN grade_name = 'C' THEN '70-79'
        WHEN grade_name = 'D' THEN '60-69'
        WHEN grade_name = 'E' THEN '50-59' 
        ELSE '0-49'  
    END
WHERE grade_id > 0; -- Using the grade_id as a key column


-- Enrollment table (for many-to-many relationship between Student and Module)
CREATE TABLE IF NOT EXISTS Enrollment (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    module_id INT,
    UNIQUE KEY unique_enrollment (student_id, module_id), -- Ensure no duplicate enrollments
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (module_id) REFERENCES Module(module_id)
);


-- Teaching table (for many-to-many relationship between Lecturer and Module)
CREATE TABLE IF NOT EXISTS Teaching (
    teaching_id INT AUTO_INCREMENT PRIMARY KEY,
    lecturer_id INT,
    module_id INT,
    UNIQUE KEY unique_teaching (lecturer_id, module_id), -- Ensure no duplicate teaching assignments
    FOREIGN KEY (lecturer_id) REFERENCES Lecturer(lecturer_id),
    FOREIGN KEY (module_id) REFERENCES Module(module_id)
);


-- GradeAssignment table (for assigning grades to students by lecturers)
CREATE TABLE IF NOT EXISTS GradeAssignment (
    grade_assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    lecturer_id INT,
    student_id INT,
    module_id INT,
    grade_id INT,
    score DECIMAL(5,2), --  the score column
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- timestamp column with default value
    FOREIGN KEY (lecturer_id) REFERENCES Lecturer(lecturer_id),
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (module_id) REFERENCES Module(module_id),
    FOREIGN KEY (grade_id) REFERENCES Grade(grade_id),
    UNIQUE KEY unique_grade_assignment (lecturer_id, student_id, module_id) -- Ensure no duplicate entries
);

-- User table for authentication
CREATE TABLE IF NOT EXISTS `User` (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    password VARBINARY(255), -- Encrypted password
    role ENUM('Administrator', 'Lecturer', 'Student')
);

-- AuditLog table for logging user actions
CREATE TABLE IF NOT EXISTS AuditLog (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- view for GradeAssignmentHistoryView
CREATE VIEW IF NOT EXISTS GradeAssignmentHistoryView AS
SELECT
    ga.grade_assignment_id,
    ga.student_id,
    s.name AS student_name,
    ga.module_id,
    m.module_name,
    ga.grade_id,
    ga.score,
    CASE
        WHEN ga.score >= 90 THEN 'A'
        WHEN ga.score >= 80 THEN 'B'
        WHEN ga.score >= 70 THEN 'C'
        WHEN ga.score >= 60 THEN 'D'
        ELSE 'F'
    END AS grade,
    ga.timestamp
FROM
    GradeAssignment ga
JOIN
    Student s ON ga.student_id = s.student_id
JOIN
    Module m ON ga.module_id = m.module_id
JOIN
    Grade g ON ga.grade_id = g.grade_id;


-- View to display student grades with one grade per module
CREATE VIEW IF NOT EXISTS StudentGradesView AS
SELECT 
    s.name AS student_name, 
    m.module_name, 
    CASE
        WHEN ga.score >= 90 THEN 'A'
        WHEN ga.score >= 80 THEN 'B'
        WHEN ga.score >= 70 THEN 'C'
        WHEN ga.score >= 60 THEN 'D'
        ELSE 'F'
    END AS grade_name,
    ga.score
FROM 
    (SELECT 
        student_id, 
        module_id, 
        MAX(grade_assignment_id) AS latest_grade_assignment_id
     FROM 
        GradeAssignment 
     GROUP BY 
        student_id, module_id) AS latest_grades
JOIN 
    GradeAssignment ga ON latest_grades.student_id = ga.student_id 
                        AND latest_grades.module_id = ga.module_id 
                        AND latest_grades.latest_grade_assignment_id = ga.grade_assignment_id
JOIN 
    Student s ON ga.student_id = s.student_id
JOIN 
    Module m ON ga.module_id = m.module_id;


-- TopPerformingStudentsView: List top-performing students across all modules
CREATE VIEW IF NOT EXISTS TopPerformingStudentsView AS
SELECT 
    s.student_id,
    s.name AS student_name,
    s.email AS student_email,
    AVG(ga.score) AS average_score
FROM 
    Student s
JOIN 
    GradeAssignment ga ON s.student_id = ga.student_id
GROUP BY 
    s.student_id, s.name, s.email
ORDER BY 
    average_score DESC;


-- Stored procedure for assigning grades (with update if grade already exists)
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS AssignGrade (
    IN p_lecturer_id INT,
    IN p_student_id INT,
    IN p_module_id INT,
    IN p_score DECIMAL(5,2)
)
BEGIN
    DECLARE p_grade_id INT; 
    DECLARE existing_assignment_id INT;

    -- Calculate grade based on score
    IF p_score >= 90 THEN
        SET p_grade_id = (SELECT grade_id FROM Grade WHERE grade_name = 'A');
    ELSEIF p_score >= 80 THEN
        SET p_grade_id = (SELECT grade_id FROM Grade WHERE grade_name = 'B');
    ELSEIF p_score >= 70 THEN
        SET p_grade_id = (SELECT grade_id FROM Grade WHERE grade_name = 'C');
    ELSEIF p_score >= 60 THEN
        SET p_grade_id = (SELECT grade_id FROM Grade WHERE grade_name = 'D');
    ELSE
        SET p_grade_id = (SELECT grade_id FROM Grade WHERE grade_name = 'F');
    END IF;

    -- Check if a grade assignment already exists for the specified parameters
    SELECT grade_assignment_id INTO existing_assignment_id
    FROM GradeAssignment
    WHERE lecturer_id = p_lecturer_id
    AND student_id = p_student_id
    AND module_id = p_module_id;

    IF existing_assignment_id IS NOT NULL THEN
        -- If grade assignment already exists, update the grade and score
        UPDATE GradeAssignment
        SET grade_id = p_grade_id,
            score = p_score
        WHERE grade_assignment_id = existing_assignment_id;

        INSERT INTO AuditLog (user_id, action)
        VALUES (p_lecturer_id, CONCAT('Updated grade and score for student ', p_student_id, ' in module ', p_module_id));
    ELSE
        -- If grade assignment doesn't exist, insert a new grade assignment
        INSERT INTO GradeAssignment (lecturer_id, student_id, module_id, grade_id, score)
        VALUES (p_lecturer_id, p_student_id, p_module_id, p_grade_id, p_score);

        INSERT INTO AuditLog (user_id, action)
        VALUES (p_lecturer_id, CONCAT('Assigned grade and score to student ', p_student_id, ' for module ', p_module_id));
    END IF;
END //
DELIMITER ;


-- Stored procedure for retrieving grades by student
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS GetStudentGrades (
    IN p_student_id INT
)
BEGIN
    SELECT 
        m.module_name,
        CASE
            WHEN ga.score >= 90 THEN 'A'
            WHEN ga.score >= 80 THEN 'B'
            WHEN ga.score >= 70 THEN 'C'
            WHEN ga.score >= 60 THEN 'D'
            ELSE 'F'
        END AS grade_name,
        ga.score -- Include the score column
    FROM 
        (SELECT 
            module_id,
            MAX(grade_assignment_id) AS latest_grade_assignment_id
        FROM 
            GradeAssignment
        WHERE 
            student_id = p_student_id
        GROUP BY 
            module_id) AS latest_grades
    JOIN 
        GradeAssignment ga ON latest_grades.module_id = ga.module_id 
                            AND latest_grades.latest_grade_assignment_id = ga.grade_assignment_id
    JOIN 
        Module m ON ga.module_id = m.module_id
    WHERE 
        ga.student_id = p_student_id;
    
    INSERT INTO AuditLog (user_id, action)
    VALUES (p_student_id, CONCAT('Retrieved latest grades'));
END //
DELIMITER ;



-- SAMPLE DATA INSERTION --

-- Sample data into the Student table
INSERT INTO Student (name, email) VALUES 
('Kajal SIngh', 'kajal@singh.com'),
('John Doe', 'john@example.com'),
('Alice Smith', 'alice@example.com');

-- Sample data into the Module table
INSERT INTO Module (module_name) VALUES
('Database System'),
('Data Visualisation'),
('Cyber Security');

-- Sample data into the Lecturer table
INSERT INTO Lecturer (name, email) VALUES 
('Ashley Cahill', 'ashleycahill@tus.com'),
('Mark Daly', 'markdaly@tus.ie'),
('Sharon Gurry', 'sharongurry@tus.ie');

-- Sample data into the Grade table
-- INSERT INTO Grade (grade_name) VALUES 
-- ('A'),
-- ('B'),
-- ('C'),
-- ('D'),
-- ('E'),
-- ('F');

-- Update Grade table with score ranges
-- UPDATE Grade 
-- SET score_range =
--     CASE
--         WHEN grade_name = 'A' THEN '90-100'
--         WHEN grade_name = 'B' THEN '80-89'
--         WHEN grade_name = 'C' THEN '70-79'
--         WHEN grade_name = 'D' THEN '60-69'
--         ELSE '0-59'
--     END
-- WHERE grade_id > 0; -- Using the grade_id as a key column

-- Sample data into the Enrollment table
-- For simplicity, assume each student is enrolled in all modules
INSERT INTO Enrollment (student_id, module_id) 
SELECT student_id, module_id FROM Student, Module;

-- Insert sample data into the Teaching table
-- For simplicity, each lecturer is assigned to a particular module
INSERT INTO Teaching (lecturer_id, module_id) VALUES
-- Assign lecturer Ashley Cahill to Database System module
((SELECT lecturer_id FROM Lecturer WHERE name = 'Ashley Cahill'),
(SELECT module_id FROM Module WHERE module_name = 'Database System')),
-- Assign lecturer Mark Daly to Data Visualization module
((SELECT lecturer_id FROM Lecturer WHERE name = 'Mark Daly'),
(SELECT module_id FROM Module WHERE module_name = 'Data Visualization')),
-- Assign lecturer Sharon Gurry to Cyber Security module
((SELECT lecturer_id FROM Lecturer WHERE name = 'Sharon Gurry'),
(SELECT module_id FROM Module WHERE module_name = 'Cyber Security'));

-- Insert sample data into the GradeAssignment table
-- For simplicity, assume each student receives a random grade and score for each module
INSERT INTO GradeAssignment (lecturer_id, student_id, module_id, grade_id, score) 
SELECT 
    (SELECT lecturer_id FROM Lecturer ORDER BY RAND() LIMIT 1),
    s.student_id,
    m.module_id,
    (SELECT grade_id FROM Grade ORDER BY RAND() LIMIT 1),
    ROUND(RAND() * 100, 2) -- Generate a random score between 0 and 100
FROM 
    Student s
JOIN
    Module m;

-- Insert sample data into the User table
-- For simplicity, assume each student and lecturer has a user account with the same username as their email    
INSERT INTO User (username, password, role)
SELECT username, 'password', 
    CASE 
        WHEN EXISTS (SELECT * FROM Student WHERE email = Emails.username) THEN 'Student'
        WHEN EXISTS (SELECT * FROM Lecturer WHERE email = Emails.username) THEN 'Lecturer'
        ELSE 'Administrator'
    END
FROM 
    (SELECT email AS username FROM Student UNION SELECT email AS username FROM Lecturer) AS Emails;

-- Inserting an admin user
INSERT INTO User (username, password, role)
VALUES ('admin@example.com', 'admin_password', 'Administrator');

-- Display a message indicating the sample data has been inserted
SELECT 'Sample data inserted into all tables successfully' AS Message;

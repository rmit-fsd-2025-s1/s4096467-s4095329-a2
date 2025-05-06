DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS languages;
DROP TABLE IF EXISTS previous_roles;
DROP TABLE IF EXISTS certifications;
DROP TABLE IF EXISTS educations;
DROP TABLE IF EXISTS tutors;
DROP TABLE IF EXISTS class_roles;
DROP TABLE IF EXISTS lecturer_classes;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS availability;

CREATE TABLE roles(
    role_name VARCHAR(9) PRIMARY KEY NOT NULL
);

CREATE TABLE availability(
    available_time VARCHAR(9) PRIMARY KEY NOT NULL
);

INSERT INTO roles (role_name)
VALUES
('candidate'),
('lecturer'),
('admin');

INSERT INTO  availability (available_time)
VALUES
('none'),
('weekdays'),
('full-time'),
('part-time'),
('casual');

CREATE TABLE users(
    email VARCHAR(320) PRIMARY KEY NOT NULL,
    full_name VARCHAR(1000),
    password CHAR(60),
    role VARCHAR(9) NOT NULL,
    availability VARCHAR(9) NOT NULL DEFAULT 'none',
    summary TEXT,
    date_of_joining DATE NOT NULL DEFAULT (CURRENT_DATE()),
    active BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (availability) REFERENCES availability(available_time),
    FOREIGN KEY (role) REFERENCES roles(role_name)
);

CREATE TABLE classes(
    class_code VARCHAR(255) PRIMARY KEY NOT NULL,
    subject_name VARCHAR(1000)
);

CREATE TABLE class_roles(
    role_name VARCHAR(12) PRIMARY KEY NOT NULL
);

CREATE TABLE tutors(
    email VARCHAR(320) NOT NULL,
    class_code VARCHAR(255) NOT NULL,
    role_name VARCHAR(12),
    accepted BIT,
    PRIMARY KEY (email, class_code),
    FOREIGN KEY (role_name) REFERENCES class_roles(role_name),
    FOREIGN KEY (email) REFERENCES users(email)
);

CREATE TABLE lecturer_classes(
    email VARCHAR(320) NOT NULL,
    class_code VARCHAR(255) NOT NULL,
    PRIMARY KEY (email, class_code),
    FOREIGN KEY (email) REFERENCES users(email),
    FOREIGN KEY (class_code) REFERENCES classes(class_code)
);

CREATE TABLE skills(
    skill_key INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_key VARCHAR(320) NOT NULL,
    skill TEXT NOT NULL,
    FOREIGN KEY (user_key) REFERENCES users(email)    
);

CREATE TABLE languages(
    language_key INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_key VARCHAR(320) NOT NULL,
    language TEXT NOT NULL,
    FOREIGN KEY (user_key) REFERENCES users(email)    
);

CREATE TABLE previous_roles(
    role_key INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_key VARCHAR(320) NOT NULL,
    prev_role TEXT NOT NULL,
    FOREIGN KEY (user_key) REFERENCES users(email)    
);

CREATE TABLE certifications(
    certification_key INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_key VARCHAR(320) NOT NULL,
    certification TEXT NOT NULL,
    FOREIGN KEY (user_key) REFERENCES users(email)    
);

CREATE TABLE educations(
    education_key INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_key VARCHAR(320) NOT NULL,
    education TEXT NOT NULL,
    FOREIGN KEY (user_key) REFERENCES users(email)    
);
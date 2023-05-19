DROP DATABASE IF EXISTS `overseas-travel`;

CREATE DATABASE IF NOT EXISTS `overseas-travel`;

USE `overseas-travel`;

CREATE TABLE IF NOT EXISTS countries (
    countryCode CHAR(3) NOT NULL,
    countryName VARCHAR(64) NOT NULL,
    aciCountry ENUM('Yes', 'No') NOT NULL,
    PRIMARY KEY (countryCode)
);

CREATE TABLE IF NOT EXISTS pemGroup (
    pemGroup CHAR(6) NOT NULL,
    pemName VARCHAR(64),
    PRIMARY KEY (pemGroup)
);

CREATE TABLE IF NOT EXISTS course (
    courseCode CHAR(3) NOT NULL,
    courseName VARCHAR(64) NOT NULL,
    courseManager VARCHAR(64),
    PRIMARY KEY (courseCode)
);

CREATE TABLE IF NOT EXISTS students (
    adminNo CHAR(7) NOT NULL,
    name VARCHAR(64) NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL,
    citizenshipStatus ENUM('Singapore citizen', 'Permanent resident', 'Foreigner') NOT NULL,
    course CHAR(3),
    stage TINYINT,
    pemGroup CHAR(6),
    PRIMARY KEY (adminNo)
);

CREATE TABLE IF NOT EXISTS overseasPrograms (
    programID CHAR(6) NOT NULL,
    programName VARCHAR(64) NOT NULL,
    -- programType ENUM('OET', 'OITP', 'OIMP') NOT NULL,
    programType ENUM('OSEP', 'OET', 'OIMP', 'OITP', 'Other'),
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    countryCode CHAR(3) NOT NULL,
    city VARCHAR(64) NOT NULL,
    organization VARCHAR(64) NOT NULL,
    organizationType ENUM('Company', 'Institution', 'Others') NOT NULL,
    gsmCode VARCHAR(10),
    gsmName VARCHAR(64),
    PRIMARY KEY (programID)
);


CREATE TABLE IF NOT EXISTS trips (
    studentAdminNo CHAR(7) NOT NULL,
    programID CHAR(6) NOT NULL,
    comments TEXT,
    PRIMARY KEY (studentAdminNo, programID),
    FOREIGN KEY (studentAdminNo) REFERENCES students(adminNo),
    FOREIGN KEY (programID) REFERENCES overseasPrograms(programID)
);

CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(64) NOT NULL,
    password VARCHAR(64) NOT NULL,
    accountType ENUM('Admin', 'Teacher', 'Guest') NOT NULL,
    name VARCHAR(64),
    PRIMARY KEY (username)
);

-- VIEWS IN ACCORDANCE TO MOE KPI's
-- (DEFINITION): ACI country refers to a country that is in ASEAN, CHINA, HONG KONG, TAIWAN, or INDIA

-- 1. Count the number of unique students who have gone for overseas programs 
-- edit: based on enrolment status (?)
CREATE VIEW KPI1 AS
SELECT COUNT(DISTINCT studentAdminNo) AS 'Number of unique students who have gone for overseas programs'
FROM trips;

-- 2. Same as 1 except the overseas countries have to be in an ACI country
CREATE VIEW KPI2 AS
SELECT COUNT(DISTINCT studentAdminNo) AS 'Number of unique students who have gone for overseas programs in ACI countries'
FROM trips
INNER JOIN overseasPrograms ON trips.programID = overseasPrograms.programID
INNER JOIN countries ON overseasPrograms.countryCode = countries.countryCode
WHERE countries.aciCountry = 'Yes';

-- 3. Count the number of unique students who have done OITP in ACI countries
CREATE VIEW KPI3 AS
SELECT COUNT(DISTINCT studentAdminNo) AS 'Number of unique students who have done OITP in ACI countries'
FROM trips
INNER JOIN overseasPrograms ON trips.programID = overseasPrograms.programID
INNER JOIN countries ON overseasPrograms.countryCode = countries.countryCode
WHERE countries.aciCountry = 'Yes' AND overseasPrograms.programType = 'OITP';

-- Sample data for pemGroup table
INSERT INTO pemGroup (pemGroup, pemName) VALUES
('MI2001', 'Ching Bee'),
('MI2002', 'Murthy'),
('MI2003', 'Raizal');

-- Sample data for course table
INSERT INTO course (courseCode, courseName, courseManager) VALUES
('C23', 'Computer Science', 'Ching Bee'),
('C34', 'English Literature', 'Murthy'),
('C13', 'Biology', 'Raizal');

-- Sample data for students table
INSERT INTO students (adminNo, name, gender, citizenshipStatus, course, stage, pemGroup) VALUES
('123555A', 'John Smith', 'Male', 'Singapore citizen', 'C23', 1, 'MI2001'),
('623463B', 'Jane Doe', 'Female', 'Permanent resident', 'C34', 2, 'MI2002'),
('827384C', 'Bob Johnson', 'Male', 'Foreigner', 'C13', 3, 'MI2003');

-- Sample data for overseasPrograms table
INSERT INTO overseasPrograms (programID, programName, programType, startDate, endDate, countryCode, organization, organizationType) VALUES
('OP001', 'Summer Internship', 'OITP', '2023-06-01', '2023-08-31', 'USA', 'Google', 'Company'),
('OP002', 'Semester Exchange', 'OITP', '2024-01-01', '2024-05-31', 'AUS', 'University of Melbourne', 'Institution'),
('OP003', 'Cultural Immersion', 'OITP', '2022-09-01', '2022-12-15', 'JPN', 'Japan Foundation', 'Others');

-- Sample data for trips table
INSERT INTO trips (studentAdminNo, programID, comments) VALUES
('123555A', 'OP001', 'Excited to start my summer internship at Google!'),
('623463B', 'OP002', 'Looking forward to studying at University of Melbourne'),
('827384C', 'OP003', 'Can''t wait to experience Japanese culture!');
 
-- Sample data for users table
INSERT INTO users (username, password, accountType, name) VALUES
('admin', 'adminpass', 'Admin', 'John Admin'),
('teacher1', 'teacher1pass', 'Teacher', 'Jane Teacher'),
('guest1', 'guest1pass', 'Guest', 'Bob Guest');

/*
countries
    countryCode char(3) not null
    countryName varchar(64) not null 
    aciCountry enum ('Yes', 'No') not null
    primary key (countryCode)

pemGroup
    pemGroup char(6) not null
    pemName varchar(64)
    primary key (pemGroup)

course
    courseCode char(3) not null
    courseName varchar(64) not null
    courseManager varchar(64)
    primary key (courseCode)

students
    adminNo char(7) not null
    name varchar(64) not null
    gender enum ('Male', 'Female') not null
    citizenshipStatus enum ('Singapore citizen', 'Permanent resident', 'Foreigner') not null
    course char(3)
    stage tinyint
    pemGroup char(6)
    primary key (adminNo)

overseasPrograms
    programID char(6) not null
    programName varchar(64) not null
    programType enum ('OET', 'OITP', 'OIMP') not null
    startDate date not null
    endDate date not null
    countryCode char(3) not null
    city varchar(64) not null
    organization varchar(64) not null
    organizationType enum ('Company', 'Institution', 'Others') not null
    primary key (programID)

trips
    studentAdminNo char(7) not null
    programID char(6) not null
    comments text
    primary key (studentAdminNo, programID)

users
    username varchar(64) not null
    password varchar(64) not null
    accountType enum ('Admin', 'Teacher', 'Guest') not null
    name varchar(64)
    primary key (username)
*/

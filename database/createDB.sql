-- Create Database
CREATE DATABASE IF NOT EXISTS JoyOfPainting;

-- Use the JoyOfPainting Database
USE JoyOfPainting;

-- Create Episode Table
CREATE TABLE IF NOT EXISTS Episodes (
    episode_id INT AUTO_INCREMENT PRIMARY KEY,
    episode_num VARCHAR(50),
    episode_title VARCHAR(255),
    season INT,
    episode INT,
    month VARCHAR(50)
);

-- Create Colors Table
CREATE TABLE IF NOT EXISTS Colors (
    color_id INT AUTO_INCREMENT PRIMARY KEY,
    color_name VARCHAR(255)
);

-- Create EpiColors Table
CREATE TABLE IF NOT EXISTS EpiColors (
    episode_color_id INT AUTO_INCREMENT PRIMARY KEY,
    episode_id INT,
    color_id INT,
    FOREIGN KEY (episode_id) REFERENCES Episodes(episode_id),
    FOREIGN KEY (color_id) REFERENCES Colors(color_id)
);

-- Create Subjects Table
CREATE TABLE IF NOT EXISTS Subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(255)
);

-- Create Episode Subject Table
CREATE TABLE IF NOT EXISTS Episubject (
    episode_subject_id INT AUTO_INCREMENT PRIMARY KEY,
    episode_id INT,
    subject_id INT,
    FOREIGN KEY (episode_id) REFERENCES Episodes(episode_id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id)
);
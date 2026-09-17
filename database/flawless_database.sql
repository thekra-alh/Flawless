-- ============================================
-- Flawless Database Schema
-- Based on the approved ER Diagram (Figure 3.18, GP2)
-- ============================================

CREATE DATABASE IF NOT EXISTS flawless_db;
USE flawless_db;

-- 1. USER
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. SKINSURVEY
CREATE TABLE SkinSurvey (
    survey_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skin_concern VARCHAR(100),
    water_intake VARCHAR(50),
    sunscreen_usage VARCHAR(50),
    sleep_quality VARCHAR(50),
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
        ON DELETE CASCADE
);

-- 3. FACIALIMAGE
CREATE TABLE FacialImage (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    validation_status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
        ON DELETE CASCADE
);

-- 4. ANALYSISRESULT
CREATE TABLE AnalysisResult (
    analysis_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_id INT NOT NULL,
    survey_id INT NOT NULL,
    skin_type VARCHAR(50),
    acne_severity VARCHAR(50),
    skin_score INT,
    analysis_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES FacialImage(image_id)
        ON DELETE CASCADE,
    FOREIGN KEY (survey_id) REFERENCES SkinSurvey(survey_id)
        ON DELETE CASCADE
);

-- 5. RECOMMENDATION
CREATE TABLE Recommendation (
    recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
    analysis_id INT NOT NULL,
    morning_routine TEXT,
    night_routine TEXT,
    ingredients TEXT,
    warnings TEXT,
    FOREIGN KEY (analysis_id) REFERENCES AnalysisResult(analysis_id)
        ON DELETE CASCADE
);

-- 6. HISTORY
CREATE TABLE History (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    analysis_id INT NOT NULL,
    record_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (analysis_id) REFERENCES AnalysisResult(analysis_id)
        ON DELETE CASCADE
);

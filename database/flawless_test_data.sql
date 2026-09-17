-- ============================================
-- Flawless Test Data (Dummy Data)
-- Use this to verify the 6 tables are linked correctly
-- ============================================

USE flawless_db;

-- 1. Insert a test user
INSERT INTO User (full_name, email, password_hash)
VALUES ('Test User', 'test@example.com', 'hashed_password_123');

-- 2. Insert a survey for that user (user_id = 1)
INSERT INTO SkinSurvey (user_id, skin_concern, water_intake, sunscreen_usage, sleep_quality)
VALUES (1, 'Acne', 'Medium', 'Daily', 'Good');

-- 3. Insert a facial image for that user
INSERT INTO FacialImage (user_id, image_path, validation_status)
VALUES (1, '/uploads/test_image.jpg', 'Valid');

-- 4. Insert an analysis result linking user, image, and survey (all = 1)
INSERT INTO AnalysisResult (user_id, image_id, survey_id, skin_type, acne_severity, skin_score)
VALUES (1, 1, 1, 'Oily', 'Mild', 78);

-- 5. Insert a recommendation linked to that analysis (analysis_id = 1)
INSERT INTO Recommendation (analysis_id, morning_routine, night_routine, ingredients)
VALUES (1, 'Cleanser + Moisturizer + SPF', 'Cleanser + Treatment + Moisturizer', 'Niacinamide, Salicylic Acid');

-- 6. Insert a history record linking user and analysis
INSERT INTO History (user_id, analysis_id)
VALUES (1, 1);

-- ============================================
-- Verify: this should return 1 full row joining all tables
-- ============================================
SELECT
    u.full_name, u.email,
    s.skin_concern,
    f.image_path,
    a.skin_type, a.acne_severity, a.skin_score,
    r.morning_routine,
    h.record_date
FROM User u
JOIN SkinSurvey s ON u.user_id = s.user_id
JOIN FacialImage f ON u.user_id = f.user_id
JOIN AnalysisResult a ON u.user_id = a.user_id
JOIN Recommendation r ON a.analysis_id = r.analysis_id
JOIN History h ON a.analysis_id = h.analysis_id;

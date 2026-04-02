CREATE TABLE user_job_preferences(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    level1_category_id INT NOT NULL,
    level2_category_id INT NULL,
    level3_category_id INT NULL,
    raw_target_text VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_jop_preferences_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_ob_preferences_level1
        FOREIGN KEY (level1_category_id) REFERENCES job_categories(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_user_ob_preferences_level2
        FOREIGN KEY (level2_category_id) REFERENCES job_categories(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_user_ob_preferences_level3 
        FOREIGN KEY (level3_category_id) REFERENCES job_categories(id)
        ON DELETE RESTRICT
);
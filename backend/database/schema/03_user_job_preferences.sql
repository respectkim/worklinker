CREATE TABLE user_job_preferences(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_category_id INT NOT NULL,
    preference_rank TINYINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_selected_jobs_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_selected_jobs_category
        FOREIGN KEY (job_category_id) REFERENCES job_categories(id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_user_job UNIQUE (user_id, job_category_id),
    CONSTRAINT uq_user_rank UNIQUE (user_id, preference_rank)
);
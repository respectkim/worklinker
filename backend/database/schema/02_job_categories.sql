CREATE TABLE job_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT NULL,
    level_num TINYINT NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    category_code VARCHAR(50) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_categories_parent
        FOREIGN KEY (parent_id) REFERENCES job_categories(id)
        ON DELETE CASCADE
);
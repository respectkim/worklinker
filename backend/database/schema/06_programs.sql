CREATE TABLE programs (
    id  INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NULL,
    title VARCHAR(255) NOT NULL,
    institution VARCHAR(255),
    region VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    category VARCHAR(100),
    cost VARCHAR(100),
    is_free BOOLEAN DEFAULT FALSE,
    support_type VARCHAR(100),
    start_date DATE,
    end_date DATE,
    ml_keywords TEXT,
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_programs_category
        FOREIGN KEY (category_id) REFERENCES job_categories(id)
        ON DELETE SET NULL
);
CREATE TABLE success_posts(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    job VARCHAR(100) NOT NULL,
    period VARCHAR(50),
    summary TEXT,
    content TEXT NOT NULL,
    views INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_success_posts_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_success_posts_categori
        FOREIGN KEY (category_id) REFERENCES job_categories(id)
        ON DELETE SET NULL
    
);
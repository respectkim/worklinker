CREATE TABLE success_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_success_comments_post
        FOREIGN KEY (post_id) REFERENCES success_posts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_success_comments_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);
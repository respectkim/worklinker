CREATE TABLE schedules(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    program_id INT NULL,
    title VARCHAR(255) NOT NULL,
    schedules_date DATE NOT NULL,
    memo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedules_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_schedules_program
        FOREIGN KEY (program_id) REFERENCES programs(id)
        ON DELETE SET NULL
);
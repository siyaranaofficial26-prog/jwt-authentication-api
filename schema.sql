CREATE DATABASE auth_app;
USE auth_app;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO users (email, password)
VALUES
('myfirstemail@example.com', 'password1'),
('mysecondemail@example.com', 'password2');
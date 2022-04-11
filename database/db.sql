USE formation_express;

CREATE TABLE IF NOT EXISTS users(
    id INT UNSIGNED AUTO_INCREMENT,
    user_name VARCHAR(30) NOT NULL,
    user_firstName VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    hashed_password VARCHAR(128) NOT NULL,
    photo VARCHAR(80),
    bio TEXT
    PRIMARY KEY (id)
);
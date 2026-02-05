CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       business_name VARCHAR(255),
                       role VARCHAR(50),
                       created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE stalls (
                        id SERIAL PRIMARY KEY,
                        stall_code VARCHAR(10) UNIQUE NOT NULL,
                        size VARCHAR(10),
                        is_reserved BOOLEAN DEFAULT FALSE,
                        x_position INT,
                        y_position INT
);

CREATE TABLE reservations (
                              id SERIAL PRIMARY KEY,
                              user_id INT UNIQUE REFERENCES users(id),
                              reservation_date TIMESTAMP DEFAULT NOW(),
                              qr_code_path VARCHAR(255)
);

CREATE TABLE reservation_stalls (
                                    reservation_id INT REFERENCES reservations(id),
                                    stall_id INT REFERENCES stalls(id),
                                    PRIMARY KEY (reservation_id, stall_id)
);

CREATE TABLE genres (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255) UNIQUE
);

CREATE TABLE user_genres (
                             user_id INT REFERENCES users(id),
                             genre_id INT REFERENCES genres(id),
                             PRIMARY KEY (user_id, genre_id)
);

CREATE TABLE events (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(100) NOT NULL,
                        year INT NOT NULL,
                        status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, ENDED
                        start_date DATE,
                        end_date DATE,
                        created_at TIMESTAMP DEFAULT NOW(),
                        UNIQUE (name, year)
);

ALTER TABLE reservations
DROP CONSTRAINT IF EXISTS reservations_user_id_key;

ALTER TABLE reservations
    ADD COLUMN event_id INT,
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED';

ALTER TABLE reservations
    ALTER COLUMN event_id SET NOT NULL;

ALTER TABLE reservations
    ADD CONSTRAINT fk_reservations_event
        FOREIGN KEY (event_id) REFERENCES events(id);

ALTER TABLE stalls
DROP COLUMN IF EXISTS is_reserved;

CREATE TABLE reservation_genres (
                        reservation_id INT REFERENCES reservations(id) ON DELETE CASCADE,
                        genre_id INT REFERENCES genres(id),
                        PRIMARY KEY (reservation_id, genre_id)
);

DROP TABLE IF EXISTS user_genres;

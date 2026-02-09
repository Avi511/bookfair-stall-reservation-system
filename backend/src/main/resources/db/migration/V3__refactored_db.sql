-- Needed for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- 1) USERS: role constraints + business_name rule
ALTER TABLE users
    ALTER COLUMN role SET NOT NULL;

ALTER TABLE users
    ADD CONSTRAINT chk_users_role
        CHECK (role IN ('USER', 'EMPLOYEE'));

ALTER TABLE users
    ADD CONSTRAINT chk_users_business_name_by_role
        CHECK (
            (role = 'USER' AND business_name IS NOT NULL)
                OR
            (role = 'EMPLOYEE' AND business_name IS NULL)
            );


-- 2) EVENTS: unique (name, year), status must be valid
ALTER TABLE events
    ALTER COLUMN name SET NOT NULL;

ALTER TABLE events
    ALTER COLUMN year SET NOT NULL;

ALTER TABLE events
    ALTER COLUMN status SET NOT NULL;

ALTER TABLE events
    ADD CONSTRAINT uq_events_name_year UNIQUE (name, year);

ALTER TABLE events
    ADD CONSTRAINT chk_events_status
        CHECK (status IN ('DRAFT', 'ACTIVE', 'INACTIVE', 'ENDED'));


-- 3) STALLS: stall_code unique + size valid + positions
ALTER TABLE stalls
    ALTER COLUMN stall_code SET NOT NULL;

ALTER TABLE stalls
    ADD CONSTRAINT uq_stalls_stall_code UNIQUE (stall_code);

ALTER TABLE stalls
    ALTER COLUMN size SET NOT NULL;

ALTER TABLE stalls
    ADD CONSTRAINT chk_stalls_size
        CHECK (size IN ('SMALL', 'MEDIUM', 'LARGE'));

-- If every stall must be placed on map (recommended)
ALTER TABLE stalls
    ALTER COLUMN x_position SET NOT NULL;

ALTER TABLE stalls
    ALTER COLUMN y_position SET NOT NULL;


-- 4) RESERVATIONS: enforce event_id + status + qr_token
ALTER TABLE reservations
    ALTER COLUMN event_id SET NOT NULL;

ALTER TABLE reservations
    ALTER COLUMN user_id SET NOT NULL;

-- Add status (if not already present in V2)
ALTER TABLE reservations
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED';

ALTER TABLE reservations
    ADD CONSTRAINT chk_reservations_status
        CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED'));

-- Replace old qr_code_path with token-based UUID
ALTER TABLE reservations
DROP COLUMN IF EXISTS qr_code_path;

ALTER TABLE reservations
    ADD COLUMN IF NOT EXISTS qr_token UUID NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS uq_reservations_qr_token
    ON reservations(qr_token);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_reservations_user_event
    ON reservations(user_id, event_id);

CREATE INDEX IF NOT EXISTS idx_reservations_event_status
    ON reservations(event_id, status);


-- 5) RESERVATION_STALLS: prevent double booking per event

-- Add event_id to join table (required to enforce per-event uniqueness)
ALTER TABLE reservation_stalls
    ADD COLUMN IF NOT EXISTS event_id INT NOT NULL;

-- FK to events
ALTER TABLE reservation_stalls
    ADD CONSTRAINT fk_res_stalls_event
        FOREIGN KEY (event_id) REFERENCES events(id);

-- Ensure a stall can be reserved only once per event
CREATE UNIQUE INDEX IF NOT EXISTS uq_event_stall_once
    ON reservation_stalls(event_id, stall_id);

-- Helpful indexes for map queries
CREATE INDEX IF NOT EXISTS idx_res_stalls_event
    ON reservation_stalls(event_id);

CREATE INDEX IF NOT EXISTS idx_res_stalls_stall
    ON reservation_stalls(stall_id);

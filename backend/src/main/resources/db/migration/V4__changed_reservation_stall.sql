ALTER TABLE reservation_stalls
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;

DROP INDEX IF EXISTS uq_event_stall_once;

CREATE UNIQUE INDEX uq_event_stall_active
    ON reservation_stalls(event_id, stall_id)
    WHERE active = TRUE;
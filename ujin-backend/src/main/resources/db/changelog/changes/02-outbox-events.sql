--liquibase formatted sql
--changeset fiwka:02-outbox-events

create table outbox_events (
    id bigserial primary key,
    event_type text not null,
    aggregate_type text not null,
    aggregate_id text not null,
    destination text not null,
    payload text not null,
    status text not null,
    attempts integer not null default 0,
    next_attempt_at timestamp not null,
    processed_at timestamp,
    last_error text,
    created_at timestamp not null,
    updated_at timestamp not null
);

create index idx_outbox_events_pending
    on outbox_events (status, next_attempt_at, created_at);

--liquibase formatted sql
--changeset fiwka:01-initial

create table templates (
    id bigserial primary key,
    name text not null,
    scroll_time bigint not null,
    main_block_image text,
    main_block_content text,
    main_block_title text,
    block1_content text,
    block2_content text,
    block1_title text,
    block2_title text,
    contact1_name text,
    contact1_phone text,
    contact2_name text,
    contact2_phone text,
    contact3_name text,
    contact3_phone text,
    contact4_name text,
    contact4_phone text
);

create table screens (
    id bigserial primary key,
    name text not null,
    template_id bigint not null references templates(id) on delete cascade,
    building bigint not null,
    complex bigint not null,
    chs boolean not null default false,
    chs_text text
);

create table news (
    id bigserial primary key,
    news_id bigint not null,
    expires_at timestamp not null,
    title text not null,
    content text not null,
    published_at timestamp not null,
    image text
);
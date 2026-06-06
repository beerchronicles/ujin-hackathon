--liquibase formatted sql
--changeset fiwka:03-news-location-and-nullable-expiration

alter table news
    alter column expires_at drop not null,
    add column complex bigint,
    add column building bigint;

update news
set complex = 0,
    building = 0
where complex is null
   or building is null;

alter table news
    alter column complex set not null,
    alter column building set not null;

create unique index uq_news_external_location
    on news (news_id, complex, building);

create index idx_news_location_active
    on news (complex, building, expires_at);

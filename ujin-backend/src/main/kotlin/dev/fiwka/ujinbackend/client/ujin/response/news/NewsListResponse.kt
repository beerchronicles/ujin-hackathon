package dev.fiwka.ujinbackend.client.ujin.response.news

import dev.fiwka.ujinbackend.client.ujin.response.pagination.PaginationMeta

data class NewsListResponse(
    val items: List<NewsItem>,
    val meta: PaginationMeta
)

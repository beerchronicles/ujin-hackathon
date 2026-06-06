package dev.fiwka.ujinbackend.client.ujin.response.news

import tools.jackson.databind.PropertyNamingStrategies
import tools.jackson.databind.annotation.JsonNaming

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy::class)
data class NewsItem(
    val id: Long,
    val title: String,
    val date: String? = null,
    val text: String? = null,
    val image: String? = null,
    val expiresAt: String? = null,
    val buildings: List<NewsBuilding> = emptyList()
)

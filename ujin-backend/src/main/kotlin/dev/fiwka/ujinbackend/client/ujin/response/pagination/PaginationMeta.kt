package dev.fiwka.ujinbackend.client.ujin.response.pagination

import tools.jackson.databind.PropertyNamingStrategies
import tools.jackson.databind.annotation.JsonNaming

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy::class)
data class PaginationMeta(
    val currentPage: Int,
    val from: Int,
    val lastPage: Int
)

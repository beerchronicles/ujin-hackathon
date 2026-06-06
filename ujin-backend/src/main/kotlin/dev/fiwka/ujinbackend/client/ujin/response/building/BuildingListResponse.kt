package dev.fiwka.ujinbackend.client.ujin.response.building

import dev.fiwka.ujinbackend.client.ujin.response.pagination.PaginationMeta

data class BuildingListResponse(
    val buildings: List<BuildingItem>,
    val meta: PaginationMeta? = null
)

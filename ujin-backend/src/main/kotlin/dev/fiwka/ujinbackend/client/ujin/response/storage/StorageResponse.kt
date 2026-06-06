package dev.fiwka.ujinbackend.client.ujin.response.storage

import tools.jackson.databind.PropertyNamingStrategies
import tools.jackson.databind.annotation.JsonNaming

data class StorageResponse(
    val items: List<StorageComplex> = emptyList()
)

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy::class)
data class StorageComplex(
    val complexId: Long? = null,
    val complexTitle: String? = null,
    val buildings: List<StorageBuilding> = emptyList()
)

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy::class)
data class StorageBuilding(
    val buildingId: Long? = null,
    val buildingTitle: String? = null,
    val rooms: List<StorageRoom> = emptyList()
)

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy::class)
data class StorageRoom(
    val id: String? = null,
    val assignmentType: String? = null,
    val status: String? = null
)

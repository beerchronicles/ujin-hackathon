package dev.fiwka.ujinbackend.client.ujin.response.parking

import tools.jackson.databind.PropertyNamingStrategies
import tools.jackson.databind.annotation.JsonNaming

data class ParkingResponse(
    val items: List<ParkingComplex> = emptyList()
)

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy::class)
data class ParkingComplex(
    val complexId: Long? = null,
    val complexTitle: String? = null,
    val buildings: List<ParkingBuilding> = emptyList()
)

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy::class)
data class ParkingBuilding(
    val buildingId: Long? = null,
    val buildingTitle: String? = null,
    val zones: List<ParkingZone> = emptyList()
)

data class ParkingZone(
    val id: String? = null,
    val name: String? = null,
    val spots: List<ParkingSpot> = emptyList()
)

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy::class)
data class ParkingSpot(
    val id: String? = null,
    val assignmentType: String? = null,
    val status: String? = null
)

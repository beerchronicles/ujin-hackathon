package dev.fiwka.ujinbackend.client.ujin.response.building

data class BuildingItem(
    val id: Long,
    val complex: BuildingComplex,
    val building: BuildingDetails
)

package dev.fiwka.ujinbackend.model.response

import dev.fiwka.ujinbackend.client.ujin.response.building.BuildingItem

data class BuildingResponse(
    val id: Long,
    val title: String?,
    val complexId: Long,
    val complexTitle: String?,
    val timezone: String?
) {
    companion object {
        fun from(building: BuildingItem) = BuildingResponse(
            id = building.building.id,
            title = building.building.title,
            complexId = building.complex.id,
            complexTitle = building.complex.title,
            timezone = building.complex.timezone
        )
    }
}

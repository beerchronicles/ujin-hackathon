package dev.fiwka.ujinbackend.service.location

import dev.fiwka.ujinbackend.model.response.BuildingResponse
import dev.fiwka.ujinbackend.model.response.ComplexResponse

interface LocationService {

    fun getAllComplexes(): List<ComplexResponse>

    fun getAllBuildings(complexId: Long? = null): List<BuildingResponse>
}

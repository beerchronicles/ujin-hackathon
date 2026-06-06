package dev.fiwka.ujinbackend.controller

import dev.fiwka.ujinbackend.model.response.BuildingResponse
import dev.fiwka.ujinbackend.model.response.ComplexResponse
import dev.fiwka.ujinbackend.service.location.LocationService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class LocationController(
    private val locationService: LocationService
) {

    @GetMapping("/complexes")
    fun getAllComplexes(): List<ComplexResponse> =
        locationService.getAllComplexes()

    @GetMapping("/buildings")
    fun getAllBuildings(@RequestParam(required = false) complexId: Long?): List<BuildingResponse> =
        locationService.getAllBuildings(complexId)
}

package dev.fiwka.ujinbackend.controller

import dev.fiwka.ujinbackend.model.response.DisplayAvailabilityResponse
import dev.fiwka.ujinbackend.service.display.DisplayAvailabilityService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/display")
class DisplayController(
    private val displayAvailabilityService: DisplayAvailabilityService
) {

    @GetMapping("/screens/{screenId}/availability")
    fun getAvailability(@PathVariable screenId: Long): DisplayAvailabilityResponse =
        displayAvailabilityService.getAvailability(screenId)
}

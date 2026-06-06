package dev.fiwka.ujinbackend.controller

import dev.fiwka.ujinbackend.model.response.DisplayAvailabilityResponse
import dev.fiwka.ujinbackend.model.response.ScreenResponse
import dev.fiwka.ujinbackend.service.display.DisplayAvailabilityService
import dev.fiwka.ujinbackend.service.screen.ScreenService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/display")
class DisplayController(
    private val displayAvailabilityService: DisplayAvailabilityService,
    private val screenService: ScreenService
) {

    @GetMapping("/screens/{screenId}/availability")
    fun getAvailability(@PathVariable screenId: Long): DisplayAvailabilityResponse =
        displayAvailabilityService.getAvailability(screenId)

    @GetMapping("/screens/{screenId}")
    fun getScreen(@PathVariable screenId: Long): ScreenResponse =
        screenService.getById(screenId)
}

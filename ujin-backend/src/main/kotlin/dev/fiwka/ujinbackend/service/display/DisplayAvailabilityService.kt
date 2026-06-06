package dev.fiwka.ujinbackend.service.display

import dev.fiwka.ujinbackend.model.response.DisplayAvailabilityResponse

interface DisplayAvailabilityService {

    fun getAvailability(screenId: Long): DisplayAvailabilityResponse
}

package dev.fiwka.ujinbackend.service.display

import dev.fiwka.ujinbackend.client.ujin.UjinClient
import dev.fiwka.ujinbackend.client.ujin.response.parking.ParkingResponse
import dev.fiwka.ujinbackend.client.ujin.response.storage.StorageResponse
import dev.fiwka.ujinbackend.exception.ScreenNotFoundException
import dev.fiwka.ujinbackend.exception.UjinApiException
import dev.fiwka.ujinbackend.model.response.DisplayAvailabilityResponse
import dev.fiwka.ujinbackend.properties.UjinProperties
import dev.fiwka.ujinbackend.repository.ScreenRepository
import dev.fiwka.ujinbackend.util.Qualifiers
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DisplayAvailabilityServiceImpl(
    @Qualifier(Qualifiers.SYNC_CLIENT)
    private val ujinClient: UjinClient,
    private val screenRepository: ScreenRepository,
    private val ujinProperties: UjinProperties
) : DisplayAvailabilityService {

    @Transactional(readOnly = true)
    override fun getAvailability(screenId: Long): DisplayAvailabilityResponse {
        val screen = screenRepository.findByIdOrNull(screenId) ?: throw ScreenNotFoundException(screenId)
        val token = ujinProperties.syncToken?.takeIf(String::isNotBlank)
            ?: throw UjinApiException("UJIN_SYNC_TOKEN is not configured")
        val complexes = listOf(screen.complex)
        val buildings = listOf(screen.building)

        val parking = ujinClient.getFreeParking(
            token = token,
            complexes = complexes,
            buildings = buildings
        )
        if (parking.error != UJIN_SUCCESS_CODE) {
            throw UjinApiException("Free parking request failed: ${parking.message}")
        }

        val storage = ujinClient.getFreeStorage(
            token = token,
            complexes = complexes,
            buildings = buildings
        )
        if (storage.error != UJIN_SUCCESS_CODE) {
            throw UjinApiException("Free storage request failed: ${storage.message}")
        }

        return DisplayAvailabilityResponse(
            freeStorages = storage.data.countRooms(),
            freeParkings = parking.data.countSpots()
        )
    }

    private fun ParkingResponse.countSpots(): Int =
        items.sumOf { complex ->
            complex.buildings.sumOf { building ->
                building.zones.sumOf { zone -> zone.spots.size }
            }
        }

    private fun StorageResponse.countRooms(): Int =
        items.sumOf { complex ->
            complex.buildings.sumOf { building -> building.rooms.size }
        }

    companion object {
        private const val UJIN_SUCCESS_CODE = 0
    }
}

package dev.fiwka.ujinbackend.service.location

import dev.fiwka.ujinbackend.client.ujin.UjinClient
import dev.fiwka.ujinbackend.client.ujin.response.pagination.PaginationMeta
import dev.fiwka.ujinbackend.exception.UjinApiException
import dev.fiwka.ujinbackend.model.response.BuildingResponse
import dev.fiwka.ujinbackend.model.response.ComplexResponse
import dev.fiwka.ujinbackend.util.Qualifiers
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service

@Service
class LocationServiceImpl(
    @Qualifier(Qualifiers.AUTHENTICATED_CLIENT) private val ujinClient: UjinClient
) : LocationService {

    override fun getAllComplexes(): List<ComplexResponse> {
        val complexes = mutableListOf<ComplexResponse>()
        var page = 1
        var lastPage: Int

        do {
            val response = ujinClient.getComplexList(page = page)
            if (response.error != UJIN_SUCCESS_CODE) {
                throw UjinApiException(response.message)
            }

            complexes += response.data.items.map(ComplexResponse::from)
            lastPage = response.data.meta.lastPage
            page++
        } while (page <= lastPage)

        return complexes
    }

    override fun getAllBuildings(complexId: Long?): List<BuildingResponse> {
        val buildings = mutableListOf<BuildingResponse>()
        var page = 1
        var lastPage: Int

        do {
            val response = ujinClient.getBuildingList(
                complexId = complexId,
                page = page,
                perPage = BUILDINGS_PER_PAGE
            )
            if (response.error != UJIN_SUCCESS_CODE) {
                throw UjinApiException(response.message)
            }

            buildings += response.data.buildings.map(BuildingResponse::from)
            lastPage = response.data.meta.lastPageOrCurrent(page)
            page++
        } while (page <= lastPage)

        return buildings
    }

    private fun PaginationMeta?.lastPageOrCurrent(currentPage: Int): Int =
        this?.lastPage ?: currentPage

    private companion object {
        private const val UJIN_SUCCESS_CODE = 0
        private const val BUILDINGS_PER_PAGE = 100
    }
}

package dev.fiwka.ujinbackend.client.ujin

import dev.fiwka.ujinbackend.client.ujin.response.UjinResponse
import dev.fiwka.ujinbackend.client.ujin.response.building.BuildingListResponse
import dev.fiwka.ujinbackend.client.ujin.response.complex.ComplexListResponse
import dev.fiwka.ujinbackend.client.ujin.response.news.NewsListResponse
import dev.fiwka.ujinbackend.client.ujin.response.parking.ParkingResponse
import dev.fiwka.ujinbackend.client.ujin.response.storage.StorageResponse
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.service.annotation.GetExchange

interface UjinClient {

    // used for token testing
    @GetExchange("/v1/complex/list")
    fun getComplexList(
        @RequestParam("page") page: Int? = null,
        @RequestParam("token") token: String? = null
    ): UjinResponse<ComplexListResponse>

    @GetExchange("/v1/buildings/get-list-crm")
    fun getBuildingList(
        @RequestParam("complex_id") complexId: Long? = null,
        @RequestParam("page") page: Int? = null,
        @RequestParam("per_page") perPage: Int? = null
    ): UjinResponse<BuildingListResponse>

    @GetExchange("/v1/news/list")
    fun getNewsList(
        @RequestParam("page") page: Int? = null,
        @RequestParam("type") type: String? = null
    ): UjinResponse<NewsListResponse>

    @GetExchange("/api/v1/parking/free")
    fun getFreeParking(
        @RequestParam("token") token: String? = null,
        @RequestParam("complexes[]") complexes: List<Long>? = null,
        @RequestParam("buildings[]") buildings: List<Long>? = null
    ): UjinResponse<ParkingResponse>

    @GetExchange("/api/v1/storage/free")
    fun getFreeStorage(
        @RequestParam("token") token: String? = null,
        @RequestParam("complexes[]") complexes: List<Long>? = null,
        @RequestParam("buildings[]") buildings: List<Long>? = null
    ): UjinResponse<StorageResponse>
}

package dev.fiwka.ujinbackend.service.screen

import dev.fiwka.ujinbackend.model.request.ScreenRequest
import dev.fiwka.ujinbackend.model.response.ScreenResponse

interface ScreenService {

    fun getAll(): List<ScreenResponse>

    fun getById(id: Long): ScreenResponse

    fun create(request: ScreenRequest): ScreenResponse

    fun update(id: Long, request: ScreenRequest): ScreenResponse

    fun delete(id: Long)
}

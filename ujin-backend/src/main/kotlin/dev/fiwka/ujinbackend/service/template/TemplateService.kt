package dev.fiwka.ujinbackend.service.template

import dev.fiwka.ujinbackend.model.filter.TemplateFilter
import dev.fiwka.ujinbackend.model.request.TemplateRequest
import dev.fiwka.ujinbackend.model.response.TemplateResponse
import org.springframework.web.multipart.MultipartFile

interface TemplateService {

    fun getAll(filter: TemplateFilter = TemplateFilter()): List<TemplateResponse>

    fun getById(id: Long): TemplateResponse

    fun create(request: TemplateRequest): TemplateResponse

    fun update(id: Long, request: TemplateRequest): TemplateResponse

    fun delete(id: Long)

    fun uploadMainBlockImage(id: Long, image: MultipartFile): TemplateResponse

    fun deleteMainBlockImage(id: Long): TemplateResponse
}

package dev.fiwka.ujinbackend.controller

import dev.fiwka.ujinbackend.model.request.TemplateRequest
import dev.fiwka.ujinbackend.model.response.TemplateResponse
import dev.fiwka.ujinbackend.service.template.TemplateService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/templates")
class TemplateController(
    private val templateService: TemplateService
) {

    @GetMapping
    fun getAll(): List<TemplateResponse> =
        templateService.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): TemplateResponse =
        templateService.getById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody request: TemplateRequest): TemplateResponse =
        templateService.create(request)

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody request: TemplateRequest
    ): TemplateResponse =
        templateService.update(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) {
        templateService.delete(id)
    }

    @PostMapping("/{id}/main-block-image")
    fun uploadMainBlockImage(
        @PathVariable id: Long,
        @RequestParam image: MultipartFile
    ): TemplateResponse =
        templateService.uploadMainBlockImage(id, image)

    @DeleteMapping("/{id}/main-block-image")
    fun deleteMainBlockImage(@PathVariable id: Long): TemplateResponse =
        templateService.deleteMainBlockImage(id)
}

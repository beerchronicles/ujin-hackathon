package dev.fiwka.ujinbackend.controller

import dev.fiwka.ujinbackend.model.request.ScreenRequest
import dev.fiwka.ujinbackend.model.response.ScreenResponse
import dev.fiwka.ujinbackend.service.screen.ScreenService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/screens")
class ScreenController(
    private val screenService: ScreenService
) {

    @GetMapping
    fun getAll(): List<ScreenResponse> =
        screenService.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ScreenResponse =
        screenService.getById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody request: ScreenRequest): ScreenResponse =
        screenService.create(request)

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody request: ScreenRequest
    ): ScreenResponse =
        screenService.update(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) {
        screenService.delete(id)
    }
}

package dev.fiwka.ujinbackend.model.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Positive

data class ScreenRequest(
    @field:NotBlank
    val name: String,
    @field:Positive
    val templateId: Long,
    @field:Positive
    val complex: Long,
    @field:Positive
    val building: Long,
    val chs: Boolean = false,
    val chsText: String? = null
)

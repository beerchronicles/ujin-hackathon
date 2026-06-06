package dev.fiwka.ujinbackend.model.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.PositiveOrZero

data class TemplateRequest(
    @field:NotBlank
    val name: String,
    @field:PositiveOrZero
    val scrollTime: Long,
    val mainBlockContent: String? = null,
    val mainBlockTitle: String? = null,
    val block1Content: String? = null,
    val block2Content: String? = null,
    val block1Title: String? = null,
    val block2Title: String? = null,
    val contact1Name: String? = null,
    val contact1Phone: String? = null,
    val contact2Name: String? = null,
    val contact2Phone: String? = null,
    val contact3Name: String? = null,
    val contact3Phone: String? = null,
    val contact4Name: String? = null,
    val contact4Phone: String? = null
)

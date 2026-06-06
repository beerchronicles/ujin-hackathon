package dev.fiwka.ujinbackend.model.filter

data class ScreenFilter(
    val name: String? = null,
    val templateId: Long? = null,
    val complex: Long? = null,
    val building: Long? = null,
    val chs: Boolean? = null,
    val chsText: String? = null
)

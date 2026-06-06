package dev.fiwka.ujinbackend.model.response

import dev.fiwka.ujinbackend.entity.Screen

data class ScreenResponse(
    val id: Long,
    val name: String,
    val templateId: Long,
    val building: Long,
    val complex: Long,
    val chs: Boolean,
    val chsText: String?
) {
    companion object {
        fun from(screen: Screen) = ScreenResponse(
            id = requireNotNull(screen.id),
            name = screen.name,
            templateId = requireNotNull(screen.template.id),
            building = screen.building,
            complex = screen.complex,
            chs = screen.chs,
            chsText = screen.chsText
        )
    }
}

package dev.fiwka.ujinbackend.util

object ScreenWebSocketDestinations {

    fun events(screenId: Long): String = "/topic/screens/$screenId/events"
}

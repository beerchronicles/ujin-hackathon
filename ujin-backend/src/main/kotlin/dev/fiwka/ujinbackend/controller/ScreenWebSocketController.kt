package dev.fiwka.ujinbackend.controller

import dev.fiwka.ujinbackend.model.outbox.ScreenNotification
import dev.fiwka.ujinbackend.service.screen.ScreenConnectionService
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.simp.annotation.SubscribeMapping
import org.springframework.stereotype.Controller

@Controller
class ScreenWebSocketController(
    private val screenConnectionService: ScreenConnectionService
) {

    @SubscribeMapping("/screens/{screenId}/events")
    fun subscribe(@DestinationVariable screenId: Long): List<ScreenNotification> =
        screenConnectionService.getCurrentEvents(screenId)

    @SubscribeMapping("/screens/{screenId}/news")
    fun subscribeNews(@DestinationVariable screenId: Long): ScreenNotification =
        screenConnectionService.getCurrentNewsEvent(screenId)
}

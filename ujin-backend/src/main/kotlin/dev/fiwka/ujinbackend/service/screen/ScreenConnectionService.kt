package dev.fiwka.ujinbackend.service.screen

import dev.fiwka.ujinbackend.model.outbox.ScreenNotification

interface ScreenConnectionService {

    fun getCurrentEvents(screenId: Long): List<ScreenNotification>

    fun getCurrentTemplateEvent(screenId: Long): ScreenNotification

    fun getCurrentNewsEvent(screenId: Long): ScreenNotification
}

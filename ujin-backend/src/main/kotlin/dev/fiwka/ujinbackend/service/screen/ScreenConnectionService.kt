package dev.fiwka.ujinbackend.service.screen

import dev.fiwka.ujinbackend.model.outbox.ScreenNotification

interface ScreenConnectionService {

    fun getCurrentTemplateEvent(screenId: Long): ScreenNotification
}

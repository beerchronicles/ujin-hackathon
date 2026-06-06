package dev.fiwka.ujinbackend.service.outbox

import dev.fiwka.ujinbackend.model.outbox.OutboxEventRequest

interface OutboxService {

    fun enqueue(request: OutboxEventRequest): Long
}

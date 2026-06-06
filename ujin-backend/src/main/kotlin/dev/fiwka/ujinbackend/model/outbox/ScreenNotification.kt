package dev.fiwka.ujinbackend.model.outbox

import tools.jackson.databind.JsonNode
import java.time.Instant

data class ScreenNotification(
    val eventId: Long?,
    val eventType: String,
    val aggregateType: String,
    val aggregateId: String,
    val payload: JsonNode,
    val createdAt: Instant
)

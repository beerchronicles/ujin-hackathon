package dev.fiwka.ujinbackend.model.outbox

data class OutboxEventRequest(
    val eventType: String,
    val aggregateType: String,
    val aggregateId: String,
    val destination: String,
    val payload: Any = emptyMap<String, Any>()
)

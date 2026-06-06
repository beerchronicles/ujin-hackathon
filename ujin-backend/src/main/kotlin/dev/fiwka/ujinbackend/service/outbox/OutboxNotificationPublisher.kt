package dev.fiwka.ujinbackend.service.outbox

import dev.fiwka.ujinbackend.entity.OutboxEvent
import dev.fiwka.ujinbackend.model.outbox.ScreenNotification
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import tools.jackson.databind.ObjectMapper

@Component
class OutboxNotificationPublisher(
    private val messagingTemplate: SimpMessagingTemplate,
    private val objectMapper: ObjectMapper
) {

    fun publish(event: OutboxEvent) {
        messagingTemplate.convertAndSend(
            event.destination,
            ScreenNotification(
                eventId = requireNotNull(event.id),
                eventType = event.eventType,
                aggregateType = event.aggregateType,
                aggregateId = event.aggregateId,
                payload = objectMapper.readTree(event.payload),
                createdAt = event.createdAt
            )
        )
    }
}

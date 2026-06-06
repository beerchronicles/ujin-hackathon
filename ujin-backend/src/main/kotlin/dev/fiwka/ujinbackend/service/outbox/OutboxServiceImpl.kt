package dev.fiwka.ujinbackend.service.outbox

import dev.fiwka.ujinbackend.entity.OutboxEvent
import dev.fiwka.ujinbackend.model.outbox.OutboxEventRequest
import dev.fiwka.ujinbackend.repository.OutboxEventRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import tools.jackson.databind.ObjectMapper

@Service
class OutboxServiceImpl(
    private val outboxEventRepository: OutboxEventRepository,
    private val objectMapper: ObjectMapper
) : OutboxService {

    @Transactional
    override fun enqueue(request: OutboxEventRequest): Long {
        val event = outboxEventRepository.save(
            OutboxEvent(
                eventType = request.eventType,
                aggregateType = request.aggregateType,
                aggregateId = request.aggregateId,
                destination = request.destination,
                payload = objectMapper.writeValueAsString(request.payload)
            )
        )

        return requireNotNull(event.id)
    }
}

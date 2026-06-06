package dev.fiwka.ujinbackend.service.outbox

import dev.fiwka.ujinbackend.entity.OutboxEvent
import dev.fiwka.ujinbackend.entity.OutboxEventStatus
import dev.fiwka.ujinbackend.repository.OutboxEventRepository
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.Duration
import java.time.Instant

@Component
class OutboxScheduler(
    private val outboxEventRepository: OutboxEventRepository,
    private val outboxNotificationPublisher: OutboxNotificationPublisher
) {

    @Scheduled(fixedDelayString = "\${outbox.scheduler.fixed-delay:1000}")
    @Transactional
    fun publishPendingEvents() {
        outboxEventRepository
            .findTop50ByStatusAndNextAttemptAtLessThanEqualOrderByCreatedAtAsc(
                status = OutboxEventStatus.PENDING,
                nextAttemptAt = Instant.now()
            )
            .forEach(::publish)
    }

    private fun publish(event: OutboxEvent) {
        try {
            outboxNotificationPublisher.publish(event)
            event.status = OutboxEventStatus.SENT
            event.processedAt = Instant.now()
            event.lastError = null
        } catch (exception: Exception) {
            event.attempts += 1
            event.lastError = exception.message
            event.nextAttemptAt = Instant.now().plus(backoff(event.attempts))

            if (event.attempts >= MAX_ATTEMPTS) {
                event.status = OutboxEventStatus.FAILED
            }

            log.warn(exception) { "Failed to publish outbox event ${event.id}" }
        }
    }

    private fun backoff(attempts: Int): Duration =
        Duration.ofSeconds((attempts * attempts).coerceAtMost(MAX_BACKOFF_SECONDS).toLong())

    companion object {
        private const val MAX_ATTEMPTS = 10
        private const val MAX_BACKOFF_SECONDS = 60
        private val log = KotlinLogging.logger { }
    }
}

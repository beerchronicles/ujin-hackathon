package dev.fiwka.ujinbackend.service.news

import dev.fiwka.ujinbackend.model.outbox.OutboxEventRequest
import dev.fiwka.ujinbackend.model.response.NewsResponse
import dev.fiwka.ujinbackend.repository.NewsRepository
import dev.fiwka.ujinbackend.repository.ScreenRepository
import dev.fiwka.ujinbackend.service.outbox.OutboxService
import dev.fiwka.ujinbackend.util.ScreenEventTypes
import dev.fiwka.ujinbackend.util.ScreenWebSocketDestinations
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
class NewsNotificationServiceImpl(
    private val screenRepository: ScreenRepository,
    private val newsRepository: NewsRepository,
    private val outboxService: OutboxService
) : NewsNotificationService {

    @Transactional
    override fun notifyLocation(complex: Long, building: Long) {
        val payload = newsRepository.findActiveByLocation(complex, building, Instant.now())
            .map(NewsResponse::from)

        screenRepository.findAllByComplexAndBuilding(complex, building).forEach { screen ->
            outboxService.enqueue(
                OutboxEventRequest(
                    eventType = ScreenEventTypes.NEWS_UPDATED,
                    aggregateType = ScreenEventTypes.NEWS_AGGREGATE,
                    aggregateId = "$complex:$building",
                    destination = ScreenWebSocketDestinations.events(requireNotNull(screen.id)),
                    payload = payload
                )
            )
        }
    }
}

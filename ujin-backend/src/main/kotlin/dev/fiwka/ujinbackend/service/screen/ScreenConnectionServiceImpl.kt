package dev.fiwka.ujinbackend.service.screen

import dev.fiwka.ujinbackend.exception.ScreenNotFoundException
import dev.fiwka.ujinbackend.model.outbox.ScreenNotification
import dev.fiwka.ujinbackend.model.response.NewsResponse
import dev.fiwka.ujinbackend.model.response.TemplateResponse
import dev.fiwka.ujinbackend.repository.NewsRepository
import dev.fiwka.ujinbackend.repository.ScreenRepository
import dev.fiwka.ujinbackend.util.ScreenEventTypes
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import tools.jackson.databind.ObjectMapper
import java.time.Instant

@Service
class ScreenConnectionServiceImpl(
    private val screenRepository: ScreenRepository,
    private val newsRepository: NewsRepository,
    private val objectMapper: ObjectMapper
) : ScreenConnectionService {

    @Transactional(readOnly = true)
    override fun getCurrentEvents(screenId: Long): List<ScreenNotification> {
        val screen = screenRepository.findByIdOrNull(screenId) ?: throw ScreenNotFoundException(screenId)

        return listOf(
            buildCurrentTemplateEvent(screen),
            buildCurrentNewsEvent(screen)
        )
    }

    @Transactional(readOnly = true)
    override fun getCurrentTemplateEvent(screenId: Long): ScreenNotification {
        val screen = screenRepository.findByIdOrNull(screenId) ?: throw ScreenNotFoundException(screenId)
        return buildCurrentTemplateEvent(screen)
    }

    @Transactional(readOnly = true)
    override fun getCurrentNewsEvent(screenId: Long): ScreenNotification {
        val screen = screenRepository.findByIdOrNull(screenId) ?: throw ScreenNotFoundException(screenId)
        return buildCurrentNewsEvent(screen)
    }

    private fun buildCurrentTemplateEvent(screen: dev.fiwka.ujinbackend.entity.Screen): ScreenNotification {
        val template = TemplateResponse.from(screen.template)

        return ScreenNotification(
            eventId = null,
            eventType = ScreenEventTypes.TEMPLATE_CURRENT,
            aggregateType = ScreenEventTypes.TEMPLATE_AGGREGATE,
            aggregateId = template.id.toString(),
            payload = objectMapper.valueToTree(template),
            createdAt = Instant.now()
        )
    }

    private fun buildCurrentNewsEvent(screen: dev.fiwka.ujinbackend.entity.Screen): ScreenNotification {
        val news = newsRepository.findActiveByLocation(screen.complex, screen.building, Instant.now())
            .map(NewsResponse::from)

        return ScreenNotification(
            eventId = null,
            eventType = ScreenEventTypes.NEWS_UPDATED,
            aggregateType = ScreenEventTypes.NEWS_AGGREGATE,
            aggregateId = "${screen.complex}:${screen.building}",
            payload = objectMapper.valueToTree(news),
            createdAt = Instant.now()
        )
    }
}

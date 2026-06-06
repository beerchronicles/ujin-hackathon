package dev.fiwka.ujinbackend.service.screen

import dev.fiwka.ujinbackend.exception.ScreenNotFoundException
import dev.fiwka.ujinbackend.model.outbox.ScreenNotification
import dev.fiwka.ujinbackend.model.response.TemplateResponse
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
    private val objectMapper: ObjectMapper
) : ScreenConnectionService {

    @Transactional(readOnly = true)
    override fun getCurrentTemplateEvent(screenId: Long): ScreenNotification {
        val screen = screenRepository.findByIdOrNull(screenId) ?: throw ScreenNotFoundException(screenId)
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
}

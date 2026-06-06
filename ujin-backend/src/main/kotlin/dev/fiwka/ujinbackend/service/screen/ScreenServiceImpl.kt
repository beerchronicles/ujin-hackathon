package dev.fiwka.ujinbackend.service.screen

import dev.fiwka.ujinbackend.client.ujin.UjinClient
import dev.fiwka.ujinbackend.entity.Screen
import dev.fiwka.ujinbackend.entity.Template
import dev.fiwka.ujinbackend.exception.InvalidScreenLocationException
import dev.fiwka.ujinbackend.exception.ScreenNotFoundException
import dev.fiwka.ujinbackend.exception.TemplateNotFoundException
import dev.fiwka.ujinbackend.model.filter.ScreenFilter
import dev.fiwka.ujinbackend.model.request.ScreenRequest
import dev.fiwka.ujinbackend.model.outbox.OutboxEventRequest
import dev.fiwka.ujinbackend.model.response.ScreenResponse
import dev.fiwka.ujinbackend.model.response.TemplateResponse
import dev.fiwka.ujinbackend.repository.ScreenRepository
import dev.fiwka.ujinbackend.repository.TemplateRepository
import dev.fiwka.ujinbackend.repository.specification.ScreenSpecifications
import dev.fiwka.ujinbackend.service.outbox.OutboxService
import dev.fiwka.ujinbackend.util.Qualifiers
import dev.fiwka.ujinbackend.util.ScreenEventTypes
import dev.fiwka.ujinbackend.util.ScreenWebSocketDestinations
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ScreenServiceImpl(
    private val screenRepository: ScreenRepository,
    private val templateRepository: TemplateRepository,
    private val outboxService: OutboxService,
    @Qualifier(Qualifiers.AUTHENTICATED_CLIENT)
    private val ujinClient: UjinClient
) : ScreenService {

    @Transactional(readOnly = true)
    override fun getAll(filter: ScreenFilter): List<ScreenResponse> =
        screenRepository.findAll(ScreenSpecifications.byFilter(filter)).map(ScreenResponse::from)

    @Transactional(readOnly = true)
    override fun getById(id: Long): ScreenResponse =
        ScreenResponse.from(getScreen(id))

    @Transactional
    override fun create(request: ScreenRequest): ScreenResponse {
        val template = getTemplate(request.templateId)
        validateLocation(request.complex, request.building)
        return ScreenResponse.from(screenRepository.save(request.toEntity(template)))
    }

    @Transactional
    override fun update(id: Long, request: ScreenRequest): ScreenResponse {
        val screen = getScreen(id)
        val template = getTemplate(request.templateId)

        validateLocation(request.complex, request.building)
        screen.applyRequest(request, template)
        enqueueCurrentTemplate(screen, template)

        return ScreenResponse.from(screen)
    }

    @Transactional
    override fun emergencyReset(id: Long): ScreenResponse {
        val screen = getScreen(id)

        screen.chs = false
        screen.chsText = null
        enqueueCurrentTemplate(screen, screen.template)

        return ScreenResponse.from(screen)
    }

    @Transactional
    override fun delete(id: Long) {
        screenRepository.delete(getScreen(id))
    }

    private fun validateLocation(complexId: Long, buildingId: Long) {
        val complexResponse = ujinClient.getComplexList()
        if (complexResponse.error != UJIN_SUCCESS_CODE) {
            throw InvalidScreenLocationException(complexResponse.message)
        }

        val complexExists = complexResponse.data.items.any { it.id == complexId }
        if (!complexExists) {
            throw InvalidScreenLocationException("Complex '$complexId' does not exist or is unavailable")
        }

        val buildingResponse = ujinClient.getBuildingList(
            complexId = complexId,
            perPage = BUILDINGS_PER_PAGE
        )
        if (buildingResponse.error != UJIN_SUCCESS_CODE) {
            throw InvalidScreenLocationException(buildingResponse.message)
        }

        val buildingExistsInComplex = buildingResponse.data.buildings.any {
            it.complex.id == complexId && (it.id == buildingId || it.building.id == buildingId)
        }

        if (!buildingExistsInComplex) {
            throw InvalidScreenLocationException("Building '$buildingId' does not belong to complex '$complexId'")
        }
    }

    private fun getScreen(id: Long): Screen =
        screenRepository.findByIdOrNull(id) ?: throw ScreenNotFoundException(id)

    private fun getTemplate(id: Long): Template =
        templateRepository.findByIdOrNull(id) ?: throw TemplateNotFoundException(id)

    private fun ScreenRequest.toEntity(template: Template) = Screen(
        name = name,
        template = template,
        building = building,
        complex = complex,
        chs = chs,
        chsText = chsText
    )

    private fun Screen.applyRequest(request: ScreenRequest, template: Template) {
        name = request.name
        this.template = template
        building = request.building
        complex = request.complex
        chs = request.chs
        chsText = request.chsText
    }

    private fun enqueueCurrentTemplate(screen: Screen, template: Template) {
        outboxService.enqueue(
            OutboxEventRequest(
                eventType = ScreenEventTypes.TEMPLATE_CURRENT,
                aggregateType = ScreenEventTypes.TEMPLATE_AGGREGATE,
                aggregateId = requireNotNull(template.id).toString(),
                destination = ScreenWebSocketDestinations.events(requireNotNull(screen.id)),
                payload = TemplateResponse.from(template)
            )
        )
    }

    companion object {
        private const val UJIN_SUCCESS_CODE = 0
        private const val BUILDINGS_PER_PAGE = 1000
    }
}

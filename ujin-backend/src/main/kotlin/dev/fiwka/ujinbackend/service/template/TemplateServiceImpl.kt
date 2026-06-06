package dev.fiwka.ujinbackend.service.template

import dev.fiwka.ujinbackend.adapter.minio.MinioAdapter
import dev.fiwka.ujinbackend.entity.Template
import dev.fiwka.ujinbackend.exception.InvalidTemplateImageException
import dev.fiwka.ujinbackend.exception.TemplateNotFoundException
import dev.fiwka.ujinbackend.model.filter.TemplateFilter
import dev.fiwka.ujinbackend.model.request.TemplateRequest
import dev.fiwka.ujinbackend.model.outbox.OutboxEventRequest
import dev.fiwka.ujinbackend.model.response.TemplateResponse
import dev.fiwka.ujinbackend.repository.ScreenRepository
import dev.fiwka.ujinbackend.repository.TemplateRepository
import dev.fiwka.ujinbackend.repository.specification.TemplateSpecifications
import dev.fiwka.ujinbackend.service.outbox.OutboxService
import dev.fiwka.ujinbackend.util.ScreenEventTypes
import dev.fiwka.ujinbackend.util.ScreenWebSocketDestinations
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile

@Service
class TemplateServiceImpl(
    private val templateRepository: TemplateRepository,
    private val screenRepository: ScreenRepository,
    private val outboxService: OutboxService,
    private val minioAdapter: MinioAdapter
) : TemplateService {

    @Transactional(readOnly = true)
    override fun getAll(filter: TemplateFilter): List<TemplateResponse> =
        templateRepository.findAll(TemplateSpecifications.byFilter(filter)).map(TemplateResponse::from)

    @Transactional(readOnly = true)
    override fun getById(id: Long): TemplateResponse =
        TemplateResponse.from(getTemplate(id))

    @Transactional
    override fun create(request: TemplateRequest): TemplateResponse =
        TemplateResponse.from(templateRepository.save(request.toEntity()))

    @Transactional
    override fun update(id: Long, request: TemplateRequest): TemplateResponse {
        val template = getTemplate(id)
        template.applyRequest(request)
        val response = TemplateResponse.from(template)

        enqueueTemplateUpdated(template, response)

        return response
    }

    @Transactional
    override fun delete(id: Long) {
        val template = getTemplate(id)
        enqueueTemplateDeleted(template)
        template.mainBlockImage?.let(minioAdapter::deleteImage)
        templateRepository.delete(template)
    }

    @Transactional
    override fun uploadMainBlockImage(id: Long, image: MultipartFile): TemplateResponse {
        validateImage(image)

        val template = getTemplate(id)
        val previousImage = template.mainBlockImage
        val stored = minioAdapter.uploadImage(image.inputStream, image.contentType)

        template.mainBlockImage = stored.id
        previousImage?.let(minioAdapter::deleteImage)

        val response = TemplateResponse.from(template)
        enqueueTemplateUpdated(template, response)

        return response
    }

    @Transactional
    override fun deleteMainBlockImage(id: Long): TemplateResponse {
        val template = getTemplate(id)
        template.mainBlockImage?.let(minioAdapter::deleteImage)
        template.mainBlockImage = null

        val response = TemplateResponse.from(template)
        enqueueTemplateUpdated(template, response)

        return response
    }

    private fun getTemplate(id: Long): Template =
        templateRepository.findByIdOrNull(id) ?: throw TemplateNotFoundException(id)

    private fun enqueueTemplateUpdated(template: Template, response: TemplateResponse) {
        screenRepository.findAllByTemplate(template).forEach { screen ->
            outboxService.enqueue(
                OutboxEventRequest(
                    eventType = TEMPLATE_UPDATED_EVENT,
                    aggregateType = ScreenEventTypes.TEMPLATE_AGGREGATE,
                    aggregateId = response.id.toString(),
                    destination = ScreenWebSocketDestinations.events(requireNotNull(screen.id)),
                    payload = response
                )
            )
        }
    }

    private fun enqueueTemplateDeleted(template: Template) {
        val templateId = requireNotNull(template.id)
        screenRepository.findAllByTemplate(template).forEach { screen ->
            outboxService.enqueue(
                OutboxEventRequest(
                    eventType = TEMPLATE_DELETED_EVENT,
                    aggregateType = ScreenEventTypes.TEMPLATE_AGGREGATE,
                    aggregateId = templateId.toString(),
                    destination = ScreenWebSocketDestinations.events(requireNotNull(screen.id)),
                    payload = mapOf("templateId" to templateId)
                )
            )
        }
    }

    private fun validateImage(image: MultipartFile) {
        if (image.isEmpty) {
            throw InvalidTemplateImageException("Template image must not be empty")
        }
        if (image.contentType?.startsWith("image/") != true) {
            throw InvalidTemplateImageException("Template image must have image content type")
        }
    }

    private fun TemplateRequest.toEntity() = Template(
        name = name,
        scrollTime = scrollTime,
        mainBlockContent = mainBlockContent,
        mainBlockTitle = mainBlockTitle,
        block1Content = block1Content,
        block2Content = block2Content,
        block1Title = block1Title,
        block2Title = block2Title,
        contact1Name = contact1Name,
        contact1Phone = contact1Phone,
        contact2Name = contact2Name,
        contact2Phone = contact2Phone,
        contact3Name = contact3Name,
        contact3Phone = contact3Phone,
        contact4Name = contact4Name,
        contact4Phone = contact4Phone
    )

    private fun Template.applyRequest(request: TemplateRequest) {
        name = request.name
        scrollTime = request.scrollTime
        mainBlockContent = request.mainBlockContent
        mainBlockTitle = request.mainBlockTitle
        block1Content = request.block1Content
        block2Content = request.block2Content
        block1Title = request.block1Title
        block2Title = request.block2Title
        contact1Name = request.contact1Name
        contact1Phone = request.contact1Phone
        contact2Name = request.contact2Name
        contact2Phone = request.contact2Phone
        contact3Name = request.contact3Name
        contact3Phone = request.contact3Phone
        contact4Name = request.contact4Name
        contact4Phone = request.contact4Phone
    }

    companion object {
        private const val TEMPLATE_UPDATED_EVENT = ScreenEventTypes.TEMPLATE_UPDATED
        private const val TEMPLATE_DELETED_EVENT = ScreenEventTypes.TEMPLATE_DELETED
    }
}

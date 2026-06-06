package dev.fiwka.ujinbackend.model.response

import dev.fiwka.ujinbackend.entity.Template

data class TemplateResponse(
    val id: Long,
    val name: String,
    val scrollTime: Long,
    val mainBlockImage: String?,
    val mainBlockContent: String?,
    val mainBlockTitle: String?,
    val block1Content: String?,
    val block2Content: String?,
    val block1Title: String?,
    val block2Title: String?,
    val contact1Name: String?,
    val contact1Phone: String?,
    val contact2Name: String?,
    val contact2Phone: String?,
    val contact3Name: String?,
    val contact3Phone: String?,
    val contact4Name: String?,
    val contact4Phone: String?
) {
    companion object {
        fun from(template: Template) = TemplateResponse(
            id = requireNotNull(template.id),
            name = template.name,
            scrollTime = template.scrollTime,
            mainBlockImage = template.mainBlockImage,
            mainBlockContent = template.mainBlockContent,
            mainBlockTitle = template.mainBlockTitle,
            block1Content = template.block1Content,
            block2Content = template.block2Content,
            block1Title = template.block1Title,
            block2Title = template.block2Title,
            contact1Name = template.contact1Name,
            contact1Phone = template.contact1Phone,
            contact2Name = template.contact2Name,
            contact2Phone = template.contact2Phone,
            contact3Name = template.contact3Name,
            contact3Phone = template.contact3Phone,
            contact4Name = template.contact4Name,
            contact4Phone = template.contact4Phone
        )
    }
}

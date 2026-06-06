package dev.fiwka.ujinbackend.model.filter

data class TemplateFilter(
    val name: String? = null,
    val scrollTime: Long? = null,
    val minScrollTime: Long? = null,
    val maxScrollTime: Long? = null,
    val mainBlockContent: String? = null,
    val mainBlockTitle: String? = null,
    val block1Content: String? = null,
    val block2Content: String? = null,
    val block1Title: String? = null,
    val block2Title: String? = null,
    val contactName: String? = null,
    val contactPhone: String? = null,
    val hasMainBlockImage: Boolean? = null
)

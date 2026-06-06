package dev.fiwka.ujinbackend.exception

class TemplateNotFoundException(
    id: Long
) : RuntimeException("Template '$id' was not found")

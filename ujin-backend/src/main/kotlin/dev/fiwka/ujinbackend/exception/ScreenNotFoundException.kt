package dev.fiwka.ujinbackend.exception

class ScreenNotFoundException(
    id: Long
) : RuntimeException("Screen '$id' was not found")

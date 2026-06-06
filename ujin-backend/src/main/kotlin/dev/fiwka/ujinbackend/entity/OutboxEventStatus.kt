package dev.fiwka.ujinbackend.entity

enum class OutboxEventStatus {
    PENDING,
    SENT,
    FAILED
}

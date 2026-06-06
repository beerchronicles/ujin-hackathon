package dev.fiwka.ujinbackend.repository

import dev.fiwka.ujinbackend.entity.OutboxEvent
import dev.fiwka.ujinbackend.entity.OutboxEventStatus
import jakarta.persistence.LockModeType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Lock
import java.time.Instant

interface OutboxEventRepository : JpaRepository<OutboxEvent, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    fun findTop50ByStatusAndNextAttemptAtLessThanEqualOrderByCreatedAtAsc(
        status: OutboxEventStatus,
        nextAttemptAt: Instant
    ): List<OutboxEvent>
}

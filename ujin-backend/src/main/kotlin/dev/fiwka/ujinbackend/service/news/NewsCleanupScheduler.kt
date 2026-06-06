package dev.fiwka.ujinbackend.service.news

import dev.fiwka.ujinbackend.configuration.NewsSchedulerProperties
import dev.fiwka.ujinbackend.repository.NewsRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Component
class NewsCleanupScheduler(
    private val newsRepository: NewsRepository,
    private val newsNotificationService: NewsNotificationService,
    private val properties: NewsSchedulerProperties
) {

    @Scheduled(fixedDelayString = "\${news.scheduler.cleanup-fixed-delay:60000}")
    @Transactional
    fun cleanupExpiredNews() {
        if (!properties.cleanupEnabled) {
            return
        }

        val expired = newsRepository.findExpired(Instant.now())
        val locations = expired.map { Location(it.complex, it.building) }.toSet()

        newsRepository.deleteAll(expired)
        locations.forEach { newsNotificationService.notifyLocation(it.complex, it.building) }
    }

    private data class Location(
        val complex: Long,
        val building: Long
    )
}

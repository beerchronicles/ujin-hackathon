package dev.fiwka.ujinbackend.service.news

import dev.fiwka.ujinbackend.client.ujin.UjinClient
import dev.fiwka.ujinbackend.client.ujin.response.news.NewsItem
import dev.fiwka.ujinbackend.configuration.NewsSchedulerProperties
import dev.fiwka.ujinbackend.entity.News
import dev.fiwka.ujinbackend.properties.UjinProperties
import dev.fiwka.ujinbackend.repository.NewsRepository
import dev.fiwka.ujinbackend.util.Qualifiers
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset

@Component
class NewsSyncScheduler(
    @Qualifier(Qualifiers.SYNC_CLIENT)
    private val ujinClient: UjinClient,
    private val newsRepository: NewsRepository,
    private val newsNotificationService: NewsNotificationService,
    private val properties: NewsSchedulerProperties,
    private val ujinProperties: UjinProperties
) {

    @Scheduled(fixedDelayString = "\${news.scheduler.sync-fixed-delay:300000}")
    @Transactional
    fun syncNews() {
        if (!properties.syncEnabled) {
            return
        }
        if (ujinProperties.syncToken.isNullOrBlank()) {
            log.warn { "News sync skipped: UJIN_SYNC_TOKEN is not configured" }
            return
        }

        val buildingComplex = loadBuildingComplexMap()
        if (buildingComplex.isEmpty()) {
            log.warn { "News sync skipped: no buildings received from Ujin" }
            return
        }

        val changedLocations = mutableSetOf<Location>()
        var page = 1

        do {
            val response = ujinClient.getNewsList(page = page, type = NEWS_TYPE)
            if (response.error != UJIN_SUCCESS_CODE) {
                log.warn { "News sync failed: ${response.message}" }
                return
            }

            response.data.items.forEach { item ->
                changedLocations += upsertNews(item, buildingComplex)
            }

            page += 1
        } while (page <= response.data.meta.lastPage)

        changedLocations.forEach { newsNotificationService.notifyLocation(it.complex, it.building) }
    }

    private fun loadBuildingComplexMap(): Map<Long, Long> {
        val response = ujinClient.getBuildingList(perPage = BUILDINGS_PER_PAGE)
        if (response.error != UJIN_SUCCESS_CODE) {
            log.warn { "Buildings sync for news failed: ${response.message}" }
            return emptyMap()
        }

        return response.data.buildings.associate { it.building.id to it.complex.id }
    }

    private fun upsertNews(item: NewsItem, buildingComplex: Map<Long, Long>): Set<Location> {
        return item.buildings.mapNotNull { building ->
            val complex = buildingComplex[building.id] ?: return@mapNotNull null
            val location = Location(complex = complex, building = building.id)
            val existing = newsRepository.findByNewsIdAndComplexAndBuilding(item.id, complex, building.id)
            val publishedAt = parseDate(item.date)
            val expiresAt = item.expiresAt?.let(::parseDate)

            if (existing == null) {
                newsRepository.save(
                    News(
                        newsId = item.id,
                        complex = complex,
                        building = building.id,
                        expiresAt = expiresAt,
                        title = item.title,
                        content = item.text.orEmpty(),
                        publishedAt = publishedAt,
                        image = item.image
                    )
                )
                location
            } else if (existing.applyChanges(item, publishedAt, expiresAt)) {
                location
            } else {
                null
            }
        }.toSet()
    }

    private fun News.applyChanges(item: NewsItem, publishedAt: Instant, expiresAt: Instant?): Boolean {
        var changed = false

        fun <T> update(current: T, next: T, setter: (T) -> Unit) {
            if (current != next) {
                setter(next)
                changed = true
            }
        }

        update(title, item.title) { title = it }
        update(content, item.text.orEmpty()) { content = it }
        update(this.publishedAt, publishedAt) { this.publishedAt = it }
        update(this.expiresAt, expiresAt) { this.expiresAt = it }
        update(image, item.image) { image = it }

        return changed
    }

    private fun parseDate(value: String?): Instant =
        value?.let {
            runCatching { Instant.parse(it) }.getOrElse {
                LocalDate.parse(value).atStartOfDay().toInstant(ZoneOffset.UTC)
            }
        } ?: Instant.now()

    private data class Location(
        val complex: Long,
        val building: Long
    )

    companion object {
        private const val UJIN_SUCCESS_CODE = 0
        private const val BUILDINGS_PER_PAGE = 1000
        private const val NEWS_TYPE = "news"
        private val log = KotlinLogging.logger { }
    }
}

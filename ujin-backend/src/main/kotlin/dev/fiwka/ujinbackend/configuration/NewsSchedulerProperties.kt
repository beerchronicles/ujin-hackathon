package dev.fiwka.ujinbackend.configuration

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "news.scheduler")
data class NewsSchedulerProperties(
    val syncEnabled: Boolean = true,
    val cleanupEnabled: Boolean = true
)

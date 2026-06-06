package dev.fiwka.ujinbackend.model.response

import dev.fiwka.ujinbackend.entity.News
import java.time.Instant

data class NewsResponse(
    val id: Long,
    val newsId: Long,
    val complex: Long,
    val building: Long,
    val expiresAt: Instant?,
    val title: String,
    val content: String,
    val publishedAt: Instant,
    val image: String?
) {
    companion object {
        fun from(news: News) = NewsResponse(
            id = requireNotNull(news.id),
            newsId = news.newsId,
            complex = news.complex,
            building = news.building,
            expiresAt = news.expiresAt,
            title = news.title,
            content = news.content,
            publishedAt = news.publishedAt,
            image = news.image
        )
    }
}

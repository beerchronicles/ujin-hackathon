package dev.fiwka.ujinbackend.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

@Entity
@Table(name = "news")
class News(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    @Column(name = "news_id", nullable = false)
    var newsId: Long,
    @Column(name = "expires_at", nullable = false)
    var expiresAt: Instant,
    @Column(name = "title", nullable = false, columnDefinition = "text")
    var title: String,
    @Column(name = "content", nullable = false, columnDefinition = "text")
    var content: String,
    @Column(name = "published_at", nullable = false)
    var publishedAt: Instant,
    @Column(name = "image", columnDefinition = "text")
    var image: String? = null
)
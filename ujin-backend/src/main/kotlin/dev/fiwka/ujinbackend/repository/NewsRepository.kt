package dev.fiwka.ujinbackend.repository

import dev.fiwka.ujinbackend.entity.News
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.Instant

interface NewsRepository : JpaRepository<News, Long> {

    fun findByNewsIdAndComplexAndBuilding(newsId: Long, complex: Long, building: Long): News?

    @Query(
        """
        select n from News n
        where n.complex = :complex
          and n.building = :building
          and (n.expiresAt is null or n.expiresAt > :now)
        order by n.publishedAt desc, n.id desc
        """
    )
    fun findActiveByLocation(complex: Long, building: Long, now: Instant): List<News>

    @Query("select n from News n where n.expiresAt is not null and n.expiresAt <= :now")
    fun findExpired(now: Instant): List<News>
}

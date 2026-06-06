package dev.fiwka.ujinbackend.service.news

interface NewsNotificationService {

    fun notifyLocation(complex: Long, building: Long)
}

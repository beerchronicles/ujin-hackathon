package dev.fiwka.ujinbackend.repository

import dev.fiwka.ujinbackend.entity.Screen
import dev.fiwka.ujinbackend.entity.Template
import org.springframework.data.jpa.repository.JpaRepository

interface ScreenRepository : JpaRepository<Screen, Long> {

    fun findAllByTemplate(template: Template): List<Screen>

    fun findAllByComplexAndBuilding(complex: Long, building: Long): List<Screen>
}

package dev.fiwka.ujinbackend.repository

import dev.fiwka.ujinbackend.entity.Screen
import dev.fiwka.ujinbackend.entity.Template
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface ScreenRepository : JpaRepository<Screen, Long>, JpaSpecificationExecutor<Screen> {

    fun findAllByTemplate(template: Template): List<Screen>

    fun findAllByComplexAndBuilding(complex: Long, building: Long): List<Screen>
}

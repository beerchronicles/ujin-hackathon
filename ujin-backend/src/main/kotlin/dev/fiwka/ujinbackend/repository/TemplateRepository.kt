package dev.fiwka.ujinbackend.repository

import dev.fiwka.ujinbackend.entity.Template
import org.springframework.data.jpa.repository.JpaRepository

interface TemplateRepository : JpaRepository<Template, Long>

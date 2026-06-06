package dev.fiwka.ujinbackend.repository

import dev.fiwka.ujinbackend.entity.Template
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface TemplateRepository : JpaRepository<Template, Long>, JpaSpecificationExecutor<Template>

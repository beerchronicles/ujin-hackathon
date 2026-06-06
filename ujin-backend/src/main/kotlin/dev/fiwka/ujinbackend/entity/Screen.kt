package dev.fiwka.ujinbackend.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import kotlin.properties.Delegates

@Entity
@Table(name = "screens")
class Screen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
    lateinit var name: String
    @ManyToOne
    @JoinColumn(name = "template_id")
    lateinit var template: Template
    var building: Long = 0
    var complex: Long = 0
    var chs: Boolean = false
    var chsText: String? = null
}
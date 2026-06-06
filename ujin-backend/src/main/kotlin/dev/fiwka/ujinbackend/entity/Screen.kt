package dev.fiwka.ujinbackend.entity

import jakarta.persistence.*


@Entity
@Table(name = "screens")
class Screen(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    var id: Long? = null,
    @Column(name = "name", nullable = false)
    var name: String,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    var template: Template,
    @Column(name = "building", nullable = false)
    var building: Long = 0,
    @Column(name = "complex", nullable = false)
    var complex: Long = 0,
    @Column(name = "chs", nullable = false)
    var chs: Boolean = false,
    @Column(name = "chs_text")
    var chsText: String? = null
)
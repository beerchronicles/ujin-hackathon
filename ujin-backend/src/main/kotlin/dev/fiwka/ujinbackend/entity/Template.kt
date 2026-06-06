package dev.fiwka.ujinbackend.entity

import jakarta.persistence.*

@Entity
@Table(name = "templates")
class Template(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    var id: Long? = null,
    @Column(name = "name", nullable = false)
    var name: String,
    @Column(name = "scroll_time", nullable = false)
    var scrollTime: Long,
    @Column(name = "main_block_image")
    var mainBlockImage: String? = null,
    @Column(name = "main_block_content")
    var mainBlockContent: String? = null,
    @Column(name = "main_block_title")
    var mainBlockTitle: String? = null,
    @Column(name = "block1_content")
    var block1Content: String? = null,
    @Column(name = "block2_content")
    var block2Content: String? = null,
    @Column(name = "block1_title")
    var block1Title: String? = null,
    @Column(name = "block2_title")
    var block2Title: String? = null,
    @Column(name = "contact1_name")
    var contact1Name: String? = null,
    @Column(name = "contact1_phone")
    var contact1Phone: String? = null,
    @Column(name = "contact2_name")
    var contact2Name: String? = null,
    @Column(name = "contact2_phone")
    var contact2Phone: String? = null,
    @Column(name = "contact3_name")
    var contact3Name: String? = null,
    @Column(name = "contact3_phone")
    var contact3Phone: String? = null,
    @Column(name = "contact4_name")
    var contact4Name: String? = null,
    @Column(name = "contact4_phone")
    var contact4Phone: String? = null
)

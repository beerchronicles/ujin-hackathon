package dev.fiwka.ujinbackend.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "templates")
class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
    lateinit var name: String
    @Column(name = "main_block_image", nullable = true)
    var mainBlockImage: String? = null
    @Column(name = "main_block_content", nullable = true)
    var mainBlockContent: String? = null
    @Column(name = "main_block_title", nullable = true)
    var mainBlockTitle: String? = null
    @Column(name = "block1_content", nullable = true)
    var block1Content: String? = null
    @Column(name = "block2_content", nullable = true)
    var block2Content: String? = null
    @Column(name = "block1_title", nullable = true)
    var block1Title: String? = null
    @Column(name = "block2_title", nullable = true)
    var block2Title: String? = null
    @Column(name = "contact1_name", nullable = true)
    var contact1Name: String? = null
    @Column(name = "contact1_phone", nullable = true)
    var contact1Phone: String? = null
    @Column(name = "contact2_name", nullable = true)
    var contact2Name: String? = null
    @Column(name = "contact2_phone", nullable = true)
    var contact2Phone: String? = null
    @Column(name = "contact3_name", nullable = true)
    var contact3Name: String? = null
    @Column(name = "contact3_phone", nullable = true)
    var contact3Phone: String? = null
    @Column(name = "contact4_name", nullable = true)
    var contact4Name: String? = null
    @Column(name = "contact4_phone", nullable = true)
    var contact4Phone: String? = null
}
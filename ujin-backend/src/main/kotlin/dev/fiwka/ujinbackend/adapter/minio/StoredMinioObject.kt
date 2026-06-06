package dev.fiwka.ujinbackend.adapter.minio

data class StoredMinioObject(
    val id: String,
    val bucket: String,
    val objectName: String,
    val contentType: String?,
    val size: Long
)

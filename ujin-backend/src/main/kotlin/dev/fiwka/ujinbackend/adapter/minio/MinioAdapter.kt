package dev.fiwka.ujinbackend.adapter.minio

import java.io.InputStream

interface MinioAdapter {

    fun uploadImage(
        inputStream: InputStream,
        contentType: String? = null
    ): StoredMinioObject

    fun downloadImage(id: String): MinioObjectContent

    fun deleteImage(id: String)

    fun imageExists(id: String): Boolean
}

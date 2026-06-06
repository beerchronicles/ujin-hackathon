package dev.fiwka.ujinbackend.controller

import dev.fiwka.ujinbackend.adapter.minio.MinioAdapter
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/images")
class ImageController(
    private val minioAdapter: MinioAdapter
) {

    @GetMapping("/{key}")
    fun getImage(@PathVariable key: String): ResponseEntity<ByteArray> {
        val image = minioAdapter.downloadImage(key)
        val contentType = image.contentType
            ?.let(MediaType::parseMediaType)
            ?: MediaType.APPLICATION_OCTET_STREAM

        return ResponseEntity.ok()
            .contentType(contentType)
            .contentLength(image.size ?: image.bytes.size.toLong())
            .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
            .body(image.bytes)
    }
}

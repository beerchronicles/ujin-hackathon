package dev.fiwka.ujinbackend.adapter.minio

import dev.fiwka.ujinbackend.exception.MinioObjectNotFoundException
import dev.fiwka.ujinbackend.properties.MinioProperties
import dev.fiwka.ujinbackend.util.Qualifiers
import io.github.oshai.kotlinlogging.KotlinLogging
import io.minio.BucketExistsArgs
import io.minio.GetObjectArgs
import io.minio.MakeBucketArgs
import io.minio.MinioClient
import io.minio.PutObjectArgs
import io.minio.RemoveObjectArgs
import io.minio.StatObjectArgs
import io.minio.errors.ErrorResponseException
import org.springframework.beans.factory.SmartInitializingSingleton
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.retry.support.RetryTemplate
import org.springframework.stereotype.Component
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.util.UUID

@Component
class MinioAdapterImpl(
    private val minioClient: MinioClient,
    private val properties: MinioProperties,
    @Qualifier(Qualifiers.MINIO_RETRY_TEMPLATE)
    private val retryTemplate: RetryTemplate
) : MinioAdapter, SmartInitializingSingleton {

    override fun afterSingletonsInstantiated() {
        ensureImageBucketExists()
    }

    override fun uploadImage(
        inputStream: InputStream,
        contentType: String?
    ): StoredMinioObject {
        val bytes = inputStream.use { it.readBytes() }
        val actualSize = bytes.size.toLong()
        val objectName = generateUniqueObjectName()

        executeWithRetry("upload object '$objectName' to bucket '${properties.imageBucket}'") {
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(properties.imageBucket)
                    .`object`(objectName)
                    .stream(ByteArrayInputStream(bytes), actualSize, -1)
                    .contentType(contentType ?: DEFAULT_CONTENT_TYPE)
                    .build()
            )
        }

        return StoredMinioObject(
            id = objectName,
            bucket = properties.imageBucket,
            objectName = objectName,
            contentType = contentType ?: DEFAULT_CONTENT_TYPE,
            size = actualSize
        )
    }

    override fun downloadImage(id: String): MinioObjectContent {
        return executeWithRetry("download object '$id' from bucket '${properties.imageBucket}'") {
            try {
                val stat = minioClient.statObject(
                    StatObjectArgs.builder()
                        .bucket(properties.imageBucket)
                        .`object`(id)
                        .build()
                )
                val bytes = minioClient.getObject(
                    GetObjectArgs.builder()
                        .bucket(properties.imageBucket)
                        .`object`(id)
                        .build()
                ).use { it.readBytes() }

                MinioObjectContent(
                    id = id,
                    bytes = bytes,
                    contentType = stat.contentType(),
                    size = stat.size()
                )
            } catch (exception: ErrorResponseException) {
                if (exception.isNotFound()) {
                    throw MinioObjectNotFoundException(id, properties.imageBucket, exception)
                }
                throw exception
            }
        }
    }

    override fun imageExists(id: String): Boolean {
        return objectExists(id)
    }

    override fun deleteImage(id: String) {
        executeWithRetry("delete object '$id' from bucket '${properties.imageBucket}'") {
            minioClient.removeObject(
                RemoveObjectArgs.builder()
                    .bucket(properties.imageBucket)
                    .`object`(id)
                    .build()
            )
        }
    }

    private fun ensureImageBucketExists() {
        executeWithRetry("ensure bucket '${properties.imageBucket}' exists") {
            val exists = minioClient.bucketExists(
                BucketExistsArgs.builder()
                    .bucket(properties.imageBucket)
                    .build()
            )

            if (!exists) {
                minioClient.makeBucket(
                    MakeBucketArgs.builder()
                        .bucket(properties.imageBucket)
                        .build()
                )
                log.info { "Created MinIO bucket '${properties.imageBucket}'" }
            } else {
                log.info { "Using existing MinIO bucket '${properties.imageBucket}'" }
            }
        }
    }

    private fun generateUniqueObjectName(): String {
        repeat(MAX_ID_GENERATION_ATTEMPTS) {
            val candidate = UUID.randomUUID().toString()
            if (!objectExists(candidate)) {
                return candidate
            }
            log.warn { "Generated MinIO object id collision: $candidate" }
        }

        error("Failed to generate unique MinIO object id after $MAX_ID_GENERATION_ATTEMPTS attempts")
    }

    private fun objectExists(objectName: String): Boolean {
        return executeWithRetry("check object '$objectName' in bucket '${properties.imageBucket}'") {
            try {
                minioClient.statObject(
                    StatObjectArgs.builder()
                        .bucket(properties.imageBucket)
                        .`object`(objectName)
                        .build()
                )
                true
            } catch (exception: ErrorResponseException) {
                if (exception.isNotFound()) {
                    false
                } else {
                    throw exception
                }
            }
        }
    }

    private fun <T> executeWithRetry(action: String, block: () -> T): T {
        return retryTemplate.execute<T, Exception> { context ->
            if (context.retryCount > 0) {
                log.warn(context.lastThrowable) {
                    "Retrying MinIO action '$action', attempt ${context.retryCount + 1}"
                }
            }
            block()
        }
    }

    private fun ErrorResponseException.isNotFound(): Boolean {
        return errorResponse().code() == MINIO_NOT_FOUND_CODE
    }

    companion object {
        private const val DEFAULT_CONTENT_TYPE = "application/octet-stream"
        private const val MAX_ID_GENERATION_ATTEMPTS = 5
        private const val MINIO_NOT_FOUND_CODE = "NoSuchKey"
        private val log = KotlinLogging.logger { }
    }
}

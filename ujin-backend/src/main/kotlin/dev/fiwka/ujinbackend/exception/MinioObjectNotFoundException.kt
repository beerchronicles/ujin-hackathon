package dev.fiwka.ujinbackend.exception

class MinioObjectNotFoundException(
    id: String,
    bucket: String,
    cause: Throwable? = null
) : RuntimeException("MinIO object '$id' was not found in bucket '$bucket'", cause)

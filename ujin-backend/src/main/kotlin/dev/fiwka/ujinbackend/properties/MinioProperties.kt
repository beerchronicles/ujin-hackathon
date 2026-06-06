package dev.fiwka.ujinbackend.properties

import jakarta.validation.constraints.NotBlank
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.validation.annotation.Validated

@Validated
@ConfigurationProperties(prefix = "minio")
data class MinioProperties(
    @field:NotBlank
    val endpoint: String,
    @field:NotBlank
    val accessKey: String,
    @field:NotBlank
    val secretKey: String,
    @field:NotBlank
    val imageBucket: String
)

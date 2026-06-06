package dev.fiwka.ujinbackend.properties

import org.springframework.boot.context.properties.ConfigurationProperties
import java.net.URI

@ConfigurationProperties(prefix = "ujin")
data class UjinProperties(
    val baseUrl: URI
)

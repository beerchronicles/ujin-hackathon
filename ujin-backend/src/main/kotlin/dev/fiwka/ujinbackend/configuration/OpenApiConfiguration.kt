package dev.fiwka.ujinbackend.configuration

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType
import io.swagger.v3.oas.annotations.info.Info
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.security.SecurityScheme
import org.springframework.context.annotation.Configuration

@Configuration
@OpenAPIDefinition(
    info = Info(
        title = "Ujin Hackathon Backend API",
        version = "1.0",
        description = "API documentation for the Ujin Hackathon Backend application"
    ),
    security = [
        SecurityRequirement(name = "SESSION")
    ]
)
@SecurityScheme(
    name = "SESSION",
    type = SecuritySchemeType.APIKEY,
    `in` = SecuritySchemeIn.COOKIE,
    paramName = "SESSION"
)
class OpenApiConfiguration
package dev.fiwka.ujinbackend.model.response

import dev.fiwka.ujinbackend.client.ujin.response.complex.ComplexItem

data class ComplexResponse(
    val id: Long,
    val title: String,
    val timezone: String
) {
    companion object {
        fun from(complex: ComplexItem) = ComplexResponse(
            id = complex.id,
            title = complex.title,
            timezone = complex.timezone
        )
    }
}

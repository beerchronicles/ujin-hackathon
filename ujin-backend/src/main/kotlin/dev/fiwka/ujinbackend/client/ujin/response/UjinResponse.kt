package dev.fiwka.ujinbackend.client.ujin.response

class UjinResponse<T>(
    val error: Int,
    val message: String,
    val data: T
)
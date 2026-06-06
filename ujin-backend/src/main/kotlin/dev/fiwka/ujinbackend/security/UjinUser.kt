package dev.fiwka.ujinbackend.security

import java.io.Serializable

data class UjinUser(
    val token: String
) : Serializable
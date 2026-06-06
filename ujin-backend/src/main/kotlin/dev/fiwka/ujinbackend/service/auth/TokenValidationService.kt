package dev.fiwka.ujinbackend.service.auth

interface TokenValidationService {
    fun isValid(token: String): Boolean
}
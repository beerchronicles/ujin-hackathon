package dev.fiwka.ujinbackend.security

import dev.fiwka.ujinbackend.service.auth.TokenValidationService
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component

@Component
class UjinAuthenticationProvider(
    private val tokenValidationService: TokenValidationService
) : AuthenticationProvider {

    override fun authenticate(authentication: Authentication): Authentication? {
        val token = authentication.name

        if (!tokenValidationService.isValid(token)) {
            throw BadCredentialsException("Invalid token")
        }

        val principal = UjinUser(token)

        return UsernamePasswordAuthenticationToken.authenticated(principal, null, emptyList())
    }

    override fun supports(authentication: Class<*>): Boolean =
        UsernamePasswordAuthenticationToken::class.java.isAssignableFrom(authentication)
}
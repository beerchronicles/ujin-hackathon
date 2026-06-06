package dev.fiwka.ujinbackend.service.auth

import dev.fiwka.ujinbackend.client.ujin.UjinClient
import dev.fiwka.ujinbackend.util.Qualifiers
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service

@Service
class TokenValidationServiceImpl(
    @Qualifier(Qualifiers.PUBLIC_CLIENT)
    private val publicClient: UjinClient
) : TokenValidationService {

    override fun isValid(token: String): Boolean =
        publicClient.getComplexList(token = token).error == 0
}
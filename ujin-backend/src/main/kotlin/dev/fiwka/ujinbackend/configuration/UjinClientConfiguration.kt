package dev.fiwka.ujinbackend.configuration

import dev.fiwka.ujinbackend.client.ujin.UjinClient
import dev.fiwka.ujinbackend.exception.UnauthenticatedException
import dev.fiwka.ujinbackend.properties.UjinProperties
import dev.fiwka.ujinbackend.security.UjinUser
import dev.fiwka.ujinbackend.util.Qualifiers
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.client.RestClient
import org.springframework.web.client.support.RestClientAdapter
import org.springframework.web.service.invoker.HttpServiceProxyFactory
import org.springframework.web.service.invoker.createClient

@Configuration
@EnableConfigurationProperties(UjinProperties::class)
class UjinClientConfiguration(
    private val properties: UjinProperties
) {

    @Bean
    @Qualifier(Qualifiers.PUBLIC_CLIENT)
    fun publicClient(): UjinClient {
        val restClient = RestClient.create(properties.baseUrl)
        val restClientAdapter = RestClientAdapter.create(restClient)

        return HttpServiceProxyFactory.builderFor(restClientAdapter).build()
            .createClient<UjinClient>()
    }

    @Bean
    @Qualifier(Qualifiers.AUTHENTICATED_CLIENT)
    fun authenticatedClient(): UjinClient {
        val restClient = RestClient.builder()
            .baseUrl(properties.baseUrl)
            .requestInterceptor { request, bytes, execution ->
                val auth = SecurityContextHolder.getContext().authentication ?: throw UnauthenticatedException()
                val principal = auth.principal

                if (principal is UjinUser) {
                    request.headers.setBearerAuth(principal.token)
                }

                execution.execute(request, bytes)
            }
            .build()
        val restClientAdapter = RestClientAdapter.create(restClient)

        return HttpServiceProxyFactory.builderFor(restClientAdapter).build()
            .createClient<UjinClient>()
    }

}
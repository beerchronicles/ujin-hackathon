package dev.fiwka.ujinbackend.configuration

import dev.fiwka.ujinbackend.security.UjinAuthenticationProvider
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.security.web.authentication.logout.CookieClearingLogoutHandler
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfiguration(
    private val authenticationProvider: UjinAuthenticationProvider,
    @Value("\${session.cookie.name:SESSION}")
    private val sessionCookieName: String
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain =
        http
            .authorizeHttpRequests {
                it
                    .requestMatchers("/login/**").permitAll()
                    .requestMatchers("/ws/**").permitAll()
                    .requestMatchers("/display/**").permitAll()
                    .requestMatchers("/images/**").permitAll()
                    .requestMatchers("/swagger-ui/**").permitAll()
                    .requestMatchers("/v3/api-docs/**").permitAll()
                    .anyRequest().authenticated()
            }
            .cors {
                it.configurationSource(corsConfigurationSource())
            }
            .csrf {
                it.disable()
            }
            .exceptionHandling {
                it.authenticationEntryPoint(HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            }
            .authenticationProvider(authenticationProvider)
            .formLogin { form ->
                form
                    .loginProcessingUrl("/login/token")
                    .usernameParameter("token")
                    .passwordParameter("unused")
                    .successHandler { _, response, _ ->
                        response.status = 200
                    }
                    .failureHandler { _, response, _ ->
                        response.sendError(401, "Invalid token")
                    }
                    .permitAll()
            }
            .logout { logout ->
                logout
                    .logoutUrl("/logout")
                    .addLogoutHandler(CookieClearingLogoutHandler(sessionCookieName))
                    .logoutSuccessHandler { _, response, _ ->
                        response.status = 204
                    }
                    .invalidateHttpSession(true)
                    .clearAuthentication(true)
            }
            .build()

    @Bean
    fun corsConfigurationSource(): UrlBasedCorsConfigurationSource {
        val config = CorsConfiguration()

        config.allowedOriginPatterns = listOf("*")
        config.allowedMethods = listOf("*")
        config.allowedHeaders = listOf("*")
        config.exposedHeaders = listOf("*")

        config.allowCredentials = true
        config.maxAge = 3600

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)

        return source
    }
}

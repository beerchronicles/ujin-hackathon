package dev.fiwka.ujinbackend.configuration

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.session.web.http.CookieSerializer
import org.springframework.session.web.http.DefaultCookieSerializer

@Configuration
class SessionCookieConfiguration {

    @Bean
    fun cookieSerializer(
        @Value("\${session.cookie.name:SESSION}")
        cookieName: String,
        @Value("\${session.cookie.same-site:None}")
        sameSite: String,
        @Value("\${session.cookie.secure:true}")
        secure: Boolean
    ): CookieSerializer =
        DefaultCookieSerializer().apply {
            setCookieName(cookieName)
            setCookiePath("/")
            setSameSite(sameSite)
            setUseHttpOnlyCookie(true)
            setUseSecureCookie(secure)
        }
}

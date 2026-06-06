package dev.fiwka.ujinbackend.configuration

import dev.fiwka.ujinbackend.exception.MinioObjectNotFoundException
import dev.fiwka.ujinbackend.util.Qualifiers
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.retry.backoff.FixedBackOffPolicy
import org.springframework.retry.policy.SimpleRetryPolicy
import org.springframework.retry.support.RetryTemplate

@Configuration
class MinioRetryConfiguration {

    @Bean(Qualifiers.MINIO_RETRY_TEMPLATE)
    fun minioRetryTemplate(): RetryTemplate {
        val retryPolicy = SimpleRetryPolicy(
            MAX_ATTEMPTS,
            mapOf(
                MinioObjectNotFoundException::class.java to false,
                Exception::class.java to true
            ),
            true
        )
        val backOffPolicy = FixedBackOffPolicy().apply {
            backOffPeriod = BACKOFF_PERIOD_MS
        }

        return RetryTemplate().apply {
            setRetryPolicy(retryPolicy)
            setBackOffPolicy(backOffPolicy)
        }
    }

    companion object {
        private const val MAX_ATTEMPTS = 3
        private const val BACKOFF_PERIOD_MS = 200L
    }
}

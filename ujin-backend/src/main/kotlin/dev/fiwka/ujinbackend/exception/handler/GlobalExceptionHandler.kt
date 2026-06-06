package dev.fiwka.ujinbackend.exception.handler

import dev.fiwka.ujinbackend.exception.UnauthenticatedException
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(RuntimeException::class)
    fun handleInternalServerError(exception: RuntimeException): ProblemDetail {
        val status = HttpStatus.INTERNAL_SERVER_ERROR
        log.error(exception) { status.reasonPhrase }
        return ProblemDetail.forStatus(status).apply {
            title = status.reasonPhrase
            detail = "An unexpected error occurred. Please try again later."
        }
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(UnauthenticatedException::class)
    fun handleUnauthenticated(exception: UnauthenticatedException): ProblemDetail {
        val status = HttpStatus.UNAUTHORIZED
        log.warn(exception) { status.reasonPhrase }
        return ProblemDetail.forStatus(status).apply {
            title = status.reasonPhrase
            detail = exception.message
        }
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}
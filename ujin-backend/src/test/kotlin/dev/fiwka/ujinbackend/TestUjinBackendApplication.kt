package dev.fiwka.ujinbackend

import org.springframework.boot.fromApplication
import org.springframework.boot.with


fun main(args: Array<String>) {
    fromApplication<UjinBackendApplication>().with(TestcontainersConfiguration::class).run(*args)
}

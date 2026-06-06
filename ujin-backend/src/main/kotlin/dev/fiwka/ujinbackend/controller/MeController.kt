package dev.fiwka.ujinbackend.controller

import dev.fiwka.ujinbackend.model.response.MeResponse
import dev.fiwka.ujinbackend.security.UjinUser
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/me")
class MeController {

    @GetMapping
    fun getToken(@AuthenticationPrincipal ujinUser: UjinUser) =
        MeResponse(ujinUser.token)
}
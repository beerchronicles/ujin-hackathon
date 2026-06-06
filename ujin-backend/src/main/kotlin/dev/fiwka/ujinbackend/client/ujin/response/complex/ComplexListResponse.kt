package dev.fiwka.ujinbackend.client.ujin.response.complex

import dev.fiwka.ujinbackend.client.ujin.response.pagination.PaginationMeta

class ComplexListResponse(
    val items: List<ComplexItem>,
    val meta: PaginationMeta
)
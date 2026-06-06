package dev.fiwka.ujinbackend.repository.specification

import dev.fiwka.ujinbackend.entity.Screen
import dev.fiwka.ujinbackend.model.filter.ScreenFilter
import jakarta.persistence.criteria.Predicate
import org.springframework.data.jpa.domain.Specification

object ScreenSpecifications {

    fun byFilter(filter: ScreenFilter): Specification<Screen> =
        Specification { root, _, cb ->
            val predicates = mutableListOf<Predicate>()

            filter.name?.takeIf(String::isNotBlank)?.let {
                predicates += cb.like(cb.lower(root.get("name")), contains(it))
            }
            filter.templateId?.let {
                predicates += cb.equal(root.get<Any>("template").get<Long>("id"), it)
            }
            filter.complex?.let {
                predicates += cb.equal(root.get<Long>("complex"), it)
            }
            filter.building?.let {
                predicates += cb.equal(root.get<Long>("building"), it)
            }
            filter.chs?.let {
                predicates += cb.equal(root.get<Boolean>("chs"), it)
            }
            filter.chsText?.takeIf(String::isNotBlank)?.let {
                predicates += cb.like(cb.lower(root.get("chsText")), contains(it))
            }

            cb.and(*predicates.toTypedArray())
        }

    private fun contains(value: String): String =
        "%${value.lowercase()}%"
}

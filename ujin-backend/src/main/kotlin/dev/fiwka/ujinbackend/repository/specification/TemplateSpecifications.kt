package dev.fiwka.ujinbackend.repository.specification

import dev.fiwka.ujinbackend.entity.Template
import dev.fiwka.ujinbackend.model.filter.TemplateFilter
import jakarta.persistence.criteria.Predicate
import org.springframework.data.jpa.domain.Specification

object TemplateSpecifications {

    fun byFilter(filter: TemplateFilter): Specification<Template> =
        Specification { root, _, cb ->
            val predicates = mutableListOf<Predicate>()

            filter.name?.takeIf(String::isNotBlank)?.let {
                predicates += cb.like(cb.lower(root.get("name")), contains(it))
            }
            filter.scrollTime?.let {
                predicates += cb.equal(root.get<Long>("scrollTime"), it)
            }
            filter.minScrollTime?.let {
                predicates += cb.greaterThanOrEqualTo(root.get("scrollTime"), it)
            }
            filter.maxScrollTime?.let {
                predicates += cb.lessThanOrEqualTo(root.get("scrollTime"), it)
            }

            addTextPredicate(predicates, filter.mainBlockContent, "mainBlockContent", root, cb)
            addTextPredicate(predicates, filter.mainBlockTitle, "mainBlockTitle", root, cb)
            addTextPredicate(predicates, filter.block1Content, "block1Content", root, cb)
            addTextPredicate(predicates, filter.block2Content, "block2Content", root, cb)
            addTextPredicate(predicates, filter.block1Title, "block1Title", root, cb)
            addTextPredicate(predicates, filter.block2Title, "block2Title", root, cb)

            filter.contactName?.takeIf(String::isNotBlank)?.let { value ->
                predicates += cb.or(
                    cb.like(cb.lower(root.get("contact1Name")), contains(value)),
                    cb.like(cb.lower(root.get("contact2Name")), contains(value)),
                    cb.like(cb.lower(root.get("contact3Name")), contains(value)),
                    cb.like(cb.lower(root.get("contact4Name")), contains(value))
                )
            }
            filter.contactPhone?.takeIf(String::isNotBlank)?.let { value ->
                predicates += cb.or(
                    cb.like(cb.lower(root.get("contact1Phone")), contains(value)),
                    cb.like(cb.lower(root.get("contact2Phone")), contains(value)),
                    cb.like(cb.lower(root.get("contact3Phone")), contains(value)),
                    cb.like(cb.lower(root.get("contact4Phone")), contains(value))
                )
            }
            filter.hasMainBlockImage?.let {
                predicates += if (it) {
                    cb.isNotNull(root.get<String>("mainBlockImage"))
                } else {
                    cb.isNull(root.get<String>("mainBlockImage"))
                }
            }

            cb.and(*predicates.toTypedArray())
        }

    private fun addTextPredicate(
        predicates: MutableList<Predicate>,
        value: String?,
        field: String,
        root: jakarta.persistence.criteria.Root<Template>,
        cb: jakarta.persistence.criteria.CriteriaBuilder
    ) {
        value?.takeIf(String::isNotBlank)?.let {
            predicates += cb.like(cb.lower(root.get(field)), contains(it))
        }
    }

    private fun contains(value: String): String =
        "%${value.lowercase()}%"
}

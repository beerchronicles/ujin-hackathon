package dev.fiwka.ujinbackend.adapter.minio

data class MinioObjectContent(
    val id: String,
    val bytes: ByteArray,
    val contentType: String?,
    val size: Long?
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as MinioObjectContent

        if (size != other.size) return false
        if (id != other.id) return false
        if (!bytes.contentEquals(other.bytes)) return false
        if (contentType != other.contentType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = size?.hashCode() ?: 0
        result = 31 * result + id.hashCode()
        result = 31 * result + bytes.contentHashCode()
        result = 31 * result + (contentType?.hashCode() ?: 0)
        return result
    }
}

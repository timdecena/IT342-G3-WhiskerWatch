package com.example.whoskerwatch.data.model

data class PetEntity(
    val id: Long = 0,
    val petName: String,
    val name: String,  // Use only one name field
    val type: String,
    val species: String,
    val breed: String,
    val age: Int,
    val status: String,
    val imageUrl: String? = null,  // Explicitly nullable
    val owner: Owner? = null,  // Make owner nullable
    // Remove the duplicate petName field
) {
    // Helper property to safely get owner ID
    val ownerId: Long? get() = owner?.id
}

data class Owner(
    val id: Long,
    val firstName: String? = null,
    val lastName: String? = null,
    val email: String? = null
)


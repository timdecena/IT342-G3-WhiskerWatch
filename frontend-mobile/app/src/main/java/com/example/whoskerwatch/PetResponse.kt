package com.example.whoskerwatch

import com.example.whoskerwatch.data.model.PetEntity

data class PetResponse(
    val success: Boolean,
    val message: String,
    val pet: PetEntity,
    val id: Long,
    val name: String,
    val imageUrl: String,
    val location: String,
    val sex: String,
    val color: String,
    val breed: String,
    val weight: String,
    val fosterParent: String,
    val description: String,
    val age: Int,
    val animalType: String,

)
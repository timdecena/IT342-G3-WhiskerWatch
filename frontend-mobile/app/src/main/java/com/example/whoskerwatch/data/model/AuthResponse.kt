package com.example.whoskerwatch.data.model

data class AuthResponse(
    val email: String,
    val userId: Long,
    val token: String,
    val firstName: String,
    val lastName: String
)

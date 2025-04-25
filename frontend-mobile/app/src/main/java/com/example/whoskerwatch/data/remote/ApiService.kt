package com.example.whoskerwatch.data.remote

import com.example.whoskerwatch.data.model.AuthRequest
import com.example.whoskerwatch.data.model.AuthResponse
import com.example.whoskerwatch.data.model.UserEntity
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("/api/auth/login")
    fun login(@Body request: AuthRequest): Call<AuthResponse>

    @POST("/api/users/createUser")
    fun register(@Body user: UserEntity): Call<UserEntity>  // Removed the Authorization header
}

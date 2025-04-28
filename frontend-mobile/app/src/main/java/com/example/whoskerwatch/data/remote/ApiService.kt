package com.example.whoskerwatch.data.remote

import com.example.whoskerwatch.PetResponse
import com.example.whoskerwatch.data.model.AuthRequest
import com.example.whoskerwatch.data.model.AuthResponse
import com.example.whoskerwatch.data.model.UserEntity
import com.example.whoskerwatch.data.model.PetEntity
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.*

interface ApiService {


    @GET("pets/{name}")
    suspend fun getPetByName(@Path("name") name: String): PetEntity
    @GET("pets/{id}")
    suspend fun getPetById(@Path("id") id: String): PetEntity
    // Fetch all pets - NO TOKEN NEEDED
    @GET("/api/pets")
    suspend fun getPets(): List<PetEntity>

    // Add new pet - TOKEN REQUIRED
    @POST("/api/pets")
    fun addPet(@Body pet: PetEntity): Call<PetEntity>

    // Login user
    @POST("/api/auth/login")
    fun login(@Body request: AuthRequest): Call<AuthResponse>

    // Register user
    @POST("/api/users/createUser")
    fun register(@Body user: UserEntity): Call<UserEntity>

    // Fetch pets by owner - NO TOKEN NEEDED
    @GET("/api/pets/owner/{ownerId}")
    suspend fun getPetsByOwner(@Path("ownerId") ownerId: Long): Response<List<PetResponse>>

    // Upload pet with image - TOKEN REQUIRED
    @Multipart
    @POST("/api/pets/add-with-image/{ownerId}")
    suspend fun uploadPet(
        @Path("ownerId") ownerId: Long,
        @Part("petName") petName: RequestBody,
        @Part("type") type: RequestBody,
        @Part("species") species: RequestBody,
        @Part("breed") breed: RequestBody,
        @Part("age") age: RequestBody,
        @Part("status") status: RequestBody,
        @Part image: MultipartBody.Part
    ): Response<PetResponse>
}

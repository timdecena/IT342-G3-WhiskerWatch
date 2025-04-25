package com.example.whoskerwatch.network


import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import com.example.whoskerwatch.data.remote.ApiService

object RetrofitInstance {
    private const val BASE_URL = "http://10.0.2.2:8080/" // Use 10.0.2.2 for localhost from emulator

    private val retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    val apiService: ApiService by lazy {
        retrofit.create(ApiService::class.java)
    }
}

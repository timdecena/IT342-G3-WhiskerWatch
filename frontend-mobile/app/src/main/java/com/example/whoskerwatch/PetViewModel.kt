package com.example.whoskerwatch

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.whoskerwatch.data.model.PetEntity
import com.example.whoskerwatch.data.remote.ApiService
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class PetViewModel : ViewModel() {

    var pet by mutableStateOf<PetEntity?>(null)
        private set

    var isLoading by mutableStateOf(false)
        private set

    var error by mutableStateOf<String?>(null)
        private set

    private val retrofit = Retrofit.Builder()
        .baseUrl("http://10.0.2.2:8080/") // <- Make sure your backend is running
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    private val service = retrofit.create(ApiService::class.java)

    fun fetchPetDetails(petName: String) {
        viewModelScope.launch {
            isLoading = true
            error = null
            try {
                val response = service.getPetByName(petName)
                pet = response
            } catch (e: Exception) {
                error = e.localizedMessage ?: "Unknown error occurred"
            } finally {
                isLoading = false
            }
        }
    }
}

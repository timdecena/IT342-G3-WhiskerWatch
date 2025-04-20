package com.example.whoskerwatch.repository

import android.content.Context
import android.util.Log
import com.example.whoskerwatch.data.model.AuthRequest
import com.example.whoskerwatch.data.model.AuthResponse
import com.example.whoskerwatch.data.model.UserEntity
import com.example.whoskerwatch.data.remote.ApiService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class AuthRepository(private val apiService: ApiService, private val context: Context) {

    private val sharedPreferences = context.getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE)

    // Register user without auth token
    fun registerUser(user: UserEntity, callback: (Boolean) -> Unit) {
        apiService.register(user).enqueue(object : Callback<UserEntity> {
            override fun onResponse(call: Call<UserEntity>, response: Response<UserEntity>) {
                if (response.isSuccessful) {
                    Log.d("AuthRepository", "Registration successful")
                    callback(true)
                } else {
                    Log.e("AuthRepository", "Registration failed: ${response.code()} ${response.message()}")
                    callback(false)
                }
            }

            override fun onFailure(call: Call<UserEntity>, t: Throwable) {
                Log.e("AuthRepository", "Registration error: ${t.message}")
                callback(false)
            }
        })
    }

    fun loginUser(authRequest: AuthRequest, callback: (Boolean) -> Unit) {
        apiService.login(authRequest).enqueue(object : Callback<AuthResponse> {
            override fun onResponse(call: Call<AuthResponse>, response: Response<AuthResponse>) {
                if (response.isSuccessful) {
                    response.body()?.let { authResponse ->
                        saveToken(authResponse.token)
                        saveUserData(authResponse.firstName, authResponse.lastName, authResponse.userId)
                        Log.d("AuthRepository", "Login success: Token saved")
                        callback(true)
                    } ?: run {
                        Log.e("AuthRepository", "Login failed: Empty response")
                        callback(false)
                    }
                } else {
                    Log.e("AuthRepository", "Login failed: ${response.code()} ${response.message()}")
                    callback(false)
                }
            }

            override fun onFailure(call: Call<AuthResponse>, t: Throwable) {
                Log.e("AuthRepository", "Login error: ${t.message}")
                callback(false)
            }
        })
    }

    private fun saveToken(token: String) {
        sharedPreferences.edit().putString("auth_token", token).apply()
    }

    private fun saveUserData(firstName: String, lastName: String, userId: Long) {
        sharedPreferences.edit().apply {
            putString("firstName", firstName)
            putString("lastName", lastName)
            putLong("userId", userId)
            apply()
        }
    }

    fun getToken(): String? {
        return sharedPreferences.getString("auth_token", null)
    }

    fun logout() {
        sharedPreferences.edit().clear().apply()
    }
}

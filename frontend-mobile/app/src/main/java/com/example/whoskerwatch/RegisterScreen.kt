package com.example.whoskerwatch.ui

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.whoskerwatch.data.model.UserEntity
import com.example.whoskerwatch.network.RetrofitInstance
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

@Composable
fun RegisterScreen(navController: NavController) {
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 24.dp, vertical = 40.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "WHOSKERWATCH",
            style = MaterialTheme.typography.displayMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 40.dp)
        )

        OutlinedTextField(
            value = firstName,
            onValueChange = { firstName = it },
            label = { Text("First Name") },
            modifier = Modifier.fillMaxWidth()
        )

        OutlinedTextField(
            value = lastName,
            onValueChange = { lastName = it },
            label = { Text("Last Name") },
            modifier = Modifier.fillMaxWidth()
        )

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth()
        )

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(32.dp))

        Button(
            onClick = {
                val newUser = UserEntity(
                    firstName = firstName,
                    lastName = lastName,
                    email = email,
                    password = password
                )

                RetrofitInstance.apiService.register(newUser)
                    .enqueue(object : Callback<UserEntity> {
                        override fun onResponse(call: Call<UserEntity>, response: Response<UserEntity>) {
                            if (response.isSuccessful) {
                                navController.navigate("login")
                            } else {
                                Toast.makeText(context, "Registration failed", Toast.LENGTH_SHORT).show()
                            }
                        }

                        override fun onFailure(call: Call<UserEntity>, t: Throwable) {
                            Toast.makeText(context, "Network error", Toast.LENGTH_SHORT).show()
                        }
                    })
            },
            modifier = Modifier.fillMaxWidth().height(48.dp)
        ) {
            Text("Register")
        }
    }
}

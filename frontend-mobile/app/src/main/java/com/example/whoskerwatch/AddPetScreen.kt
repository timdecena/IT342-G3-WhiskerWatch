package com.example.whoskerwatch

import android.content.Context
import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import coil.compose.rememberAsyncImagePainter
import com.example.whoskerwatch.data.model.PetEntity
import com.example.whoskerwatch.data.remote.ApiService
import com.example.whoskerwatch.PetResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.File

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddPetScreen(navController: NavController) {
    var name by remember { mutableStateOf("") }
    var age by remember { mutableStateOf("") }
    var animalType by remember { mutableStateOf("") }
    var species by remember { mutableStateOf("") }
    var breed by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var imageUri by remember { mutableStateOf<Uri?>(null) }
    var isLoading by remember { mutableStateOf(false) }

    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    val imagePickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        imageUri = uri
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Add New Pet") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .padding(16.dp)
                .fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Name*") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            OutlinedTextField(
                value = age,
                onValueChange = { age = it },
                label = { Text("Age*") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
            )

            OutlinedTextField(
                value = animalType,
                onValueChange = { animalType = it },
                label = { Text("Animal Type*") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            OutlinedTextField(
                value = species,
                onValueChange = { species = it },
                label = { Text("Species") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            OutlinedTextField(
                value = breed,
                onValueChange = { breed = it },
                label = { Text("Breed") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            OutlinedTextField(
                value = description,
                onValueChange = { description = it },
                label = { Text("Description") },
                modifier = Modifier.fillMaxWidth(),
                maxLines = 3
            )

            Button(
                onClick = { imagePickerLauncher.launch("image/*") },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Select Image*")
            }

            imageUri?.let {
                Image(
                    painter = rememberAsyncImagePainter(it),
                    contentDescription = "Selected Pet Image",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                )
            }

            Button(
                onClick = {
                    if (name.isBlank() || age.isBlank() || animalType.isBlank() || imageUri == null) {
                        Toast.makeText(
                            context,
                            "Please fill all required fields (*) and select an image",
                            Toast.LENGTH_LONG
                        ).show()
                        return@Button
                    }

                    scope.launch {
                        isLoading = true
                        try {
                            val ageInt = try {
                                age.toInt()
                            } catch (e: NumberFormatException) {
                                withContext(Dispatchers.Main) {
                                    Toast.makeText(context, "Please enter a valid age", Toast.LENGTH_SHORT).show()
                                }
                                return@launch
                            }

                            uploadPet(
                                context = context,
                                petName = name,
                                type = animalType,
                                species = species,
                                breed = breed,
                                age = ageInt,
                                status = description,
                                imageUri = imageUri,
                                navController = navController
                            )
                        } finally {
                            isLoading = false
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                enabled = !isLoading
            ) {
                if (isLoading) {
                    CircularProgressIndicator(color = MaterialTheme.colorScheme.onPrimary)
                } else {
                    Text("Save Pet")
                }
            }
        }
    }
}

suspend fun uploadPet(
    context: Context,
    petName: String,
    type: String,
    species: String,
    breed: String,
    age: Int,
    status: String,
    imageUri: Uri?,
    navController: NavController? = null
) {
    var tempFile: File? = null
    try {
        // Retrieve ownerId from SharedPreferences
        val sharedPrefs = context.getSharedPreferences("WhoskerWatchPrefs", Context.MODE_PRIVATE)
        val ownerId = sharedPrefs.getLong("ownerId", -1L)

        if (ownerId == -1L) {
            withContext(Dispatchers.Main) {
                Toast.makeText(context, "Owner ID not found. Please log in again.", Toast.LENGTH_LONG).show()
            }
            return
        }

        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:8080") // Replace with your actual backend URL
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val service = retrofit.create(ApiService::class.java)

        if (imageUri == null) {
            withContext(Dispatchers.Main) {
                Toast.makeText(context, "Image is required", Toast.LENGTH_LONG).show()
            }
            return
        }

        tempFile = File.createTempFile("pet_image", ".jpg", context.cacheDir).apply {
            context.contentResolver.openInputStream(imageUri)?.use { input ->
                outputStream().use { output ->
                    input.copyTo(output)
                }
            }
        }

        val requestFile = tempFile.asRequestBody("image/*".toMediaTypeOrNull())
        val imagePart = MultipartBody.Part.createFormData("image", tempFile.name, requestFile)

        val response = service.uploadPet(
            ownerId = ownerId, // Use the retrieved ownerId
            petName = petName.toRequestBody("text/plain".toMediaTypeOrNull()),
            type = type.toRequestBody("text/plain".toMediaTypeOrNull()),
            species = species.toRequestBody("text/plain".toMediaTypeOrNull()),
            breed = breed.toRequestBody("text/plain".toMediaTypeOrNull()),
            age = age.toString().toRequestBody("text/plain".toMediaTypeOrNull()),
            status = status.toRequestBody("text/plain".toMediaTypeOrNull()),
            image = imagePart
        )

        withContext(Dispatchers.Main) {
            if (response.isSuccessful) {
                response.body()?.let { petResponse ->
                    if (petResponse.success) {
                        Toast.makeText(context, petResponse.message, Toast.LENGTH_SHORT).show()
                        navController?.navigate("home") {
                            popUpTo("add_pet") { inclusive = true }
                        }
                    } else {
                        Toast.makeText(context, petResponse.message, Toast.LENGTH_LONG).show()
                    }
                } ?: run {
                    Toast.makeText(context, "Empty response from server", Toast.LENGTH_LONG).show()
                }
            } else {
                val error = response.errorBody()?.string() ?: "Unknown error"
                Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
            }
        }
    } catch (e: Exception) {
        withContext(Dispatchers.Main) {
            Toast.makeText(
                context,
                "Error: ${e.localizedMessage ?: "Unknown error"}",
                Toast.LENGTH_LONG
            ).show()
        }
    } finally {
        tempFile?.delete()
    }
}
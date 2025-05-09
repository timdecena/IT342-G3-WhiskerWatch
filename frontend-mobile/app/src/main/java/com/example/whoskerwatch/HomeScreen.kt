package com.example.whoskerwatch

import android.util.Log
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Chat
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import android.net.Uri
import coil.compose.rememberAsyncImagePainter
import com.example.whoskerwatch.data.model.PetEntity
import com.example.whoskerwatch.data.remote.ApiService
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(navController: NavController) {
    var pets by remember { mutableStateOf<List<PetEntity>>(emptyList()) }
    var errorMessage by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        scope.launch {
            fetchPets(
                onSuccess = { fetchedPets -> pets = fetchedPets },
                onError = { error -> errorMessage = error }
            )
        }
    }

    Scaffold(
        bottomBar = { BottomNavigationBar(navController) },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { navController.navigate("add_pet") },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Pet")
            }
        }
    ) { innerPadding ->
        // Replace Column with LazyColumn for scrollability
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(16.dp))

                SearchBar(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp)
                )

                Text(
                    text = "Pet Categories",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
            }

            item {
                val categories = listOf("Dog", "Cat", "Turtle", "Bird", "Rabbit")
                LazyRow(
                    modifier = Modifier.padding(bottom = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(categories) { category ->
                        CategoryChip(category = category)
                    }
                }
            }

            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(150.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color.LightGray)
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxSize(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Map,
                            contentDescription = "Map",
                            modifier = Modifier.size(40.dp)
                        )
                        Spacer(modifier = Modifier.width(16.dp))
                        Text(
                            text = "Find pets near you",
                            style = MaterialTheme.typography.titleMedium
                        )
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Available Pets",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
            }

            if (errorMessage.isNotEmpty()) {
                item {
                    Text(
                        text = errorMessage,
                        color = Color.Red,
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            } else {
                items(pets.chunked(2)) { rowPets ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        rowPets.forEach { pet ->
                            PetCardDynamic(
                                pet = pet,
                                modifier = Modifier.weight(1f),
                                navController = navController
                            )
                        }
                        if (rowPets.size % 2 != 0) {
                            Spacer(modifier = Modifier.weight(1f))
                        }
                    }
                }
            }

            // Add bottom spacing to prevent content from being hidden behind FAB
            item {
                Spacer(modifier = Modifier.height(80.dp))
            }
        }
    }
}

@Composable
fun PetCardDynamic(pet: PetEntity, modifier: Modifier = Modifier, navController: NavController) {
    // Use petName as primary, fall back to name if petName is not available
    val petName = pet.petName ?: pet.name ?: "Unknown Pet"

    // Process the image URL to ensure it's a complete URL
    val petImageUrl = when {
        pet.imageUrl == null -> ""
        pet.imageUrl.startsWith("http") -> pet.imageUrl
        pet.imageUrl.startsWith("/") -> "http://10.0.2.2:8080${pet.imageUrl}"
        else -> "http://10.0.2.2:8080/${pet.imageUrl}"
    }

    // Add logging to debug image URL
    Log.d("PetCard", "Pet: $petName, Original URL: ${pet.imageUrl}, Processed URL: $petImageUrl")

    Card(
        modifier = modifier
            .height(180.dp)  // Fixed height for better proportions
            .clickable {
                val encodedName = Uri.encode(petName)
                navController.navigate("petDetail/$encodedName")
            },
        shape = RoundedCornerShape(12.dp)
    ) {
        Column {
            if (petImageUrl.isNotEmpty()) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .background(Color.LightGray),
                    contentAlignment = Alignment.Center
                ) {
                    // Wrap the image in a Box to handle loading/error states visually
                    Image(
                        painter = rememberAsyncImagePainter(
                            model = petImageUrl,
                            onError = {
                                // Log error to help debug image loading issues
                                Log.e("PetCard", "Error loading image: $petImageUrl", it.result.throwable)
                            }
                        ),
                        contentDescription = petName,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                }
            } else {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .background(Color.Gray),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Pets,
                        contentDescription = "No Image",
                        tint = Color.White,
                        modifier = Modifier.size(48.dp)
                    )
                }
            }
            Text(
                text = petName,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .padding(8.dp)
                    .align(Alignment.CenterHorizontally)
            )
        }
    }
}

@Composable
fun SearchBar(modifier: Modifier = Modifier) {
    var searchText by remember { mutableStateOf("") }

    OutlinedTextField(
        value = searchText,
        onValueChange = { searchText = it },
        placeholder = { Text("Search") },
        leadingIcon = {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = "Search"
            )
        },
        shape = RoundedCornerShape(50),
        modifier = modifier,
        singleLine = true
    )
}

@Composable
fun CategoryChip(category: String) {
    Surface(
        shape = RoundedCornerShape(50),
        color = MaterialTheme.colorScheme.primaryContainer,
        modifier = Modifier.clickable { }
    ) {
        Text(
            text = category,
            style = MaterialTheme.typography.bodyMedium,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
        )
    }
}

@Composable
fun BottomNavigationBar(navController: NavController) {
    NavigationBar(
        modifier = Modifier.fillMaxWidth(),
        containerColor = MaterialTheme.colorScheme.surfaceVariant
    ) {
        NavigationBarItem(
            icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
            label = { Text("Home") },
            selected = true,
            onClick = { navController.navigate("home") }
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.ReportProblem, contentDescription = "Lost & Found") },
            label = { Text("Lost & Found") },
            selected = false,
            onClick = { navController.navigate("lostandfound") }
        )
        NavigationBarItem(
            icon = { Icon(Icons.AutoMirrored.Filled.Chat, contentDescription = "Chat") },
            label = { Text("Chat") },
            selected = false,
            onClick = { navController.navigate("chat") }
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
            label = { Text("Profile") },
            selected = false,
            onClick = { navController.navigate("profile") }
        )
    }
}

suspend fun fetchPets(
    onSuccess: (List<PetEntity>) -> Unit,
    onError: (String) -> Unit
) {
    try {
        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:8080")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val service = retrofit.create(ApiService::class.java)

        val pets = service.getPets()  // This is already a List<PetEntity>
        onSuccess(pets)
    } catch (e: Exception) {
        onError("Exception: ${e.localizedMessage ?: "Unknown error"}")
    }
}
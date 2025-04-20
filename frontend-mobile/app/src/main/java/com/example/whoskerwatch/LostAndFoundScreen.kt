package com.example.whoskerwatch

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

data class PetReport(
    val name: String,
    val description: String,
    val status: String, // "Lost" or "Found"
    val location: String
)

@Composable
fun LostAndFoundScreen(navController: NavController) {
    val samplePets = listOf(
        PetReport("Buddy", "Golden Retriever spotted near the park.", "Lost", "Central Park"),
        PetReport("Milo", "Black and white cat safely returned.", "Found", "5th Street"),
        PetReport("Luna", "Small brown dog seen near grocery store.", "Lost", "Elm Avenue"),
        PetReport("Max", "Beagle reunited with owner.", "Found", "Downtown Plaza")
    )

    Scaffold(
        bottomBar = { BottomNavigationBar(navController) }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            Text(
                text = "🐾 Lost & Found Pets",
                style = MaterialTheme.typography.titleLarge.copy(
                    fontSize = 26.sp
                ),
                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
                    .padding(bottom = 16.dp)
            )

            samplePets.forEach { pet ->
                PetCard(pet)
                Spacer(modifier = Modifier.height(12.dp))
            }
        }
    }
}

@Composable
fun PetCard(pet: PetReport) {
    val statusColor = if (pet.status == "Lost") Color(0xFFFF6B6B) else Color(0xFF51CF66)
    val statusTextColor = Color.White

    Card(
        modifier = Modifier
            .fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = pet.name,
                    style = MaterialTheme.typography.titleMedium
                )
                Box(
                    modifier = Modifier
                        .background(statusColor, shape = RoundedCornerShape(12.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = pet.status,
                        color = statusTextColor,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = pet.description,
                style = MaterialTheme.typography.bodyMedium
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "📍 Location: ${pet.location}",
                style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray)
            )
        }
    }
}

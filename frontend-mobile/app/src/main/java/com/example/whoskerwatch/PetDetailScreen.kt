package com.example.whoskerwatch


import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PetDetailScreen(navController: NavController, petName: String?) {
    // Sample pet data - in a real app you would fetch this based on petName
    val pet = when (petName) {
        "Samantha" -> Pet(
            name = "Samantha",
            imageRes = R.drawable.cat_sample,
            location = "California (2.5km)",
            sex = "Male",
            color = "Black",
            breed = "Persian",
            weight = "2kg",
            fosterParent = "Steffani Wish",
            description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem pellentesque velit donec congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        )
        "Tiger" -> Pet(
            name = "Tiger",
            imageRes = R.drawable.cat_sample2,
            location = "New York (1.2km)",
            sex = "Female",
            color = "Orange",
            breed = "Tabby",
            weight = "3kg",
            fosterParent = "Michael Johnson",
            description = "Friendly and playful tabby cat looking for a loving home."
        )
        else -> Pet(
            name = petName ?: "Unknown",
            imageRes = R.drawable.dog_sample,
            location = "Unknown location",
            sex = "Unknown",
            color = "Unknown",
            breed = "Unknown",
            weight = "Unknown",
            fosterParent = "Unknown",
            description = "No description available."
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Detail Screen") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            // Pet Image
            Image(
                painter = painterResource(id = pet.imageRes),
                contentDescription = pet.name,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(250.dp)
                    .clip(MaterialTheme.shapes.medium)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Pet name and location
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = pet.name,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.weight(1f)
                )
                Checkbox(
                    checked = false,
                    onCheckedChange = {},
                    modifier = Modifier.size(24.dp)
                )
                Text(
                    text = pet.location,
                    style = MaterialTheme.typography.bodyMedium
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Attributes table
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp)
            ) {
                // Table header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    listOf("Sex", "Color", "Breed", "Weight").forEach { header ->
                        Text(
                            text = header,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                // Table values
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    listOf(pet.sex, pet.color, pet.breed, pet.weight).forEach { value ->
                        Text(
                            text = value,
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }

            Divider(modifier = Modifier.padding(vertical = 8.dp))

            // Adoption section
            Text(
                text = "For Adoption",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp)
            )

            Text(
                text = "Foster Parent:",
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = pet.fosterParent,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // Description
            Text(
                text = pet.description,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            Divider(modifier = Modifier.padding(vertical = 8.dp))

            // Adopt button
            Button(
                onClick = {
                    navController.navigate("adoptionForm/${pet.name}")
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 16.dp)
            ) {
                Text("Adopt Me")
            }
        }
    }
}



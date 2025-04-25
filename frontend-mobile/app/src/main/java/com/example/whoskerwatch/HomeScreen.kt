package com.example.whoskerwatch

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

@Composable
fun HomeScreen(navController: NavController) {
    Scaffold(
        bottomBar = { BottomNavigationBar(navController) }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
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

            val categories = listOf("Dog", "Cat", "Turtle", "Bird", "Rabbit")
            LazyRow(
                modifier = Modifier.padding(bottom = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(categories) { category ->
                    CategoryChip(category = category)
                }
            }

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

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Available Pets",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp)
            )

            val pets = listOf(
                Pet(
                    name = "Samantha",
                    imageRes = R.drawable.cat_sample,
                    location = "California (2.5km)",
                    sex = "Male",
                    color = "Black",
                    breed = "Persian",
                    weight = "2kg",
                    fosterParent = "Steffani Wish",
                    description = "Beautiful Persian cat looking for a loving home"
                ),
                Pet(
                    name = "Tiger",
                    imageRes = R.drawable.cat_sample2,
                    location = "New York (1.2km)",
                    sex = "Male",
                    color = "Orange",
                    breed = "Tabby",
                    weight = "3kg",
                    fosterParent = "Michael Johnson",
                    description = "Playful tabby cat who loves attention"
                ),
                Pet(
                    name = "Christine",
                    imageRes = R.drawable.dog_sample,
                    location = "Texas (3.7km)",
                    sex = "Female",
                    color = "Brown",
                    breed = "Labrador",
                    weight = "15kg",
                    fosterParent = "Sarah Connor",
                    description = "Friendly labrador who gets along with everyone"
                ),
                Pet(
                    name = "Busker",
                    imageRes = R.drawable.dog_sample2,
                    location = "Florida (5.1km)",
                    sex = "Male",
                    color = "White",
                    breed = "Husky",
                    weight = "20kg",
                    fosterParent = "John Snow",
                    description = "Energetic husky who needs lots of exercise"
                )
            )

            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                pets.chunked(2).forEach { rowPets ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        rowPets.forEach { pet ->
                            PetCard(
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
fun PetCard(pet: Pet, modifier: Modifier = Modifier, navController: NavController) {
    Card(
        modifier = modifier
            .aspectRatio(1f)
            .clickable {
                navController.navigate("petDetail/${pet.name}")
            },
        shape = RoundedCornerShape(12.dp)
    ) {
        Column {
            Image(
                painter = painterResource(id = pet.imageRes),
                contentDescription = pet.name,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            )
            Text(
                text = pet.name,
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
            icon = { Icon(Icons.Default.Chat, contentDescription = "Chat") },
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
package com.example.whoskerwatch

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
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
fun AdoptionFormScreen(navController: NavController, petName: String?) {
    var fullName by remember { mutableStateOf("Andrew Ferguson") }
    var address by remember { mutableStateOf("Philippines") }
    var phoneNumber by remember { mutableStateOf("+14897889999") }
    var email by remember { mutableStateOf("yanchul@gmail.com") }
    var residenceType by remember { mutableStateOf("evfTbyVvCd") }

    // Get pet data based on petName (in a real app, you'd fetch this from your data source)
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
            description = "Beautiful Persian cat looking for a loving home"
        )
        "Tiger" -> Pet(
            name = "Tiger",
            imageRes = R.drawable.cat_sample2,
            location = "New York (1.2km)",
            sex = "Male",
            color = "Orange",
            breed = "Tabby",
            weight = "3kg",
            fosterParent = "Michael Johnson",
            description = "Playful tabby cat who loves attention"
        )
        else -> Pet(
            name = petName ?: "Unknown Pet",
            imageRes = R.drawable.dog_sample,
            location = "Unknown location",
            sex = "Unknown",
            color = "Unknown",
            breed = "Unknown",
            weight = "Unknown",
            fosterParent = "Unknown",
            description = "No description available"
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Adoption Form") },
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
            // Header with time and pet name
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "9:41", // Mock time
                    style = MaterialTheme.typography.bodyMedium
                )
                Text(
                    text = pet.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Pet image and basic info
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Image(
                    painter = painterResource(id = pet.imageRes),
                    contentDescription = pet.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(80.dp)
                        .clip(MaterialTheme.shapes.medium)
                )

                Column {
                    Text(
                        text = pet.breed,
                        style = MaterialTheme.typography.bodyMedium
                    )
                    Text(
                        text = "${pet.color}, ${pet.weight}",
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Form fields
            FormField(
                label = "Full Name",
                value = fullName,
                onValueChange = { fullName = it }
            )

            FormField(
                label = "Address",
                value = address,
                onValueChange = { address = it }
            )

            FormField(
                label = "Phone Number",
                value = phoneNumber,
                onValueChange = { phoneNumber = it }
            )

            FormField(
                label = "Email",
                value = email,
                onValueChange = { email = it }
            )

            FormField(
                label = "Type of Residence",
                value = residenceType,
                onValueChange = { residenceType = it }
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Submit button
            Button(
                onClick = {
                    // Handle form submission
                    navController.popBackStack()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
            ) {
                Text("Submit")
            }
        }
    }
}

@Composable
fun FormField(label: String, value: String, onValueChange: (String) -> Unit) {
    Column(modifier = Modifier.padding(vertical = 8.dp)) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 4.dp)
        )
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
    }
}
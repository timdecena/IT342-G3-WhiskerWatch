package com.example.whoskerwatch

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

data class ChatContact(val name: String, val lastMessage: String, val imageRes: Int)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen(navController: NavController) {
    val contacts = listOf(
        ChatContact("Jane Doe", "Is Max still available?", R.drawable.dog_sample),
        ChatContact("John Smith", "Can I meet Buddy today?", R.drawable.dog_sample2),
        ChatContact("Emily Rose", "I think I saw your lost dog!", R.drawable.cat_sample),
        ChatContact("Liam Carter", "I'll take the pup next week.", R.drawable.cat_sample2)
    )

    Scaffold(
        bottomBar = { BottomNavigationBar(navController) },
        topBar = {
            TopAppBar(
                title = { Text("Messages", fontWeight = FontWeight.Bold) }
            )
        }
    ) { padding ->
        LazyColumn(
            contentPadding = padding,
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp)
        ) {
            items(contacts) { contact ->
                ChatContactCard(contact)
            }
        }
    }
}

@Composable
fun ChatContactCard(contact: ChatContact) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
            .clickable { /* Navigate to detailed chat screen if needed */ },
        shape = MaterialTheme.shapes.medium,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Image(
                painter = painterResource(id = contact.imageRes),
                contentDescription = contact.name,
                modifier = Modifier
                    .size(50.dp)
                    .clip(CircleShape)
            )

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(contact.name, fontWeight = FontWeight.Bold)
                Text(
                    contact.lastMessage,
                    style = MaterialTheme.typography.bodyMedium,
                    maxLines = 1
                )
            }

            Icon(
                imageVector = Icons.Default.ArrowForward,
                contentDescription = "Go to chat"
            )
        }
    }
}

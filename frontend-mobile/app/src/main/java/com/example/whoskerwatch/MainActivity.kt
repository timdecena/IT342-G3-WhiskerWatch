package com.example.whoskerwatch

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.whoskerwatch.ui.LoginScreen
import com.example.whoskerwatch.ui.RegisterScreen
import com.example.whoskerwatch.ui.screens.PetDetailScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AppNavigation()
                }
            }
        }
    }
}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = "start"
    ) {
        composable("start") { StartingScreen(navController) }
        composable("login") { LoginScreen(navController) }
        composable("register") { RegisterScreen(navController) }
        composable("home") { HomeScreen(navController) }
        composable("lostandfound") { LostAndFoundScreen(navController) }
        composable("chat") { ChatScreen(navController) }
        composable("profile") { ProfileScreen(navController) }
        composable("crud") { PetCrudScreen(navController) }
        composable("add_pet") { AddPetScreen(navController) }


        composable(
            route = "petDetail/{petName}",
            arguments = listOf(navArgument("petName") { type = NavType.StringType })
        ) { backStackEntry ->
            PetDetailScreen(
                navController = navController,
                petName = backStackEntry.arguments?.getString("petName")
            )
        }

        composable("petCrud") { PetCrudScreen(navController) }

        composable(
            route = "adoptionForm/{petName}",
            arguments = listOf(navArgument("petName") { type = NavType.StringType })
        ) { backStackEntry ->
            AdoptionFormScreen(
                navController = navController,
                petName = backStackEntry.arguments?.getString("petName") ?: "Unknown"
            )
        }
    }
}

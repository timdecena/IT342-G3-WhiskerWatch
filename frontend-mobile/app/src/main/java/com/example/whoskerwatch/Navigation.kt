
package com.example.whoskerwatch

import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.whoskerwatch.ui.LoginScreen
import com.example.whoskerwatch.ui.RegisterScreen


@Composable
fun Navigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = "start"
    ) {
        composable("start") { StartingScreen(navController) }
        composable("login") { LoginScreen(navController) }
        composable("register") { RegisterScreen(navController) }
        composable("home") { HomeScreen(navController) }
        composable("profile") { ProfileScreen(navController) }
        composable("chat") { ChatScreen(navController) }
        composable("lostandfound") { LostAndFoundScreen(navController) }
        composable(
            "adoptionForm/{petName}",
            arguments = listOf(navArgument("petName") { type = NavType.StringType })
        ) { backStackEntry ->
            AdoptionFormScreen(
                navController = navController,
                petName = backStackEntry.arguments?.getString("petName")
            )
        }
        composable(
            "petDetail/{petName}",
            arguments = listOf(navArgument("petName") { type = NavType.StringType })
        ) { backStackEntry ->
            PetDetailScreen(
                navController = navController,
                petName = backStackEntry.arguments?.getString("petName")
            )

        }
    }
}
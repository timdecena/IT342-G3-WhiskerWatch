package edu.cit.whiskerwatch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class WhiskerwatchApplication {

	public static void main(String[] args) {
		SpringApplication.run(WhiskerwatchApplication.class, args);
	}

	/*
	 * @Bean
	 * public WebMvcConfigurer corsConfigurer() {
	 * return new WebMvcConfigurer() {
	 * 
	 * @Override
	 * public void addCorsMappings(CorsRegistry registry) {
	 * registry.addMapping("/**")
	 * .allowedOrigins("http://ec2-35-168-15-40.compute-1.amazonaws.com")
	 * .allowedMethods("*");
	 * }
	 * };
	 * } -Copied from deployed main branch
	 */

}

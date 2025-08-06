package com.language.LanguageApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class LanguageAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(LanguageAppApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**") // Allow all endpoints
						.allowedOrigins("http://localhost:5173") // Your React dev server
						.allowedMethods("*") // GET, POST, PUT, DELETE, etc.
						.allowedHeaders("*")
						.allowCredentials(true);
			}
		};
	}
}

# Builds the React frontend and the Spring Boot backend into a single image.
# Spring serves the built frontend from /static and the API under /api.

# 1) Frontend
FROM node:22-alpine AS frontend
WORKDIR /app
COPY LanguageApp-Frontend/package.json LanguageApp-Frontend/package-lock.json ./
RUN npm ci
COPY LanguageApp-Frontend/ ./
RUN npm run build

# 2) Backend, with the frontend build copied in as static resources
FROM eclipse-temurin:21-jdk AS backend
WORKDIR /app
COPY backend/mvnw backend/pom.xml ./
COPY backend/.mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw -q -B dependency:go-offline
COPY backend/src src
COPY --from=frontend /app/dist src/main/resources/static
RUN ./mvnw -q -B package -DskipTests

# 3) Runtime
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend /app/target/*.jar app.jar
EXPOSE 8080
# Keep the JVM within the container's memory limit (Render's free tier has 512 MB)
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]

# Stage 1: Build the Angular frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend

# Install dependencies first for Docker caching
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build -- --configuration production

# ----------------------------------------------------

# Stage 2: Build the Spring Boot backend
FROM maven:3.9.9-eclipse-temurin-17 AS backend-build
WORKDIR /app/backend

# Download Maven dependencies for Docker caching
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B

# Copy the backend source
COPY backend/src src

# **CRITICAL STEP**: Copy the compiled Angular frontend (from Stage 1) 
# exactly into the Spring Boot static resources folder! 
# This tells Spring Boot to host the HTML/CSS/JS frontend alongside the API.
COPY --from=frontend-build /app/frontend/dist/sentinel-frontend src/main/resources/static/

# Package the Spring Boot app into a fat JAR
RUN mvn clean package -DskipTests

# ----------------------------------------------------

# Stage 3: Minimal Java Runtime Environment
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the fat JAR from the backend-build stage
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Expose the default port (Render will inject a $PORT environment variable)
EXPOSE 8081

# Run the app. We aggressively override the server.port property with Render's assigned $PORT.
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8081} -jar app.jar"]

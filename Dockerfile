FROM eclipse-temurin:21-jre-alpine

# Expose port
EXPOSE 8080

# Set working directory
WORKDIR /app

# Copy the jar file
COPY backend/target/app.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

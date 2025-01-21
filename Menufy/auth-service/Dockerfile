# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the application JAR file
COPY target/auth-service-1.0.0.jar auth-service.jar

# Set environment variables for the database connection
ENV DB_HOST=menufy-db
ENV DB_PORT=3306
ENV DB_SCHEMA=auth_schema
ENV DB_USER=root
ENV DB_PASSWORD=rootpassword

# Expose the application port
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "auth-service.jar"]

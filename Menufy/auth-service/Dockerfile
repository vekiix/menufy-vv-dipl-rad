# Use an official OpenJDK runtime as a parent image
# Use a JDK 21 base image
FROM eclipse-temurin:21-jdk-alpine

# Set working directory
WORKDIR /app

# Copy dependencies and build the app
COPY . /app
RUN ./mvnw clean package -DskipTests

# Run the application
ENTRYPOINT ["java", "-jar", "target/auth-service-1.0.0.jar"]


# Multi-stage build for Java 22 + Maven
FROM maven:3.9.8-eclipse-temurin-22 AS build
WORKDIR /app

# Copy pom and download dependencies first (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source and data
COPY src ./src
COPY data ./data

# Build fat JAR with shade plugin
RUN mvn clean package -DskipTests

# Runtime image (lightweight JRE 22)
FROM eclipse-temurin:22-jre-jammy
WORKDIR /app

# Copy persistent XML data directory
COPY data ./data

# Copy frontend assets to filesystem (guarantees StaticFileHandler finds them)
COPY src/frontend ./src/frontend

# Copy built application jar from build stage
COPY --from=build /app/target/food-delivery-app-1.0.0.jar app.jar

# Render injects PORT env variable (defaults to 8080 if running locally)
ENV PORT=8080
EXPOSE 8080

CMD ["java", "-jar", "app.jar"]

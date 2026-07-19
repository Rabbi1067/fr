# Build Stage
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Cache dependencies separately for faster rebuilds
COPY pom.xml .
RUN mvn -B dependency:go-offline || true

COPY . .

RUN mvn -B clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Render injects the PORT env var at runtime (usually 10000).
# The app already reads ${PORT:80} from application.properties,
# so no hardcoding is needed here.
EXPOSE 10000

ENTRYPOINT ["java", "-Xmx384m", "-jar", "app.jar"]

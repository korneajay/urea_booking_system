# Build stage
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY backend/pom.xml ./backend/
# pre-fetch dependencies to speed up builds
RUN mvn -f backend/pom.xml dependency:go-offline -B
COPY backend/src ./backend/src/
# build package without running tests
RUN mvn -f backend/pom.xml clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/target/kisanurea-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

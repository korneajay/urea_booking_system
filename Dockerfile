# Build stage
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY backend ./backend/
# build package without running tests
RUN mvn -f backend/pom.xml clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/kisanurea-gateway/target/kisanurea-gateway-0.0.1-SNAPSHOT.jar gateway.jar
COPY --from=build /app/backend/auth-service/target/auth-service-0.0.1-SNAPSHOT.jar auth.jar
COPY --from=build /app/backend/farmer-service/target/farmer-service-0.0.1-SNAPSHOT.jar farmer.jar
COPY --from=build /app/backend/dealer-service/target/dealer-service-0.0.1-SNAPSHOT.jar dealer.jar
COPY --from=build /app/backend/booking-service/target/booking-service-0.0.1-SNAPSHOT.jar booking.jar
COPY --from=build /app/backend/start.sh start.sh
RUN chmod +x start.sh
EXPOSE 8080
ENTRYPOINT ["./start.sh"]

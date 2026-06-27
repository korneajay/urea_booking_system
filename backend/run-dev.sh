#!/bin/bash
# Compiles the KisanUrea parent project and starts all microservices + gateway.

cd "$(dirname "$0")"

echo "Building KisanUrea Backend Services..."
mvn clean package -DskipTests

if [ $? -ne 0 ]; then
    echo "Maven build failed!"
    exit 1
fi

echo "Cleaning up existing processes on ports 8080-8084..."
for port in 8080 8081 8082 8083 8084; do
    pid=$(lsof -t -i:$port)
    if [ ! -z "$pid" ]; then
        echo "Killing process $pid on port $port..."
        kill -9 $pid 2>/dev/null
    fi
done

JVM_ARGS="-XX:TieredStopAtLevel=1 -Xmx64m -Xms64m -XX:+UseSerialGC"

echo "Starting auth-service on port 8081..."
java $JVM_ARGS -jar auth-service/target/auth-service-0.0.1-SNAPSHOT.jar > auth.log 2>&1 &

echo "Starting farmer-service on port 8082..."
java $JVM_ARGS -jar farmer-service/target/farmer-service-0.0.1-SNAPSHOT.jar > farmer.log 2>&1 &

echo "Starting dealer-service on port 8083..."
java $JVM_ARGS -jar dealer-service/target/dealer-service-0.0.1-SNAPSHOT.jar > dealer.log 2>&1 &

echo "Starting booking-service on port 8084..."
java $JVM_ARGS -jar booking-service/target/booking-service-0.0.1-SNAPSHOT.jar > booking.log 2>&1 &

echo "Starting API Gateway on port 8080..."
java $JVM_ARGS -jar kisanurea-gateway/target/kisanurea-gateway-0.0.1-SNAPSHOT.jar

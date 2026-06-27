#!/bin/sh
# Start services with optimized low-memory flags
JVM_ARGS="-XX:TieredStopAtLevel=1 -Xmx64m -Xms64m -XX:+UseSerialGC"

echo "Starting Auth Service..."
java $JVM_ARGS -jar auth.jar &

echo "Starting Farmer Service..."
java $JVM_ARGS -jar farmer.jar &

echo "Starting Dealer Service..."
java $JVM_ARGS -jar dealer.jar &

echo "Starting Booking Service..."
java $JVM_ARGS -jar booking.jar &

# Run gateway in foreground so container stays alive
echo "Starting Gateway..."
exec java $JVM_ARGS -jar gateway.jar

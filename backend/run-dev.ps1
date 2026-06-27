# Compiles the KisanUrea parent project and starts all microservices + gateway.

Set-Location $PSScriptRoot

Write-Host "Building KisanUrea Backend Services..." -ForegroundColor Green
mvn clean package -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Error "Maven build failed!"
    exit 1
}

Write-Host "Starting Services with memory-optimized settings..." -ForegroundColor Green

# Kill existing java processes on these ports to avoid port collision
$ports = 8080, 8081, 8082, 8083, 8084
foreach ($port in $ports) {
    $proc = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($proc) {
        $pidToKill = $proc.OwningProcess[0]
        Write-Host "Killing process $pidToKill using port $port..." -ForegroundColor Yellow
        Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
    }
}

# Start all microservices in background using optimized JVM settings
$jvmArgs = "-XX:TieredStopAtLevel=1 -Xmx64m -Xms64m -XX:+UseSerialGC"

Write-Host "Starting auth-service on port 8081..." -ForegroundColor Cyan
Start-Process java -ArgumentList "$jvmArgs -jar auth-service/target/auth-service-0.0.1-SNAPSHOT.jar" -NoNewWindow

Write-Host "Starting farmer-service on port 8082..." -ForegroundColor Cyan
Start-Process java -ArgumentList "$jvmArgs -jar farmer-service/target/farmer-service-0.0.1-SNAPSHOT.jar" -NoNewWindow

Write-Host "Starting dealer-service on port 8083..." -ForegroundColor Cyan
Start-Process java -ArgumentList "$jvmArgs -jar dealer-service/target/dealer-service-0.0.1-SNAPSHOT.jar" -NoNewWindow

Write-Host "Starting booking-service on port 8084..." -ForegroundColor Cyan
Start-Process java -ArgumentList "$jvmArgs -jar booking-service/target/booking-service-0.0.1-SNAPSHOT.jar" -NoNewWindow

Write-Host "Starting API Gateway on port 8080..." -ForegroundColor Cyan
# Run the gateway in foreground so the terminal stays active and we can see logs
java -XX:TieredStopAtLevel=1 -Xmx64m -Xms64m -XX:+UseSerialGC -jar kisanurea-gateway/target/kisanurea-gateway-0.0.1-SNAPSHOT.jar

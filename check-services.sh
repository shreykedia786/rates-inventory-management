#!/bin/bash

echo "🔍 Checking Rates & Inventory Platform Services..."
echo ""

# Check Backend
echo "📡 Backend API (http://localhost:8000):"
if curl -s -f http://localhost:8000/api/docs > /dev/null; then
    echo "✅ Backend is running and responding"
    echo "   📚 API Documentation: http://localhost:8000/api/docs"
else
    echo "❌ Backend is not responding"
fi

echo ""

# Check Frontend on multiple ports
echo "🖥️  Frontend App:"
FRONTEND_PORTS=(3000 3001)
FRONTEND_RUNNING=false

for port in "${FRONTEND_PORTS[@]}"; do
    if curl -s -I http://localhost:$port | grep -q "HTTP/1.1"; then
        echo "✅ Frontend is running on port $port"
        echo "   🌐 Application: http://localhost:$port"
        FRONTEND_RUNNING=true
    fi
done

if [ "$FRONTEND_RUNNING" = false ]; then
    echo "❌ Frontend is not responding on any port"
fi

echo ""

# Check processes
echo "🔄 Running Processes:"
BACKEND_PID=$(ps aux | grep "ts-node src/main-dev.ts" | grep -v grep | awk '{print $2}')
FRONTEND_PIDS=$(ps aux | grep "vite --host" | grep -v grep | awk '{print $2}')

if [ ! -z "$BACKEND_PID" ]; then
    echo "✅ Backend process running (PID: $BACKEND_PID)"
else
    echo "❌ Backend process not found"
fi

if [ ! -z "$FRONTEND_PIDS" ]; then
    echo "✅ Frontend process(es) running (PIDs: $FRONTEND_PIDS)"
else
    echo "❌ Frontend process not found"
fi

echo ""

# Show active ports
echo "🔌 Active Ports:"
netstat -an | grep LISTEN | grep -E "(3000|3001|8000)" | while read line; do
    port=$(echo $line | awk '{print $4}' | cut -d'.' -f2)
    echo "   Port $port: Listening"
done

echo ""
echo "🚀 Platform Status Summary:"
echo "   Backend API:  http://localhost:8000/api/docs"
echo "   Frontend App: http://localhost:3000 (or http://localhost:3001)"
echo ""
echo "💡 If you get 'page can't be found', try:"
echo "   - http://localhost:3000 (main frontend)"
echo "   - http://localhost:3001 (backup frontend)"
echo "   - http://localhost:8000/api/docs (API documentation)" 
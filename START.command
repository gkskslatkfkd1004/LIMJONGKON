#!/bin/bash
cd "$(dirname "$0")"
echo "Starting JONGKON LIM Portfolio..."
# Check if python3 is available
if command -v python3 &> /dev/null; then
    # Start server in background
    python3 -m http.server 8080 &
    PID=$!
    echo "Server started with PID $PID"
    sleep 1
    # Open Google Chrome
    open -a "Google Chrome" "http://localhost:8080"
    
    echo "Press Ctrl+C to stop the server."
    wait $PID
else
    echo "Python3 not found. Please install Python or use another web server."
fi

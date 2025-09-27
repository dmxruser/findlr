#!/bin/bash

# Function to clean up background processes on exit
cleanup() {
    echo "Stopping servers..."
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID
    fi
    exit
}

# Trap SIGINT (Ctrl+C) and call the cleanup function
trap cleanup SIGINT

# Start backend
echo "Starting backend server..."
(cd backend && venv/bin/uvicorn app.main:app --reload) &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Start frontend
echo "Starting frontend server..."
(cd frontend && npm start) &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

echo "Both servers are running. Press Ctrl+C to stop them."

# Wait for any process to exit
wait -n

# Call cleanup function to terminate the other process
cleanup

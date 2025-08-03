#!/bin/bash

# Start Flask backend
echo "Starting Flask backend on port 5001..."
python3 run_flask.py &

# Start React frontend
echo "Starting React frontend on port 3000..."
npm run dev

#!/usr/bin/env python3
"""
PlayWise Flask Application Runner
Starts the PlayWise backend server with all data structures initialized.
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import and run the Flask app
from backend.app import app, socketio

if __name__ == '__main__':
    print("🎵 PlayWise - Smart Music Playlist Management System")
    print("=" * 60)
    print("🚀 Starting Flask Backend Server...")
    print("📊 Data Structures Implemented:")
    print("   • Doubly Linked List (Playlist Engine)")
    print("   • Binary Search Tree (Song Ratings)")  
    print("   • Stack (Playback History)")
    print("   • HashMap (Song Lookup)")
    print("   • HashSet (Artist Blocklist)")
    print("   • Merge/Quick Sort (Playlist Sorting)")
    print("=" * 60)
    print("🌐 Server will start on: http://0.0.0.0:5001")
    print("🔌 WebSocket support enabled for real-time updates")
    print("📱 Frontend should connect to: http://localhost:5001")
    print("=" * 60)
    
    try:
        # Run Flask with SocketIO
        socketio.run(
            app,
            host='0.0.0.0',
            port=5001,
            debug=True,
            allow_unsafe_werkzeug=True
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        sys.exit(1)
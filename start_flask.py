#!/usr/bin/env python3
"""
PlayWise Flask Application Starter
Simple script to run the Flask backend server
"""

import subprocess
import sys
import os

def main():
    print("🎵 PlayWise - Smart Music Playlist Management System")
    print("🚀 Starting Flask Backend Server...")
    
    # Change to backend directory
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    
    try:
        # Run Flask app
        subprocess.run([sys.executable, '-m', 'flask', '--app', 'app', 'run', '--host=0.0.0.0', '--port=5000', '--debug'], 
                      cwd=backend_dir, check=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        print("Trying alternative method...")
        
        try:
            # Try running app.py directly
            subprocess.run([sys.executable, 'app.py'], cwd=backend_dir, check=True)
        except Exception as e2:
            print(f"❌ Alternative method failed: {e2}")
            sys.exit(1)

if __name__ == '__main__':
    main()
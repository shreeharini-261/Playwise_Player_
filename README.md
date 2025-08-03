# PlayWise - Smart Music Playlist Management System

A full-stack music playlist management application built with **Flask (Python)** backend and **React (TypeScript)** frontend, implementing advanced data structures and algorithms.

## 🎯 Project Overview

PlayWise demonstrates the practical implementation of core computer science data structures and algorithms in a real-world music application:

- **Doubly Linked List** - Playlist management with O(1) insertions
- **Binary Search Tree** - Song rating system for efficient search
- **Stack** - Playback history with undo functionality  
- **HashMap** - Instant song lookup by ID/title
- **HashSet** - Artist blocklist for content filtering
- **Sorting Algorithms** - Merge/Quick sort for playlist organization

## 🏗️ Architecture

### Backend (Python/Flask)
```
backend/
├── app.py                 # Main Flask application
├── models/
│   └── song.py           # Song data model
└── core/
    ├── playlist_engine.py     # Doubly Linked List implementation
    ├── song_rating_tree.py    # Binary Search Tree for ratings
    ├── playback_history.py    # Stack for play history
    ├── song_lookup.py         # HashMap for instant lookup
    ├── artist_blocklist.py    # HashSet for blocked artists
    └── sorting_algorithms.py  # Advanced sorting implementations
```

### Frontend (React/TypeScript)
```
client/
├── src/
│   ├── components/           # UI components
│   ├── pages/               # Application pages
│   └── lib/                 # Utility libraries
└── public/                  # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 20+
- Flask and related packages
- React development environment

### Installation & Setup

1. **Clone and navigate to the project:**
   ```bash
   cd playwise-project
   ```

2. **Install Python dependencies:**
   ```bash
   # Install Flask and dependencies (already done in Replit)
   pip install Flask Flask-CORS flask-socketio
   ```

3. **Install Node.js dependencies:**
   ```bash
   # Install frontend packages (already done in Replit)
   npm install
   ```

### Running the Application

#### Method 1: Using the Replit Workflow (Recommended)
1. Click the "Run" button in Replit
2. This starts both frontend and backend automatically
3. Access the app at the provided Replit URL

#### Method 2: Manual Startup
1. **Start the Flask Backend:**
   ```bash
   python run_flask.py
   ```
   Backend will run on: http://localhost:5000

2. **Start the React Frontend:**
   ```bash
   npm run dev
   ```
   Frontend will run on: http://localhost:3000

3. **Access the Application:**
   Open http://localhost:3000 in your browser

## 🎵 Features

### 1. Playlist Management (Doubly Linked List)
- Add songs to playlist: **O(1)** at head/tail
- Delete songs: **O(n)** at arbitrary position
- Move songs: **O(n)** between positions
- Reverse playlist: **O(n)** operation
- Real-time updates via WebSocket

### 2. Song Rating System (Binary Search Tree)
- Rate songs 1-5 stars: **O(log n)** insertion
- Search by rating: **O(log n)** lookup
- Multiple songs per rating bucket
- Rating distribution analytics

### 3. Playback History (Stack)
- LIFO playback tracking: **O(1)** push/pop
- Undo last played song
- Most played songs analysis
- Memory-efficient with size limits

### 4. Instant Song Lookup (HashMap)
- Search by song ID: **O(1)** lookup
- Search by title: **O(1)** exact, **O(n)** partial
- Fuzzy search with relevance scoring
- Artist-based filtering

### 5. Artist Blocklist (HashSet)
- Block/unblock artists: **O(1)** operations
- Automatic song filtering during addition
- Bulk operations support
- Case-insensitive matching

### 6. Advanced Sorting (Multiple Algorithms)
- **Merge Sort**: Stable, **O(n log n)** for titles/artists
- **Quick Sort**: In-place, **O(n log n)** average for durations
- **Insertion Sort**: **O(n²)** optimized for small datasets
- **Hybrid Sort**: Algorithm selection based on data size
- Multi-criteria sorting support

## 🔌 API Endpoints

### Playlist Operations
- `POST /api/songs` - Add song to playlist
- `DELETE /api/songs/<index>` - Delete song at index
- `POST /api/songs/move` - Move song between positions
- `POST /api/playlist/reverse` - Reverse entire playlist
- `POST /api/playlist/sort` - Sort by criteria

### Rating System
- `POST /api/ratings` - Rate a song
- `GET /api/ratings/<rating>` - Get songs by rating
- `GET /api/ratings/<song_id>` - Get song rating

### Playback History
- `POST /api/history/play` - Record song play
- `POST /api/history/undo` - Undo last play
- `GET /api/history` - Get play history

### Artist Blocklist
- `POST /api/blocklist` - Add artist to blocklist
- `DELETE /api/blocklist/<artist>` - Remove from blocklist
- `GET /api/blocklist` - Get blocked artists

### Search & Analytics
- `GET /api/search/<query>` - Search songs
- `GET /api/snapshot` - Get system analytics
- `GET /api/health` - Health check

## 📊 Performance Analysis

| Operation | Data Structure | Time Complexity | Space Complexity |
|-----------|---------------|-----------------|------------------|
| Add Song | Doubly Linked List | O(1) | O(1) |
| Search by Rating | Binary Search Tree | O(log n) | O(1) |
| Undo Play | Stack | O(1) | O(1) |
| Song Lookup | HashMap | O(1) | O(1) |
| Check Blocked | HashSet | O(1) | O(1) |
| Sort Playlist | Merge/Quick Sort | O(n log n) | O(n)/O(log n) |

## 🧪 Testing the Features

### Test Playlist Operations:
1. Add multiple songs with different artists/durations
2. Try moving songs between positions
3. Reverse the playlist and observe changes
4. Sort by different criteria (title, artist, duration)

### Test Rating System:
1. Rate songs with 1-5 stars
2. Search for songs by specific ratings
3. View rating distribution in analytics

### Test Playback History:
1. "Play" several songs to build history
2. Use undo feature to remove last played
3. Check most played songs statistics

### Test Artist Blocklist:
1. Add artists to blocklist
2. Try adding songs by blocked artists (should fail)
3. Remove artists from blocklist

### Test Search & Analytics:
1. Search songs by title/artist
2. View real-time analytics dashboard
3. Check system performance statistics

## 🔧 Development Notes

### Data Structure Implementations
- All core data structures are implemented from scratch in Python
- No reliance on built-in high-level abstractions
- Comprehensive time/space complexity documentation
- Memory-efficient algorithms with optimization considerations

### Real-time Features
- WebSocket integration for live updates
- Frontend automatically reflects backend changes
- Synchronized state between multiple clients

### Error Handling
- Comprehensive input validation
- Graceful error responses
- Automatic data consistency maintenance

## 📈 Future Enhancements

- **Self-balancing BST** for guaranteed O(log n) performance
- **Graph algorithms** for music recommendation
- **Trie data structure** for autocomplete search
- **Bloom filters** for memory-efficient duplicate detection
- **MinHeap/MaxHeap** for top-K song queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement with proper data structure documentation
4. Add comprehensive tests
5. Submit a pull request

## 📄 License

This project is for educational purposes, demonstrating advanced data structures and algorithms in a practical application.

---

**Built with ❤️ for Computer Science Education**
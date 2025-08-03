"""
PlayWise Flask Backend - Main Application Entry Point
A smart music playlist management system with advanced data structures.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
import sys
import json
from datetime import datetime

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.playlist_engine import PlaylistEngine
from core.song_rating_tree import SongRatingTree
from core.playback_history import PlaybackHistory
from core.song_lookup import SongLookup
from core.sorting_algorithms import PlaylistSorter
from core.artist_blocklist import ArtistBlocklist
from models.song import Song

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'playwise-secret-key-2024'
CORS(app, origins=["*"])
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize PlayWise core components
playlist_engine = PlaylistEngine()
rating_tree = SongRatingTree()
playback_history = PlaybackHistory()
song_lookup = SongLookup()
playlist_sorter = PlaylistSorter()
artist_blocklist = ArtistBlocklist()


def get_system_snapshot():
    """
    Generate a complete system snapshot for the dashboard.
    Integrates multiple data structures for real-time analytics.
    
    Time Complexity: O(n log n) due to sorting operations
    Space Complexity: O(n) for temporary data structures
    """
    songs = playlist_engine.get_all_songs()

    # Get top 5 longest songs (using sorting algorithm)
    longest_songs = playlist_sorter.sort_by_duration(songs, reverse=True)[:5]

    # Get recently played songs from stack
    recent_plays = playback_history.get_recent_history(10)

    # Get song count by rating from BST
    rating_distribution = {}
    for rating in range(1, 6):
        rating_distribution[rating] = len(rating_tree.search_by_rating(rating))

    # Calculate total play duration
    total_duration = sum(song.duration for song in songs)

    # Get blocked artists count
    blocked_count = len(artist_blocklist.get_blocked_artists())

    return {
        'songs': [song.to_dict() for song in songs],
        'history': [song.to_dict() for song in recent_plays],
        'ratings': rating_tree.get_all_ratings(),
        'blockedArtists': artist_blocklist.get_blocked_artists(),
        'analytics': {
            'totalSongs': len(songs),
            'totalDuration': total_duration,
            'longestSongs': [song.to_dict() for song in longest_songs],
            'ratingDistribution': rating_distribution,
            'totalPlays': playback_history.get_total_plays(),
            'blockedArtistsCount': blocked_count
        },
        'timestamp': datetime.now().isoformat()
    }


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'PlayWise Backend'})


@app.route('/api/snapshot', methods=['GET'])
def get_snapshot():
    """Get complete system snapshot"""
    try:
        snapshot = get_system_snapshot()
        return jsonify(snapshot)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============= PLAYLIST OPERATIONS =============


@app.route('/api/songs', methods=['POST'])
def add_song():
    """
    Add a new song to the playlist
    Implements artist blocklist checking and song lookup synchronization
    """
    try:
        data = request.get_json()
        title = data.get('title')
        artist = data.get('artist')
        duration = data.get('duration')

        if not all([title, artist, duration]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Check artist blocklist (O(1) HashSet lookup)
        if artist_blocklist.is_blocked(artist):
            return jsonify({'error': f'Artist "{artist}" is blocked'}), 403

        # Create and add song
        song = Song(title=title, artist=artist, duration=duration)
        playlist_engine.add_song(song)

        # Sync with song lookup HashMap
        song_lookup.add_song(song)

        # Emit real-time update
        socketio.emit('song_added', song.to_dict())

        return jsonify({
            'message': 'Song added successfully',
            'song': song.to_dict()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/songs/<int:index>', methods=['DELETE'])
def delete_song(index):
    """Delete song at specific index"""
    try:
        song = playlist_engine.delete_song(index)
        if song:
            # Remove from lookup
            song_lookup.remove_song(song.id)
            # Remove from rating tree
            rating_tree.delete_song(song.id)

            socketio.emit('song_deleted', {
                'index': index,
                'song': song.to_dict()
            })
            return jsonify({'message': 'Song deleted successfully'})
        else:
            return jsonify({'error': 'Invalid index'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/songs/move', methods=['POST'])
def move_song():
    """Move song from one position to another"""
    try:
        data = request.get_json()
        from_index = data.get('fromIndex')
        to_index = data.get('toIndex')

        if playlist_engine.move_song(from_index, to_index):
            socketio.emit('song_moved', {
                'fromIndex': from_index,
                'toIndex': to_index
            })
            return jsonify({'message': 'Song moved successfully'})
        else:
            return jsonify({'error': 'Invalid indices'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/playlist/reverse', methods=['POST'])
def reverse_playlist():
    """Reverse the entire playlist"""
    try:
        playlist_engine.reverse_playlist()
        socketio.emit('playlist_reversed')
        return jsonify({'message': 'Playlist reversed successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/playlist/sort', methods=['POST'])
def sort_playlist():
    """Sort playlist by specified criteria"""
    try:
        data = request.get_json()
        criteria = data.get('criteria', 'title')  # title, duration, artist
        reverse = data.get('reverse', False)

        songs = playlist_engine.get_all_songs()

        if criteria == 'title':
            sorted_songs = playlist_sorter.sort_by_title(songs, reverse)
        elif criteria == 'duration':
            sorted_songs = playlist_sorter.sort_by_duration(songs, reverse)
        elif criteria == 'artist':
            sorted_songs = playlist_sorter.sort_by_artist(songs, reverse)
        else:
            return jsonify({'error': 'Invalid sort criteria'}), 400

        # Update playlist with sorted order
        playlist_engine.clear()
        for song in sorted_songs:
            playlist_engine.add_song(song)

        socketio.emit('playlist_sorted', {
            'criteria': criteria,
            'reverse': reverse
        })
        return jsonify({'message': f'Playlist sorted by {criteria}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============= PLAYBACK HISTORY OPERATIONS =============


@app.route('/api/history/play', methods=['POST'])
def play_song():
    """Record a song play in history stack"""
    try:
        data = request.get_json()
        song_id = data.get('songId')

        song = song_lookup.get_song(song_id)
        if not song:
            return jsonify({'error': 'Song not found'}), 404

        playback_history.add_to_history(song)
        socketio.emit('song_played', song.to_dict())

        return jsonify({'message': 'Song played', 'song': song.to_dict()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/history/undo', methods=['POST'])
def undo_last_play():
    """Undo last played song using stack LIFO operation"""
    try:
        last_song = playback_history.undo_last_play()
        if last_song:
            socketio.emit('play_undone', last_song.to_dict())
            return jsonify({
                'message': 'Last play undone',
                'song': last_song.to_dict()
            })
        else:
            return jsonify({'error': 'No songs in history to undo'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/history', methods=['GET'])
def get_history():
    """Get play history"""
    try:
        history = playback_history.get_recent_history(50)
        return jsonify([song.to_dict() for song in history])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============= RATING SYSTEM OPERATIONS =============


@app.route('/api/ratings', methods=['POST'])
def rate_song():
    """Rate a song using BST structure"""
    try:
        data = request.get_json()
        song_id = data.get('songId')
        rating = data.get('rating')

        if rating < 1 or rating > 5:
            return jsonify({'error': 'Rating must be between 1-5'}), 400

        song = song_lookup.get_song(song_id)
        if not song:
            return jsonify({'error': 'Song not found'}), 404

        rating_tree.insert_song(song, rating)
        socketio.emit('song_rated', {'songId': song_id, 'rating': rating})

        return jsonify({'message': 'Song rated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/ratings/<int:rating>', methods=['GET'])
def get_songs_by_rating(rating):
    """Search songs by rating using BST"""
    try:
        if rating < 1 or rating > 5:
            return jsonify({'error': 'Rating must be between 1-5'}), 400

        songs = rating_tree.search_by_rating(rating)
        return jsonify([song.to_dict() for song in songs])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/ratings/<song_id>', methods=['GET'])
def get_song_rating(song_id):
    """Get rating for a specific song"""
    try:
        rating = rating_tree.get_song_rating(song_id)
        return jsonify({'songId': song_id, 'rating': rating})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============= ARTIST BLOCKLIST OPERATIONS =============


@app.route('/api/blocklist', methods=['POST'])
def add_to_blocklist():
    """Add artist to blocklist using HashSet"""
    try:
        data = request.get_json()
        artist = data.get('artist')

        if not artist:
            return jsonify({'error': 'Artist name required'}), 400

        artist_blocklist.add_artist(artist)
        socketio.emit('artist_blocked', {'artist': artist})

        return jsonify({'message': f'Artist "{artist}" added to blocklist'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/blocklist/<artist>', methods=['DELETE'])
def remove_from_blocklist(artist):
    """Remove artist from blocklist"""
    try:
        artist_blocklist.remove_artist(artist)
        socketio.emit('artist_unblocked', {'artist': artist})

        return jsonify(
            {'message': f'Artist "{artist}" removed from blocklist'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/blocklist', methods=['GET'])
def get_blocklist():
    """Get all blocked artists"""
    try:
        blocked_artists = artist_blocklist.get_blocked_artists()
        return jsonify(blocked_artists)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============= SONG LOOKUP OPERATIONS =============


@app.route('/api/search/<query>', methods=['GET'])
def search_songs(query):
    """Search songs by title or ID using HashMap"""
    try:
        results = song_lookup.search_by_title(query)
        return jsonify([song.to_dict() for song in results])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============= WEBSOCKET EVENTS =============


@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print('Client connected')
    emit('connected', {'status': 'Connected to PlayWise Backend'})


@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print('Client disconnected')


@socketio.on('request_snapshot')
def handle_snapshot_request():
    """Handle real-time snapshot request"""
    snapshot = get_system_snapshot()
    emit('snapshot_update', snapshot)


if __name__ == '__main__':
    print("🎵 Starting PlayWise Backend Server...")
    print("📊 Data Structures Initialized:")
    print("   • Doubly Linked List (Playlist Engine)")
    print("   • Binary Search Tree (Song Ratings)")
    print("   • Stack (Playback History)")
    print("   • HashMap (Song Lookup)")
    print("   • HashSet (Artist Blocklist)")
    print("   • Merge Sort (Playlist Sorting)")

    # Run with SocketIO support
    socketio.run(app,
                 host='0.0.0.0',
                 port=5001,
                 debug=True,
                 allow_unsafe_werkzeug=True,
                 use_reloader=False,
                 log_output=True)

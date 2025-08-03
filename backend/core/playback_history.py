"""
Playback History - Stack Implementation
Manages user's listening history with LIFO operations for undo functionality.
"""

from typing import Optional, List
import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.song import Song


class PlaybackHistory:
    """
    Stack-based implementation for managing playback history.
    Supports undo operations and memory-efficient history tracking.
    
    Features:
    - LIFO (Last In, First Out) operations
    - Maximum capacity with automatic cleanup
    - Fast push/pop operations: O(1)
    """
    
    def __init__(self, max_capacity: int = 50):
        """
        Initialize playback history stack.
        
        Args:
            max_capacity: Maximum number of songs to keep in history
            
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        self.history_stack: List[Song] = []
        self.max_capacity = max_capacity
        self.total_plays = 0
    
    def add_to_history(self, song: Song) -> None:
        """
        Add song to playback history (push operation).
        
        Args:
            song: Song that was played
            
        Time Complexity: O(1) amortized
        Space Complexity: O(1)
        """
        if not song:
            return
        
        # Push to stack
        self.history_stack.append(song)
        self.total_plays += 1
        
        # Maintain maximum capacity (memory management)
        if len(self.history_stack) > self.max_capacity:
            # Remove oldest entry (bottom of stack)
            self.history_stack.pop(0)
    
    def undo_last_play(self) -> Optional[Song]:
        """
        Undo last played song (pop operation).
        
        Returns:
            Last played song or None if history is empty
            
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        if not self.history_stack:
            return None
        
        # Pop from stack (LIFO)
        return self.history_stack.pop()
    
    def get_last_played(self) -> Optional[Song]:
        """
        Peek at last played song without removing it.
        
        Returns:
            Last played song or None if history is empty
            
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        if not self.history_stack:
            return None
        
        return self.history_stack[-1]
    
    def get_recent_history(self, count: int = 10) -> List[Song]:
        """
        Get recent songs from history (top of stack).
        
        Args:
            count: Number of recent songs to retrieve
            
        Returns:
            List of recent songs (most recent first)
            
        Time Complexity: O(k) where k = min(count, stack_size)
        Space Complexity: O(k)
        """
        if not self.history_stack:
            return []
        
        # Get last 'count' songs (most recent first)
        return self.history_stack[-count:][::-1]
    
    def get_full_history(self) -> List[Song]:
        """
        Get complete playback history.
        
        Returns:
            Complete history (most recent first)
            
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        return self.history_stack[::-1]
    
    def clear_history(self) -> None:
        """
        Clear all playback history.
        
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        self.history_stack.clear()
    
    def get_history_size(self) -> int:
        """
        Get number of songs in history.
        
        Returns:
            Number of songs in history
            
        Time Complexity: O(1)
        """
        return len(self.history_stack)
    
    def get_total_plays(self) -> int:
        """
        Get total number of plays (including those removed from stack).
        
        Returns:
            Total play count
            
        Time Complexity: O(1)
        """
        return self.total_plays
    
    def is_empty(self) -> bool:
        """
        Check if history is empty.
        
        Returns:
            True if empty, False otherwise
            
        Time Complexity: O(1)
        """
        return len(self.history_stack) == 0
    
    def get_most_played_songs(self, count: int = 5) -> List[dict]:
        """
        Analyze history to find most frequently played songs.
        
        Args:
            count: Number of top songs to return
            
        Returns:
            List of songs with play counts
            
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        if not self.history_stack:
            return []
        
        # Count song occurrences
        song_counts = {}
        for song in self.history_stack:
            song_id = song.id
            if song_id in song_counts:
                song_counts[song_id]['count'] += 1
            else:
                song_counts[song_id] = {
                    'song': song,
                    'count': 1
                }
        
        # Sort by count and return top songs
        sorted_songs = sorted(
            song_counts.values(),
            key=lambda x: x['count'],
            reverse=True
        )
        
        return [
            {
                'song': item['song'].to_dict(),
                'playCount': item['count']
            }
            for item in sorted_songs[:count]
        ]
    
    def get_recent_artists(self, count: int = 5) -> List[dict]:
        """
        Get most recently played artists with play counts.
        
        Args:
            count: Number of recent songs to analyze
            
        Returns:
            List of artists with play counts
            
        Time Complexity: O(k) where k = min(count, stack_size)
        Space Complexity: O(k)
        """
        recent_songs = self.get_recent_history(count)
        
        if not recent_songs:
            return []
        
        # Count artist occurrences in recent history
        artist_counts = {}
        for song in recent_songs:
            artist = song.artist
            artist_counts[artist] = artist_counts.get(artist, 0) + 1
        
        # Sort by count
        sorted_artists = sorted(
            artist_counts.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        return [
            {
                'artist': artist,
                'playCount': count
            }
            for artist, count in sorted_artists
        ]
    
    def get_listening_patterns(self) -> dict:
        """
        Analyze listening patterns from history.
        
        Returns:
            Dictionary with listening analytics
            
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        if not self.history_stack:
            return {
                'totalListeningTime': 0,
                'averageSongLength': 0,
                'uniqueSongs': 0,
                'uniqueArtists': 0,
                'mostPlayedGenre': None
            }
        
        # Calculate metrics
        total_duration = sum(song.duration for song in self.history_stack)
        unique_songs = len(set(song.id for song in self.history_stack))
        unique_artists = len(set(song.artist for song in self.history_stack))
        average_duration = total_duration / len(self.history_stack)
        
        return {
            'totalListeningTime': total_duration,
            'averageSongLength': average_duration,
            'uniqueSongs': unique_songs,
            'uniqueArtists': unique_artists,
            'totalPlays': self.total_plays,
            'historySize': len(self.history_stack)
        }
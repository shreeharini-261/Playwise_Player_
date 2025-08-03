"""
Artist Blocklist - HashSet Implementation
Manages blocked artists using HashSet for O(1) membership checking.
"""

from typing import Set, List
import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class ArtistBlocklist:
    """
    HashSet-based implementation for artist blocking functionality.
    Prevents songs by blocked artists from being added to playlists.
    
    Features:
    - O(1) add/remove/check operations
    - Case-insensitive artist matching
    - Memory-efficient duplicate prevention
    - Fast filtering during song addition
    """
    
    def __init__(self):
        """
        Initialize empty blocklist using HashSet.
        
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        # Use Python set for O(1) operations
        # Store artists in lowercase for case-insensitive matching
        self.blocked_artists: Set[str] = set()
    
    def add_artist(self, artist: str) -> bool:
        """
        Add artist to blocklist.
        
        Args:
            artist: Artist name to block
            
        Returns:
            True if added, False if already blocked or invalid
            
        Time Complexity: O(1) average case
        Space Complexity: O(1)
        """
        if not artist or not artist.strip():
            return False
        
        artist_key = artist.strip().lower()
        
        # Check if already blocked
        if artist_key in self.blocked_artists:
            return False
        
        # Add to blocklist
        self.blocked_artists.add(artist_key)
        return True
    
    def remove_artist(self, artist: str) -> bool:
        """
        Remove artist from blocklist.
        
        Args:
            artist: Artist name to unblock
            
        Returns:
            True if removed, False if not in blocklist
            
        Time Complexity: O(1) average case
        Space Complexity: O(1)
        """
        if not artist:
            return False
        
        artist_key = artist.strip().lower()
        
        if artist_key in self.blocked_artists:
            self.blocked_artists.remove(artist_key)
            return True
        
        return False
    
    def is_blocked(self, artist: str) -> bool:
        """
        Check if artist is blocked using O(1) HashSet lookup.
        
        Args:
            artist: Artist name to check
            
        Returns:
            True if blocked, False otherwise
            
        Time Complexity: O(1) average case
        Space Complexity: O(1)
        """
        if not artist:
            return False
        
        artist_key = artist.strip().lower()
        return artist_key in self.blocked_artists
    
    def get_blocked_artists(self) -> List[str]:
        """
        Get list of all blocked artists.
        
        Returns:
            List of blocked artist names (original case)
            
        Time Complexity: O(n) where n is number of blocked artists
        Space Complexity: O(n)
        """
        # Return sorted list for consistent ordering
        return sorted(list(self.blocked_artists))
    
    def get_blocked_count(self) -> int:
        """
        Get number of blocked artists.
        
        Returns:
            Number of artists in blocklist
            
        Time Complexity: O(1)
        """
        return len(self.blocked_artists)
    
    def is_empty(self) -> bool:
        """
        Check if blocklist is empty.
        
        Returns:
            True if no artists are blocked, False otherwise
            
        Time Complexity: O(1)
        """
        return len(self.blocked_artists) == 0
    
    def clear_blocklist(self) -> None:
        """
        Clear all blocked artists.
        
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        self.blocked_artists.clear()
    
    def bulk_add_artists(self, artists: List[str]) -> int:
        """
        Add multiple artists to blocklist at once.
        
        Args:
            artists: List of artist names to block
            
        Returns:
            Number of artists successfully added
            
        Time Complexity: O(n) where n is number of artists
        Space Complexity: O(n)
        """
        added_count = 0
        
        for artist in artists:
            if self.add_artist(artist):
                added_count += 1
        
        return added_count
    
    def bulk_remove_artists(self, artists: List[str]) -> int:
        """
        Remove multiple artists from blocklist at once.
        
        Args:
            artists: List of artist names to unblock
            
        Returns:
            Number of artists successfully removed
            
        Time Complexity: O(n) where n is number of artists
        Space Complexity: O(1)
        """
        removed_count = 0
        
        for artist in artists:
            if self.remove_artist(artist):
                removed_count += 1
        
        return removed_count
    
    def filter_songs(self, songs: List) -> List:
        """
        Filter out songs by blocked artists.
        
        Args:
            songs: List of song objects to filter
            
        Returns:
            List of songs not by blocked artists
            
        Time Complexity: O(n) where n is number of songs
        Space Complexity: O(k) where k is number of allowed songs
        """
        filtered_songs = []
        
        for song in songs:
            if hasattr(song, 'artist') and not self.is_blocked(song.artist):
                filtered_songs.append(song)
        
        return filtered_songs
    
    def get_blocked_song_count(self, songs: List) -> int:
        """
        Count how many songs would be blocked from a list.
        
        Args:
            songs: List of song objects to check
            
        Returns:
            Number of songs that would be blocked
            
        Time Complexity: O(n) where n is number of songs
        Space Complexity: O(1)
        """
        blocked_count = 0
        
        for song in songs:
            if hasattr(song, 'artist') and self.is_blocked(song.artist):
                blocked_count += 1
        
        return blocked_count
    
    def export_blocklist(self) -> dict:
        """
        Export blocklist data for backup/import.
        
        Returns:
            Dictionary with blocklist data
            
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        return {
            'blocked_artists': self.get_blocked_artists(),
            'count': self.get_blocked_count(),
            'export_timestamp': __import__('datetime').datetime.now().isoformat()
        }
    
    def import_blocklist(self, blocklist_data: dict) -> bool:
        """
        Import blocklist data from backup.
        
        Args:
            blocklist_data: Dictionary with blocklist data
            
        Returns:
            True if successful, False otherwise
            
        Time Complexity: O(n) where n is number of artists
        Space Complexity: O(n)
        """
        try:
            if 'blocked_artists' not in blocklist_data:
                return False
            
            # Clear current blocklist
            self.clear_blocklist()
            
            # Import artists
            artists = blocklist_data['blocked_artists']
            self.bulk_add_artists(artists)
            
            return True
        except Exception:
            return False
    
    def find_similar_artists(self, artist: str) -> List[str]:
        """
        Find blocked artists similar to given artist name.
        Useful for suggesting related blocks.
        
        Args:
            artist: Artist name to find similar to
            
        Returns:
            List of similar blocked artists
            
        Time Complexity: O(n) where n is number of blocked artists
        Space Complexity: O(k) where k is number of matches
        """
        if not artist:
            return []
        
        query = artist.strip().lower()
        similar_artists = []
        
        for blocked_artist in self.blocked_artists:
            # Simple similarity: check if one contains the other
            if query in blocked_artist or blocked_artist in query:
                similar_artists.append(blocked_artist)
        
        return similar_artists
    
    def get_blocklist_stats(self) -> dict:
        """
        Get statistics about the blocklist.
        
        Returns:
            Dictionary with blocklist statistics
            
        Time Complexity: O(n) for average length calculation
        Space Complexity: O(1)
        """
        if not self.blocked_artists:
            return {
                'totalBlocked': 0,
                'averageNameLength': 0,
                'longestName': '',
                'shortestName': '',
                'memoryUsage': 0
            }
        
        artists = list(self.blocked_artists)
        name_lengths = [len(artist) for artist in artists]
        
        return {
            'totalBlocked': len(self.blocked_artists),
            'averageNameLength': sum(name_lengths) / len(name_lengths),
            'longestName': max(artists, key=len),
            'shortestName': min(artists, key=len),
            'memoryUsage': sum(name_lengths)  # Approximate memory usage
        }
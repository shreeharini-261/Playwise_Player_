"""
Song Lookup - HashMap Implementation
Provides O(1) instant song lookup by ID or title using hash maps.
"""

from typing import Optional, List, Dict
import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.song import Song


class SongLookup:
    """
    HashMap-based implementation for instant song lookup.
    Maintains synchronized hash maps for different lookup methods.
    
    Features:
    - O(1) lookup by song ID
    - O(1) lookup by exact title
    - O(n) fuzzy search by partial title
    - Automatic synchronization with playlist operations
    """
    
    def __init__(self):
        """
        Initialize empty lookup tables.
        
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        # Primary lookup: song_id -> Song
        self.id_to_song: Dict[str, Song] = {}
        
        # Secondary lookup: title (lowercase) -> List[Song]
        # Multiple songs can have same title
        self.title_to_songs: Dict[str, List[Song]] = {}
        
        # Artist lookup: artist (lowercase) -> List[Song]
        self.artist_to_songs: Dict[str, List[Song]] = {}
    
    def add_song(self, song: Song) -> bool:
        """
        Add song to all lookup tables.
        
        Args:
            song: Song to add
            
        Returns:
            True if successful, False if song already exists
            
        Time Complexity: O(1) average case
        Space Complexity: O(1)
        """
        if not song or song.id in self.id_to_song:
            return False
        
        # Add to ID lookup
        self.id_to_song[song.id] = song
        
        # Add to title lookup
        title_key = song.title.lower().strip()
        if title_key not in self.title_to_songs:
            self.title_to_songs[title_key] = []
        self.title_to_songs[title_key].append(song)
        
        # Add to artist lookup
        artist_key = song.artist.lower().strip()
        if artist_key not in self.artist_to_songs:
            self.artist_to_songs[artist_key] = []
        self.artist_to_songs[artist_key].append(song)
        
        return True
    
    def remove_song(self, song_id: str) -> bool:
        """
        Remove song from all lookup tables.
        
        Args:
            song_id: ID of song to remove
            
        Returns:
            True if removed, False if not found
            
        Time Complexity: O(k) where k is number of songs with same title/artist
        Space Complexity: O(1)
        """
        if song_id not in self.id_to_song:
            return False
        
        song = self.id_to_song[song_id]
        
        # Remove from ID lookup
        del self.id_to_song[song_id]
        
        # Remove from title lookup
        title_key = song.title.lower().strip()
        if title_key in self.title_to_songs:
            self.title_to_songs[title_key] = [
                s for s in self.title_to_songs[title_key] if s.id != song_id
            ]
            # Clean up empty lists
            if not self.title_to_songs[title_key]:
                del self.title_to_songs[title_key]
        
        # Remove from artist lookup
        artist_key = song.artist.lower().strip()
        if artist_key in self.artist_to_songs:
            self.artist_to_songs[artist_key] = [
                s for s in self.artist_to_songs[artist_key] if s.id != song_id
            ]
            # Clean up empty lists
            if not self.artist_to_songs[artist_key]:
                del self.artist_to_songs[artist_key]
        
        return True
    
    def get_song(self, song_id: str) -> Optional[Song]:
        """
        Get song by ID using O(1) hash lookup.
        
        Args:
            song_id: Song ID to lookup
            
        Returns:
            Song object or None if not found
            
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        return self.id_to_song.get(song_id)
    
    def search_by_title(self, title: str) -> List[Song]:
        """
        Search songs by title (exact and partial matches).
        
        Args:
            title: Title to search for
            
        Returns:
            List of matching songs
            
        Time Complexity: O(n) for partial search, O(1) for exact
        Space Complexity: O(k) where k is number of matches
        """
        if not title:
            return []
        
        query = title.lower().strip()
        results = []
        
        # First try exact match (O(1))
        exact_matches = self.title_to_songs.get(query, [])
        results.extend(exact_matches)
        
        # Then try partial matches (O(n))
        for stored_title, songs in self.title_to_songs.items():
            if stored_title != query and query in stored_title:
                results.extend(songs)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_results = []
        for song in results:
            if song.id not in seen:
                seen.add(song.id)
                unique_results.append(song)
        
        return unique_results
    
    def search_by_artist(self, artist: str) -> List[Song]:
        """
        Search songs by artist name.
        
        Args:
            artist: Artist name to search for
            
        Returns:
            List of songs by the artist
            
        Time Complexity: O(1) average case
        Space Complexity: O(k) where k is number of songs by artist
        """
        if not artist:
            return []
        
        artist_key = artist.lower().strip()
        return self.artist_to_songs.get(artist_key, []).copy()
    
    def search_by_partial_artist(self, artist_query: str) -> List[Song]:
        """
        Search songs by partial artist name.
        
        Args:
            artist_query: Partial artist name
            
        Returns:
            List of matching songs
            
        Time Complexity: O(n * m) where n is artists, m is avg songs per artist
        Space Complexity: O(k) where k is total matches
        """
        if not artist_query:
            return []
        
        query = artist_query.lower().strip()
        results = []
        
        for artist_name, songs in self.artist_to_songs.items():
            if query in artist_name:
                results.extend(songs)
        
        return results
    
    def fuzzy_search(self, query: str) -> List[Song]:
        """
        Perform fuzzy search across titles and artists.
        
        Args:
            query: Search query
            
        Returns:
            List of matching songs (ranked by relevance)
            
        Time Complexity: O(n)
        Space Complexity: O(k)
        """
        if not query:
            return []
        
        query = query.lower().strip()
        results = []
        
        # Search in titles
        title_matches = self.search_by_title(query)
        results.extend(title_matches)
        
        # Search in artists
        artist_matches = self.search_by_partial_artist(query)
        results.extend(artist_matches)
        
        # Remove duplicates and rank by relevance
        seen = set()
        ranked_results = []
        
        for song in results:
            if song.id not in seen:
                seen.add(song.id)
                # Calculate relevance score
                title_score = self._calculate_relevance_score(query, song.title.lower())
                artist_score = self._calculate_relevance_score(query, song.artist.lower())
                song_with_score = (song, max(title_score, artist_score))
                ranked_results.append(song_with_score)
        
        # Sort by relevance score (higher is better)
        ranked_results.sort(key=lambda x: x[1], reverse=True)
        
        return [song for song, score in ranked_results]
    
    def _calculate_relevance_score(self, query: str, text: str) -> float:
        """
        Calculate relevance score for search ranking.
        
        Args:
            query: Search query
            text: Text to score against
            
        Returns:
            Relevance score (0.0 to 1.0)
            
        Time Complexity: O(1)
        """
        if query == text:
            return 1.0
        
        if query in text:
            # Score based on position and length ratio
            position_score = 1.0 - (text.find(query) / len(text))
            length_score = len(query) / len(text)
            return (position_score + length_score) / 2
        
        return 0.0
    
    def get_all_songs(self) -> List[Song]:
        """
        Get all songs in the lookup table.
        
        Returns:
            List of all songs
            
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        return list(self.id_to_song.values())
    
    def get_all_artists(self) -> List[str]:
        """
        Get all unique artists.
        
        Returns:
            List of artist names
            
        Time Complexity: O(1)
        """
        return list(self.artist_to_songs.keys())
    
    def get_song_count(self) -> int:
        """
        Get total number of songs in lookup.
        
        Returns:
            Number of songs
            
        Time Complexity: O(1)
        """
        return len(self.id_to_song)
    
    def get_artist_song_count(self, artist: str) -> int:
        """
        Get number of songs by specific artist.
        
        Args:
            artist: Artist name
            
        Returns:
            Number of songs by artist
            
        Time Complexity: O(1)
        """
        artist_key = artist.lower().strip()
        return len(self.artist_to_songs.get(artist_key, []))
    
    def clear(self) -> None:
        """
        Clear all lookup tables.
        
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        self.id_to_song.clear()
        self.title_to_songs.clear()
        self.artist_to_songs.clear()
    
    def get_lookup_stats(self) -> dict:
        """
        Get statistics about the lookup tables.
        
        Returns:
            Dictionary with lookup statistics
            
        Time Complexity: O(n)
        """
        total_songs = len(self.id_to_song)
        unique_titles = len(self.title_to_songs)
        unique_artists = len(self.artist_to_songs)
        
        # Calculate average songs per artist
        avg_songs_per_artist = 0
        if unique_artists > 0:
            total_artist_songs = sum(len(songs) for songs in self.artist_to_songs.values())
            avg_songs_per_artist = total_artist_songs / unique_artists
        
        return {
            'totalSongs': total_songs,
            'uniqueTitles': unique_titles,
            'uniqueArtists': unique_artists,
            'averageSongsPerArtist': avg_songs_per_artist,
            'memoryUsage': {
                'idLookupSize': len(self.id_to_song),
                'titleLookupSize': len(self.title_to_songs),
                'artistLookupSize': len(self.artist_to_songs)
            }
        }
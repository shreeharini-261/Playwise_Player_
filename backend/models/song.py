"""
Song Model - Core data structure for PlayWise
Represents a musical track with metadata and unique identification.
"""

import uuid
from typing import Dict, Any


class Song:
    """
    Song data model with unique identification and metadata.
    
    Attributes:
        id (str): Unique identifier for the song
        title (str): Song title
        artist (str): Artist name
        duration (int): Duration in seconds
    
    Time Complexity: O(1) for all operations
    Space Complexity: O(1) per song instance
    """
    
    def __init__(self, title: str, artist: str, duration: int, song_id: str = None):
        """
        Initialize a new song instance.
        
        Args:
            title: Song title
            artist: Artist name  
            duration: Duration in seconds
            song_id: Optional custom ID, generates UUID if not provided
        """
        self.id = song_id or str(uuid.uuid4())
        self.title = title.strip()
        self.artist = artist.strip()
        self.duration = max(0, int(duration))  # Ensure non-negative duration
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert song to dictionary representation.
        
        Returns:
            Dictionary with song data
            
        Time Complexity: O(1)
        """
        return {
            'id': self.id,
            'title': self.title,
            'artist': self.artist,
            'duration': self.duration
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Song':
        """
        Create song instance from dictionary.
        
        Args:
            data: Dictionary containing song data
            
        Returns:
            Song instance
            
        Time Complexity: O(1)
        """
        return cls(
            title=data['title'],
            artist=data['artist'], 
            duration=data['duration'],
            song_id=data.get('id')
        )
    
    def get_formatted_duration(self) -> str:
        """
        Get human-readable duration format (MM:SS).
        
        Returns:
            Formatted duration string
            
        Time Complexity: O(1)
        """
        minutes = self.duration // 60
        seconds = self.duration % 60
        return f"{minutes}:{seconds:02d}"
    
    def __str__(self) -> str:
        """String representation of song"""
        return f"{self.title} by {self.artist} ({self.get_formatted_duration()})"
    
    def __repr__(self) -> str:
        """Developer representation of song"""
        return f"Song(id='{self.id}', title='{self.title}', artist='{self.artist}', duration={self.duration})"
    
    def __eq__(self, other) -> bool:
        """
        Check equality based on song ID.
        
        Time Complexity: O(1)
        """
        if not isinstance(other, Song):
            return False
        return self.id == other.id
    
    def __hash__(self) -> int:
        """
        Hash based on song ID for use in sets/dicts.
        
        Time Complexity: O(1)
        """
        return hash(self.id)
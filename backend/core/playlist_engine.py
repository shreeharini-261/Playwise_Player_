"""
Playlist Engine - Doubly Linked List Implementation
Core component for playlist management with O(1) insertion/deletion operations.
"""

from typing import Optional, List
import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.song import Song


class PlaylistNode:
    """
    Node for doubly linked list implementation.
    
    Attributes:
        song: Song object stored in this node
        next: Reference to next node
        prev: Reference to previous node
    
    Space Complexity: O(1) per node
    """
    
    def __init__(self, song: Song):
        self.song = song
        self.next: Optional['PlaylistNode'] = None
        self.prev: Optional['PlaylistNode'] = None


class PlaylistEngine:
    """
    Doubly Linked List implementation for playlist management.
    Supports efficient insertion, deletion, and manipulation operations.
    
    Operations supported:
    - add_song: O(1) at head/tail
    - delete_song: O(n) at arbitrary position  
    - move_song: O(n) for arbitrary positions
    - reverse_playlist: O(n)
    """
    
    def __init__(self):
        """
        Initialize empty playlist with dummy head and tail nodes.
        
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        # Use dummy nodes to simplify edge cases
        self.head = PlaylistNode(None)
        self.tail = PlaylistNode(None)
        self.head.next = self.tail
        self.tail.prev = self.head
        self.size = 0
    
    def add_song(self, song: Song, position: Optional[int] = None) -> bool:
        """
        Add song to playlist at specified position (default: end).
        
        Args:
            song: Song to add
            position: Position to insert (None = end)
            
        Returns:
            True if successful, False otherwise
            
        Time Complexity: O(1) for head/tail, O(n) for arbitrary position
        Space Complexity: O(1)
        """
        if not song:
            return False
        
        new_node = PlaylistNode(song)
        
        if position is None or position >= self.size:
            # Add to end (before tail)
            prev_node = self.tail.prev
            prev_node.next = new_node
            new_node.prev = prev_node
            new_node.next = self.tail
            self.tail.prev = new_node
        elif position <= 0:
            # Add to beginning (after head)
            next_node = self.head.next
            self.head.next = new_node
            new_node.prev = self.head
            new_node.next = next_node
            next_node.prev = new_node
        else:
            # Add at specific position
            target_node = self._get_node_at_index(position)
            if target_node:
                prev_node = target_node.prev
                prev_node.next = new_node
                new_node.prev = prev_node
                new_node.next = target_node
                target_node.prev = new_node
        
        self.size += 1
        return True
    
    def delete_song(self, index: int) -> Optional[Song]:
        """
        Delete song at specified index.
        
        Args:
            index: Position to delete from
            
        Returns:
            Deleted song or None if invalid index
            
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        if index < 0 or index >= self.size:
            return None
        
        node_to_delete = self._get_node_at_index(index)
        if not node_to_delete:
            return None
        
        # Remove node from list
        prev_node = node_to_delete.prev
        next_node = node_to_delete.next
        prev_node.next = next_node
        next_node.prev = prev_node
        
        self.size -= 1
        return node_to_delete.song
    
    def move_song(self, from_index: int, to_index: int) -> bool:
        """
        Move song from one position to another.
        
        Args:
            from_index: Source position
            to_index: Target position
            
        Returns:
            True if successful, False otherwise
            
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        if (from_index < 0 or from_index >= self.size or 
            to_index < 0 or to_index >= self.size or
            from_index == to_index):
            return False
        
        # Get the song to move
        song = self.delete_song(from_index)
        if not song:
            return False
        
        # Adjust target index if moving forward
        if to_index > from_index:
            to_index -= 1
        
        # Insert at new position
        return self.add_song(song, to_index)
    
    def reverse_playlist(self) -> bool:
        """
        Reverse the entire playlist by swapping next/prev pointers.
        
        Returns:
            True if successful
            
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        if self.size <= 1:
            return True
        
        current = self.head
        
        # Swap next and prev for all nodes
        while current:
            current.next, current.prev = current.prev, current.next
            current = current.prev  # Move to what was next
        
        # Swap head and tail
        self.head, self.tail = self.tail, self.head
        
        return True
    
    def get_all_songs(self) -> List[Song]:
        """
        Get all songs in playlist order.
        
        Returns:
            List of songs in current order
            
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        songs = []
        current = self.head.next
        
        while current != self.tail:
            songs.append(current.song)
            current = current.next
        
        return songs
    
    def get_song_at_index(self, index: int) -> Optional[Song]:
        """
        Get song at specific index.
        
        Args:
            index: Position to retrieve
            
        Returns:
            Song at index or None if invalid
            
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        node = self._get_node_at_index(index)
        return node.song if node else None
    
    def find_song_index(self, song_id: str) -> int:
        """
        Find index of song by ID.
        
        Args:
            song_id: ID of song to find
            
        Returns:
            Index of song or -1 if not found
            
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        current = self.head.next
        index = 0
        
        while current != self.tail:
            if current.song.id == song_id:
                return index
            current = current.next
            index += 1
        
        return -1
    
    def clear(self) -> None:
        """
        Clear all songs from playlist.
        
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        self.head.next = self.tail
        self.tail.prev = self.head
        self.size = 0
    
    def get_size(self) -> int:
        """
        Get number of songs in playlist.
        
        Returns:
            Number of songs
            
        Time Complexity: O(1)
        """
        return self.size
    
    def is_empty(self) -> bool:
        """
        Check if playlist is empty.
        
        Returns:
            True if empty, False otherwise
            
        Time Complexity: O(1)
        """
        return self.size == 0
    
    def _get_node_at_index(self, index: int) -> Optional[PlaylistNode]:
        """
        Internal method to get node at specific index.
        Optimizes by starting from head or tail based on index.
        
        Args:
            index: Position to retrieve
            
        Returns:
            Node at index or None if invalid
            
        Time Complexity: O(n), optimized to O(n/2) average
        Space Complexity: O(1)
        """
        if index < 0 or index >= self.size:
            return None
        
        # Optimize by starting from closer end
        if index < self.size // 2:
            # Start from head
            current = self.head.next
            for _ in range(index):
                current = current.next
        else:
            # Start from tail
            current = self.tail.prev
            for _ in range(self.size - index - 1):
                current = current.prev
        
        return current
    
    def get_playlist_stats(self) -> dict:
        """
        Get playlist statistics for analytics.
        
        Returns:
            Dictionary with playlist stats
            
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        if self.size == 0:
            return {
                'totalSongs': 0,
                'totalDuration': 0,
                'averageDuration': 0,
                'longestSong': None,
                'shortestSong': None
            }
        
        songs = self.get_all_songs()
        total_duration = sum(song.duration for song in songs)
        longest_song = max(songs, key=lambda s: s.duration)
        shortest_song = min(songs, key=lambda s: s.duration)
        
        return {
            'totalSongs': self.size,
            'totalDuration': total_duration,
            'averageDuration': total_duration / self.size,
            'longestSong': longest_song.to_dict(),
            'shortestSong': shortest_song.to_dict()
        }
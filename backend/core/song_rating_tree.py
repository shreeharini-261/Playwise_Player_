"""
Song Rating Tree - Binary Search Tree Implementation
Manages song ratings using BST for efficient search and organization.
"""

from typing import Optional, List, Dict
import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.song import Song


class RatingNode:
    """
    Node for Binary Search Tree implementation.
    Each node represents a rating level (1-5) and contains songs with that rating.
    
    Attributes:
        rating: Rating value (1-5)
        songs: List of songs with this rating
        left: Left child node (lower ratings)
        right: Right child node (higher ratings)
    
    Space Complexity: O(1) per node + O(k) for songs list
    """
    
    def __init__(self, rating: int):
        self.rating = rating
        self.songs: List[Song] = []
        self.left: Optional['RatingNode'] = None
        self.right: Optional['RatingNode'] = None


class SongRatingTree:
    """
    Binary Search Tree implementation for song ratings.
    Organizes songs by rating (1-5 stars) for efficient search operations.
    
    Operations:
    - insert_song: O(log n) average, O(n) worst case
    - search_by_rating: O(log n) average, O(n) worst case
    - delete_song: O(log n) average, O(n) worst case
    
    Features:
    - Multiple songs per rating bucket
    - In-order traversal for sorted access
    - Self-balancing considerations for optimal performance
    """
    
    def __init__(self):
        """
        Initialize empty rating tree.
        
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        self.root: Optional[RatingNode] = None
        self.song_ratings: Dict[str, int] = {}  # song_id -> rating mapping
    
    def insert_song(self, song: Song, rating: int) -> bool:
        """
        Insert song with specified rating into BST.
        
        Args:
            song: Song to rate
            rating: Rating value (1-5)
            
        Returns:
            True if successful, False otherwise
            
        Time Complexity: O(log n) average, O(n) worst case
        Space Complexity: O(1)
        """
        if not song or rating < 1 or rating > 5:
            return False
        
        # Remove song from previous rating if exists
        if song.id in self.song_ratings:
            self.delete_song(song.id)
        
        # Insert into tree
        self.root = self._insert_recursive(self.root, song, rating)
        self.song_ratings[song.id] = rating
        return True
    
    def _insert_recursive(self, node: Optional[RatingNode], song: Song, rating: int) -> RatingNode:
        """
        Recursive helper for BST insertion.
        
        Args:
            node: Current node
            song: Song to insert
            rating: Rating value
            
        Returns:
            Root of subtree after insertion
            
        Time Complexity: O(log n) average
        """
        # Base case: create new node
        if not node:
            new_node = RatingNode(rating)
            new_node.songs.append(song)
            return new_node
        
        # Insert based on rating comparison
        if rating < node.rating:
            node.left = self._insert_recursive(node.left, song, rating)
        elif rating > node.rating:
            node.right = self._insert_recursive(node.right, song, rating)
        else:
            # Same rating: add to existing bucket
            # Remove if already exists to avoid duplicates
            node.songs = [s for s in node.songs if s.id != song.id]
            node.songs.append(song)
        
        return node
    
    def search_by_rating(self, rating: int) -> List[Song]:
        """
        Search for all songs with specified rating.
        
        Args:
            rating: Rating to search for (1-5)
            
        Returns:
            List of songs with the rating
            
        Time Complexity: O(log n) average, O(n) worst case
        Space Complexity: O(k) where k is number of songs with rating
        """
        if rating < 1 or rating > 5:
            return []
        
        node = self._search_recursive(self.root, rating)
        return node.songs.copy() if node else []
    
    def _search_recursive(self, node: Optional[RatingNode], rating: int) -> Optional[RatingNode]:
        """
        Recursive helper for BST search.
        
        Args:
            node: Current node
            rating: Rating to find
            
        Returns:
            Node with rating or None if not found
            
        Time Complexity: O(log n) average
        """
        if not node or node.rating == rating:
            return node
        
        if rating < node.rating:
            return self._search_recursive(node.left, rating)
        else:
            return self._search_recursive(node.right, rating)
    
    def delete_song(self, song_id: str) -> bool:
        """
        Delete song from rating tree.
        
        Args:
            song_id: ID of song to remove
            
        Returns:
            True if removed, False if not found
            
        Time Complexity: O(log n) average, O(n) worst case
        Space Complexity: O(1)
        """
        if song_id not in self.song_ratings:
            return False
        
        rating = self.song_ratings[song_id]
        self.root = self._delete_recursive(self.root, song_id, rating)
        del self.song_ratings[song_id]
        return True
    
    def _delete_recursive(self, node: Optional[RatingNode], song_id: str, rating: int) -> Optional[RatingNode]:
        """
        Recursive helper for BST deletion.
        
        Args:
            node: Current node
            song_id: Song ID to remove
            rating: Rating of song to remove
            
        Returns:
            Root of subtree after deletion
            
        Time Complexity: O(log n) average
        """
        if not node:
            return None
        
        if rating < node.rating:
            node.left = self._delete_recursive(node.left, song_id, rating)
        elif rating > node.rating:
            node.right = self._delete_recursive(node.right, song_id, rating)
        else:
            # Found the rating node - remove song from bucket
            node.songs = [s for s in node.songs if s.id != song_id]
            
            # If bucket is empty, remove the node
            if not node.songs:
                # Case 1: No children
                if not node.left and not node.right:
                    return None
                
                # Case 2: One child
                if not node.left:
                    return node.right
                if not node.right:
                    return node.left
                
                # Case 3: Two children - find inorder successor
                successor = self._find_min(node.right)
                node.rating = successor.rating
                node.songs = successor.songs.copy()
                node.right = self._delete_node_recursive(node.right, successor.rating)
        
        return node
    
    def _delete_node_recursive(self, node: Optional[RatingNode], rating: int) -> Optional[RatingNode]:
        """Helper to delete a node completely."""
        if not node:
            return None
        
        if rating < node.rating:
            node.left = self._delete_node_recursive(node.left, rating)
        elif rating > node.rating:
            node.right = self._delete_node_recursive(node.right, rating)
        else:
            if not node.left:
                return node.right
            if not node.right:
                return node.left
            
            successor = self._find_min(node.right)
            node.rating = successor.rating
            node.songs = successor.songs.copy()
            node.right = self._delete_node_recursive(node.right, successor.rating)
        
        return node
    
    def _find_min(self, node: RatingNode) -> RatingNode:
        """Find minimum rating node in subtree."""
        while node.left:
            node = node.left
        return node
    
    def get_song_rating(self, song_id: str) -> Optional[int]:
        """
        Get rating for specific song.
        
        Args:
            song_id: Song ID to lookup
            
        Returns:
            Rating (1-5) or None if not rated
            
        Time Complexity: O(1)
        """
        return self.song_ratings.get(song_id)
    
    def get_all_ratings(self) -> Dict[str, int]:
        """
        Get all song ratings as dictionary.
        
        Returns:
            Dictionary mapping song_id to rating
            
        Time Complexity: O(1)
        """
        return self.song_ratings.copy()
    
    def get_rating_distribution(self) -> Dict[int, int]:
        """
        Get count of songs for each rating level.
        
        Returns:
            Dictionary mapping rating to count
            
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        
        def count_recursive(node: Optional[RatingNode]):
            if node:
                distribution[node.rating] = len(node.songs)
                count_recursive(node.left)
                count_recursive(node.right)
        
        count_recursive(self.root)
        return distribution
    
    def get_top_rated_songs(self, count: int = 10) -> List[Song]:
        """
        Get highest rated songs using in-order traversal.
        
        Args:
            count: Maximum number of songs to return
            
        Returns:
            List of top-rated songs
            
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        all_songs = []
        
        def inorder_traversal(node: Optional[RatingNode]):
            if node:
                inorder_traversal(node.right)  # Right first for descending order
                all_songs.extend(node.songs)
                inorder_traversal(node.left)
        
        inorder_traversal(self.root)
        return all_songs[:count]
    
    def get_average_rating(self) -> float:
        """
        Calculate average rating across all rated songs.
        
        Returns:
            Average rating or 0.0 if no ratings
            
        Time Complexity: O(1)
        """
        if not self.song_ratings:
            return 0.0
        
        total_rating = sum(self.song_ratings.values())
        return total_rating / len(self.song_ratings)
    
    def clear_all_ratings(self) -> None:
        """
        Clear all ratings from the tree.
        
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        self.root = None
        self.song_ratings.clear()
    
    def get_tree_stats(self) -> dict:
        """
        Get statistics about the rating tree.
        
        Returns:
            Dictionary with tree statistics
            
        Time Complexity: O(n)
        """
        total_songs = len(self.song_ratings)
        if total_songs == 0:
            return {
                'totalRatedSongs': 0,
                'averageRating': 0.0,
                'ratingDistribution': {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
                'treeHeight': 0
            }
        
        return {
            'totalRatedSongs': total_songs,
            'averageRating': self.get_average_rating(),
            'ratingDistribution': self.get_rating_distribution(),
            'treeHeight': self._calculate_height(self.root)
        }
    
    def _calculate_height(self, node: Optional[RatingNode]) -> int:
        """Calculate height of BST for performance analysis."""
        if not node:
            return 0
        
        left_height = self._calculate_height(node.left)
        right_height = self._calculate_height(node.right)
        
        return 1 + max(left_height, right_height)
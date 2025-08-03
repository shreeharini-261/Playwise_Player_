"""
Sorting Algorithms - Advanced Playlist Sorting Implementation
Implements efficient sorting algorithms for playlist organization.
"""

from typing import List, Callable, Any
import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.song import Song


class PlaylistSorter:
    """
    Advanced sorting algorithms implementation for playlist management.
    Provides multiple sorting criteria with optimized algorithms.
    
    Algorithms implemented:
    - Merge Sort: O(n log n) stable sorting
    - Quick Sort: O(n log n) average case, in-place sorting
    - Insertion Sort: O(n²) for small datasets
    
    Sorting criteria:
    - Title (alphabetical)
    - Artist (alphabetical)
    - Duration (numerical)
    - Recently added (timestamp-based)
    """
    
    def __init__(self):
        """
        Initialize sorting engine.
        
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        self.sort_count = 0
        self.last_sort_algorithm = None
        self.performance_stats = {}
    
    def sort_by_title(self, songs: List[Song], reverse: bool = False) -> List[Song]:
        """
        Sort songs by title using Merge Sort (stable).
        
        Args:
            songs: List of songs to sort
            reverse: Sort in descending order if True
            
        Returns:
            Sorted list of songs
            
        Time Complexity: O(n log n)
        Space Complexity: O(n)
        """
        if not songs:
            return []
        
        def title_key(song: Song) -> str:
            return song.title.lower().strip()
        
        return self._merge_sort(songs.copy(), title_key, reverse)
    
    def sort_by_artist(self, songs: List[Song], reverse: bool = False) -> List[Song]:
        """
        Sort songs by artist using Merge Sort (stable).
        
        Args:
            songs: List of songs to sort
            reverse: Sort in descending order if True
            
        Returns:
            Sorted list of songs
            
        Time Complexity: O(n log n)
        Space Complexity: O(n)
        """
        if not songs:
            return []
        
        def artist_key(song: Song) -> str:
            return song.artist.lower().strip()
        
        return self._merge_sort(songs.copy(), artist_key, reverse)
    
    def sort_by_duration(self, songs: List[Song], reverse: bool = False) -> List[Song]:
        """
        Sort songs by duration using Quick Sort.
        
        Args:
            songs: List of songs to sort
            reverse: Sort in descending order if True
            
        Returns:
            Sorted list of songs
            
        Time Complexity: O(n log n) average, O(n²) worst case
        Space Complexity: O(log n) for recursion stack
        """
        if not songs:
            return []
        
        def duration_key(song: Song) -> int:
            return song.duration
        
        songs_copy = songs.copy()
        self._quick_sort(songs_copy, 0, len(songs_copy) - 1, duration_key, reverse)
        return songs_copy
    
    def sort_by_multiple_criteria(self, songs: List[Song], 
                                criteria: List[str], 
                                reverse_flags: List[bool] = None) -> List[Song]:
        """
        Sort by multiple criteria with priority order.
        
        Args:
            songs: List of songs to sort
            criteria: List of criteria ['title', 'artist', 'duration']
            reverse_flags: List of reverse flags for each criterion
            
        Returns:
            Sorted list of songs
            
        Time Complexity: O(n log n)
        Space Complexity: O(n)
        """
        if not songs or not criteria:
            return songs.copy()
        
        if reverse_flags is None:
            reverse_flags = [False] * len(criteria)
        
        def multi_key(song: Song) -> tuple:
            key_values = []
            for i, criterion in enumerate(criteria):
                if criterion == 'title':
                    value = song.title.lower().strip()
                elif criterion == 'artist':
                    value = song.artist.lower().strip()
                elif criterion == 'duration':
                    value = song.duration
                else:
                    value = song.title.lower().strip()  # Default
                
                # Apply reverse for this criterion
                if i < len(reverse_flags) and reverse_flags[i]:
                    if isinstance(value, str):
                        # For strings, reverse lexicographically
                        value = tuple(reversed(value))
                    else:
                        # For numbers, negate
                        value = -value
                
                key_values.append(value)
            
            return tuple(key_values)
        
        return self._merge_sort(songs.copy(), multi_key, False)
    
    def _merge_sort(self, songs: List[Song], key_func: Callable, reverse: bool) -> List[Song]:
        """
        Merge Sort implementation - stable, O(n log n) algorithm.
        
        Args:
            songs: List to sort
            key_func: Function to extract sort key
            reverse: Sort in descending order
            
        Returns:
            Sorted list
            
        Time Complexity: O(n log n)
        Space Complexity: O(n)
        """
        self.last_sort_algorithm = "Merge Sort"
        self.sort_count += 1
        
        if len(songs) <= 1:
            return songs
        
        # Divide
        mid = len(songs) // 2
        left = self._merge_sort(songs[:mid], key_func, reverse)
        right = self._merge_sort(songs[mid:], key_func, reverse)
        
        # Conquer
        return self._merge(left, right, key_func, reverse)
    
    def _merge(self, left: List[Song], right: List[Song], 
               key_func: Callable, reverse: bool) -> List[Song]:
        """
        Merge two sorted lists.
        
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        result = []
        i = j = 0
        
        while i < len(left) and j < len(right):
            left_key = key_func(left[i])
            right_key = key_func(right[j])
            
            # Compare based on reverse flag
            if (left_key <= right_key) != reverse:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        
        # Add remaining elements
        result.extend(left[i:])
        result.extend(right[j:])
        
        return result
    
    def _quick_sort(self, songs: List[Song], low: int, high: int, 
                    key_func: Callable, reverse: bool) -> None:
        """
        Quick Sort implementation - in-place, O(n log n) average.
        
        Args:
            songs: List to sort (modified in-place)
            low: Starting index
            high: Ending index
            key_func: Function to extract sort key
            reverse: Sort in descending order
            
        Time Complexity: O(n log n) average, O(n²) worst case
        Space Complexity: O(log n) for recursion
        """
        self.last_sort_algorithm = "Quick Sort"
        
        if low < high:
            # Partition and get pivot index
            pivot_index = self._partition(songs, low, high, key_func, reverse)
            
            # Recursively sort elements before and after partition
            self._quick_sort(songs, low, pivot_index - 1, key_func, reverse)
            self._quick_sort(songs, pivot_index + 1, high, key_func, reverse)
    
    def _partition(self, songs: List[Song], low: int, high: int, 
                   key_func: Callable, reverse: bool) -> int:
        """
        Partition function for Quick Sort.
        
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        # Use last element as pivot
        pivot = key_func(songs[high])
        i = low - 1  # Index of smaller element
        
        for j in range(low, high):
            current_key = key_func(songs[j])
            
            # Compare based on reverse flag
            if (current_key <= pivot) != reverse:
                i += 1
                songs[i], songs[j] = songs[j], songs[i]
        
        songs[i + 1], songs[high] = songs[high], songs[i + 1]
        return i + 1
    
    def insertion_sort(self, songs: List[Song], key_func: Callable, 
                      reverse: bool = False) -> List[Song]:
        """
        Insertion Sort - O(n²) but efficient for small datasets.
        
        Args:
            songs: List of songs to sort
            key_func: Function to extract sort key
            reverse: Sort in descending order
            
        Returns:
            Sorted list of songs
            
        Time Complexity: O(n²)
        Space Complexity: O(1) additional space
        """
        self.last_sort_algorithm = "Insertion Sort"
        self.sort_count += 1
        
        if len(songs) <= 1:
            return songs.copy()
        
        sorted_songs = songs.copy()
        
        for i in range(1, len(sorted_songs)):
            key_song = sorted_songs[i]
            key_value = key_func(key_song)
            j = i - 1
            
            # Move elements that are greater than key to one position ahead
            while j >= 0:
                compare_value = key_func(sorted_songs[j])
                should_move = (compare_value > key_value) != reverse
                
                if should_move:
                    sorted_songs[j + 1] = sorted_songs[j]
                    j -= 1
                else:
                    break
            
            sorted_songs[j + 1] = key_song
        
        return sorted_songs
    
    def hybrid_sort(self, songs: List[Song], key_func: Callable, 
                   reverse: bool = False) -> List[Song]:
        """
        Hybrid sorting algorithm that chooses best method based on data size.
        
        Args:
            songs: List of songs to sort
            key_func: Function to extract sort key
            reverse: Sort in descending order
            
        Returns:
            Sorted list of songs
            
        Time Complexity: O(n log n) for large datasets, O(n²) for small
        Space Complexity: Varies by chosen algorithm
        """
        if len(songs) <= 10:
            # Use insertion sort for small datasets
            return self.insertion_sort(songs, key_func, reverse)
        elif len(songs) <= 1000:
            # Use merge sort for medium datasets (stable)
            return self._merge_sort(songs.copy(), key_func, reverse)
        else:
            # Use quick sort for large datasets (in-place)
            songs_copy = songs.copy()
            self._quick_sort(songs_copy, 0, len(songs_copy) - 1, key_func, reverse)
            return songs_copy
    
    def shuffle(self, songs: List[Song]) -> List[Song]:
        """
        Randomly shuffle songs using Fisher-Yates algorithm.
        
        Args:
            songs: List of songs to shuffle
            
        Returns:
            Shuffled list of songs
            
        Time Complexity: O(n)
        Space Complexity: O(1) additional space
        """
        import random
        
        shuffled = songs.copy()
        
        for i in range(len(shuffled) - 1, 0, -1):
            j = random.randint(0, i)
            shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
        
        return shuffled
    
    def get_sort_statistics(self) -> dict:
        """
        Get statistics about sorting operations.
        
        Returns:
            Dictionary with sorting statistics
            
        Time Complexity: O(1)
        """
        return {
            'totalSorts': self.sort_count,
            'lastAlgorithm': self.last_sort_algorithm,
            'supportedAlgorithms': [
                'Merge Sort',
                'Quick Sort',
                'Insertion Sort',
                'Hybrid Sort'
            ],
            'supportedCriteria': [
                'title',
                'artist', 
                'duration',
                'multiple_criteria'
            ]
        }
    
    def benchmark_algorithms(self, songs: List[Song]) -> dict:
        """
        Benchmark different sorting algorithms on the same dataset.
        
        Args:
            songs: List of songs to benchmark with
            
        Returns:
            Performance comparison results
            
        Time Complexity: O(n log n) per algorithm
        """
        import time
        
        if not songs:
            return {}
        
        def duration_key(song: Song) -> int:
            return song.duration
        
        results = {}
        
        # Benchmark Merge Sort
        start_time = time.time()
        self._merge_sort(songs.copy(), duration_key, False)
        results['merge_sort'] = time.time() - start_time
        
        # Benchmark Quick Sort
        start_time = time.time()
        songs_copy = songs.copy()
        self._quick_sort(songs_copy, 0, len(songs_copy) - 1, duration_key, False)
        results['quick_sort'] = time.time() - start_time
        
        # Benchmark Insertion Sort (only for small datasets)
        if len(songs) <= 100:
            start_time = time.time()
            self.insertion_sort(songs, duration_key, False)
            results['insertion_sort'] = time.time() - start_time
        
        return results
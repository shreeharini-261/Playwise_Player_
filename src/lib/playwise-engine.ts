/**
 * PlayWise Music Engine - Core Data Structures Implementation
 * Implements Linked Lists, Stacks, BST, HashMap, and Sorting algorithms
 */

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  rating?: number; // 1-5 stars
  addedAt: Date;
}

// ===== 1. PLAYLIST ENGINE USING DOUBLY LINKED LIST =====
/**
 * Doubly Linked List Node for Playlist Management
 * Time Complexity: O(1) for insertion/deletion at known positions
 * Space Complexity: O(n) where n is number of songs
 */
class PlaylistNode {
  constructor(
    public song: Song,
    public next: PlaylistNode | null = null,
    public prev: PlaylistNode | null = null
  ) {}
}

export class PlaylistEngine {
  private head: PlaylistNode | null = null;
  private tail: PlaylistNode | null = null;
  private size = 0;

  /**
   * Add song to playlist - O(1) time complexity
   */
  addSong(title: string, artist: string, duration: number): Song {
    const song: Song = {
      id: Date.now().toString() + Math.random().toString(36),
      title,
      artist,
      duration,
      addedAt: new Date()
    };

    const newNode = new PlaylistNode(song);
    
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    
    this.size++;
    return song;
  }

  /**
   * Delete song at index - O(n) time complexity
   */
  deleteSong(index: number): boolean {
    if (index < 0 || index >= this.size) return false;

    let current = this.head;
    for (let i = 0; i < index && current; i++) {
      current = current.next;
    }

    if (!current) return false;

    if (current.prev) current.prev.next = current.next;
    if (current.next) current.next.prev = current.prev;
    
    if (current === this.head) this.head = current.next;
    if (current === this.tail) this.tail = current.prev;
    
    this.size--;
    return true;
  }

  /**
   * Move song from one index to another - O(n) time complexity
   */
  moveSong(fromIndex: number, toIndex: number): boolean {
    if (fromIndex === toIndex || 
        fromIndex < 0 || fromIndex >= this.size ||
        toIndex < 0 || toIndex >= this.size) {
      return false;
    }

    // Get the song at fromIndex
    let current = this.head;
    for (let i = 0; i < fromIndex && current; i++) {
      current = current.next;
    }

    if (!current) return false;

    const song = current.song;
    this.deleteSong(fromIndex);
    
    // Insert at new position
    if (toIndex > fromIndex) toIndex--; // Adjust for deletion
    this.insertAtIndex(song, toIndex);
    
    return true;
  }

  private insertAtIndex(song: Song, index: number): void {
    if (index === this.size) {
      this.addSong(song.title, song.artist, song.duration);
      return;
    }

    const newNode = new PlaylistNode(song);
    
    if (index === 0) {
      newNode.next = this.head;
      if (this.head) this.head.prev = newNode;
      this.head = newNode;
      if (!this.tail) this.tail = newNode;
    } else {
      let current = this.head;
      for (let i = 0; i < index && current; i++) {
        current = current.next;
      }
      
      if (current) {
        newNode.next = current;
        newNode.prev = current.prev;
        if (current.prev) current.prev.next = newNode;
        current.prev = newNode;
      }
    }
    
    this.size++;
  }

  /**
   * Reverse playlist - O(n) time complexity
   */
  reversePlaylist(): void {
    let current = this.head;
    this.head = this.tail;
    this.tail = current;

    while (current) {
      const temp = current.next;
      current.next = current.prev;
      current.prev = temp;
      current = temp;
    }
  }

  /**
   * Get all songs as array - O(n) time complexity
   */
  getAllSongs(): Song[] {
    const songs: Song[] = [];
    let current = this.head;
    while (current) {
      songs.push(current.song);
      current = current.next;
    }
    return songs;
  }

  getSize(): number {
    return this.size;
  }
}

// ===== 2. PLAYBACK HISTORY USING STACK =====
/**
 * Stack implementation for undo functionality
 * Time Complexity: O(1) for push/pop operations
 * Space Complexity: O(n) where n is number of played songs
 */
export class PlaybackHistory {
  private history: Song[] = [];
  private maxSize: number;

  constructor(maxSize = 50) {
    this.maxSize = maxSize;
  }

  /**
   * Add song to history - O(1) time complexity
   */
  addToHistory(song: Song): void {
    this.history.push(song);
    if (this.history.length > this.maxSize) {
      this.history.shift(); // Remove oldest
    }
  }

  /**
   * Undo last play - O(1) time complexity
   */
  undoLastPlay(): Song | null {
    return this.history.pop() || null;
  }

  /**
   * Get recent history - O(k) where k is limit
   */
  getRecentHistory(limit = 10): Song[] {
    return this.history.slice(-limit).reverse();
  }

  getHistorySize(): number {
    return this.history.length;
  }
}

// ===== 3. SONG RATING TREE USING BST =====
/**
 * BST Node for rating-based organization
 */
class RatingNode {
  songs: Song[] = [];
  left: RatingNode | null = null;
  right: RatingNode | null = null;

  constructor(public rating: number) {}
}

/**
 * Binary Search Tree for song ratings
 * Time Complexity: O(log n) average, O(n) worst case
 * Space Complexity: O(n)
 */
export class SongRatingTree {
  private root: RatingNode | null = null;

  /**
   * Insert song with rating - O(log n) average time
   */
  insertSong(song: Song, rating: number): void {
    song.rating = rating;
    this.root = this.insertNode(this.root, song, rating);
  }

  private insertNode(node: RatingNode | null, song: Song, rating: number): RatingNode {
    if (!node) {
      const newNode = new RatingNode(rating);
      newNode.songs.push(song);
      return newNode;
    }

    if (rating === node.rating) {
      node.songs.push(song);
    } else if (rating < node.rating) {
      node.left = this.insertNode(node.left, song, rating);
    } else {
      node.right = this.insertNode(node.right, song, rating);
    }

    return node;
  }

  /**
   * Search songs by rating - O(log n) average time
   */
  searchByRating(rating: number): Song[] {
    const node = this.findNode(this.root, rating);
    return node ? [...node.songs] : [];
  }

  private findNode(node: RatingNode | null, rating: number): RatingNode | null {
    if (!node || node.rating === rating) return node;
    
    if (rating < node.rating) {
      return this.findNode(node.left, rating);
    } else {
      return this.findNode(node.right, rating);
    }
  }

  /**
   * Delete song by ID - O(log n) average time
   */
  deleteSong(songId: string): boolean {
    return this.deleteFromNode(this.root, songId);
  }

  private deleteFromNode(node: RatingNode | null, songId: string): boolean {
    if (!node) return false;

    // Check current node
    const songIndex = node.songs.findIndex(s => s.id === songId);
    if (songIndex !== -1) {
      node.songs.splice(songIndex, 1);
      return true;
    }

    // Search in children
    return this.deleteFromNode(node.left, songId) || 
           this.deleteFromNode(node.right, songId);
  }

  /**
   * Get rating statistics - O(n) time
   */
  getRatingStats(): { [rating: number]: number } {
    const stats: { [rating: number]: number } = {};
    this.collectStats(this.root, stats);
    return stats;
  }

  private collectStats(node: RatingNode | null, stats: { [rating: number]: number }): void {
    if (!node) return;

    stats[node.rating] = node.songs.length;
    this.collectStats(node.left, stats);
    this.collectStats(node.right, stats);
  }
}

// ===== 4. INSTANT SONG LOOKUP USING HASHMAP =====
/**
 * HashMap for O(1) song lookup
 * Time Complexity: O(1) average for get/set operations
 * Space Complexity: O(n)
 */
export class SongLookup {
  private songMap = new Map<string, Song>();
  private titleMap = new Map<string, Song[]>();

  /**
   * Add song to lookup - O(1) average time
   */
  addSong(song: Song): void {
    this.songMap.set(song.id, song);
    
    const titleKey = song.title.toLowerCase();
    if (!this.titleMap.has(titleKey)) {
      this.titleMap.set(titleKey, []);
    }
    this.titleMap.get(titleKey)!.push(song);
  }

  /**
   * Get song by ID - O(1) time
   */
  getSongById(id: string): Song | null {
    return this.songMap.get(id) || null;
  }

  /**
   * Search by title - O(1) average time
   */
  searchByTitle(title: string): Song[] {
    const titleKey = title.toLowerCase();
    return this.titleMap.get(titleKey) || [];
  }

  /**
   * Remove song - O(1) average time
   */
  removeSong(songId: string): boolean {
    const song = this.songMap.get(songId);
    if (!song) return false;

    this.songMap.delete(songId);
    
    const titleKey = song.title.toLowerCase();
    const titleSongs = this.titleMap.get(titleKey);
    if (titleSongs) {
      const index = titleSongs.findIndex(s => s.id === songId);
      if (index !== -1) {
        titleSongs.splice(index, 1);
        if (titleSongs.length === 0) {
          this.titleMap.delete(titleKey);
        }
      }
    }

    return true;
  }

  /**
   * Get all songs - O(n) time
   */
  getAllSongs(): Song[] {
    return Array.from(this.songMap.values());
  }
}

// ===== 5. SORTING ALGORITHMS =====
export type SortCriteria = 'title' | 'duration' | 'addedAt' | 'artist';
export type SortOrder = 'asc' | 'desc';

/**
 * Merge Sort implementation - O(n log n) time, O(n) space
 */
export class PlaylistSorter {
  static mergeSort(songs: Song[], criteria: SortCriteria, order: SortOrder = 'asc'): Song[] {
    if (songs.length <= 1) return songs;

    const mid = Math.floor(songs.length / 2);
    const left = songs.slice(0, mid);
    const right = songs.slice(mid);

    const sortedLeft = this.mergeSort(left, criteria, order);
    const sortedRight = this.mergeSort(right, criteria, order);

    return this.merge(sortedLeft, sortedRight, criteria, order);
  }

  private static merge(left: Song[], right: Song[], criteria: SortCriteria, order: SortOrder): Song[] {
    const result: Song[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      const comparison = this.compare(left[leftIndex], right[rightIndex], criteria);
      const shouldTakeLeft = order === 'asc' ? comparison <= 0 : comparison > 0;

      if (shouldTakeLeft) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  }

  private static compare(a: Song, b: Song, criteria: SortCriteria): number {
    switch (criteria) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'artist':
        return a.artist.localeCompare(b.artist);
      case 'duration':
        return a.duration - b.duration;
      case 'addedAt':
        return a.addedAt.getTime() - b.addedAt.getTime();
      default:
        return 0;
    }
  }

  /**
   * Quick Sort implementation - O(n log n) average, O(n²) worst case
   */
  static quickSort(songs: Song[], criteria: SortCriteria, order: SortOrder = 'asc'): Song[] {
    if (songs.length <= 1) return songs;

    const pivot = songs[Math.floor(songs.length / 2)];
    const left: Song[] = [];
    const equal: Song[] = [];
    const right: Song[] = [];

    for (const song of songs) {
      const comparison = this.compare(song, pivot, criteria);
      if (comparison < 0) {
        left.push(song);
      } else if (comparison > 0) {
        right.push(song);
      } else {
        equal.push(song);
      }
    }

    const sortedLeft = this.quickSort(left, criteria, order);
    const sortedRight = this.quickSort(right, criteria, order);

    return order === 'asc' 
      ? [...sortedLeft, ...equal, ...sortedRight]
      : [...sortedRight, ...equal, ...sortedLeft];
  }
}

// ===== 6. ARTIST BLOCKLIST (HASHSET) =====
/**
 * HashSet for blocked artists - O(1) lookup
 */
export class ArtistBlocklist {
  private blockedArtists = new Set<string>();

  addToBlocklist(artist: string): void {
    this.blockedArtists.add(artist.toLowerCase());
  }

  removeFromBlocklist(artist: string): void {
    this.blockedArtists.delete(artist.toLowerCase());
  }

  isBlocked(artist: string): boolean {
    return this.blockedArtists.has(artist.toLowerCase());
  }

  getBlockedArtists(): string[] {
    return Array.from(this.blockedArtists);
  }
}

// ===== 7. ANALYTICS & DASHBOARD =====
export class PlaywiseAnalytics {
  static getTotalDuration(songs: Song[]): number {
    return songs.reduce((total, song) => total + song.duration, 0);
  }

  static getLongestSong(songs: Song[]): Song | null {
    if (songs.length === 0) return null;
    return songs.reduce((longest, song) => 
      song.duration > longest.duration ? song : longest
    );
  }

  static getShortestSong(songs: Song[]): Song | null {
    if (songs.length === 0) return null;
    return songs.reduce((shortest, song) => 
      song.duration < shortest.duration ? song : shortest
    );
  }

  static getTopLongestSongs(songs: Song[], count = 5): Song[] {
    return [...songs]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, count);
  }

  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

// ===== MAIN PLAYWISE ENGINE =====
export class PlaywiseEngine {
  public playlist: PlaylistEngine;
  public history: PlaybackHistory;
  public ratingTree: SongRatingTree;
  public lookup: SongLookup;
  public blocklist: ArtistBlocklist;

  constructor() {
    this.playlist = new PlaylistEngine();
    this.history = new PlaybackHistory();
    this.ratingTree = new SongRatingTree();
    this.lookup = new SongLookup();
    this.blocklist = new ArtistBlocklist();
  }

  /**
   * Add song with full integration across all data structures
   */
  addSong(title: string, artist: string, duration: number): Song | null {
    if (this.blocklist.isBlocked(artist)) {
      return null; // Artist is blocked
    }

    const song = this.playlist.addSong(title, artist, duration);
    this.lookup.addSong(song);
    return song;
  }

  /**
   * Play song and add to history
   */
  playSong(songId: string): boolean {
    const song = this.lookup.getSongById(songId);
    if (!song) return false;

    this.history.addToHistory(song);
    return true;
  }

  /**
   * Rate song and add to rating tree
   */
  rateSong(songId: string, rating: number): boolean {
    if (rating < 1 || rating > 5) return false;

    const song = this.lookup.getSongById(songId);
    if (!song) return false;

    this.ratingTree.insertSong(song, rating);
    return true;
  }

  /**
   * Export system snapshot for dashboard
   */
  exportSnapshot() {
    const allSongs = this.playlist.getAllSongs();
    
    return {
      totalSongs: allSongs.length,
      totalDuration: PlaywiseAnalytics.getTotalDuration(allSongs),
      longestSong: PlaywiseAnalytics.getLongestSong(allSongs),
      shortestSong: PlaywiseAnalytics.getShortestSong(allSongs),
      topLongestSongs: PlaywiseAnalytics.getTopLongestSongs(allSongs),
      recentHistory: this.history.getRecentHistory(),
      ratingStats: this.ratingTree.getRatingStats(),
      blockedArtists: this.blocklist.getBlockedArtists(),
      historySize: this.history.getHistorySize()
    };
  }
}
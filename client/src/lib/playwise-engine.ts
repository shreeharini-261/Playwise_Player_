// Core data types
export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
}

export type SortCriteria = 'title' | 'artist' | 'duration';
export type SortOrder = 'asc' | 'desc';

// Linked List Node for Playlist
class PlaylistNode {
  data: Song;
  next: PlaylistNode | null;
  prev: PlaylistNode | null;

  constructor(song: Song) {
    this.data = song;
    this.next = null;
    this.prev = null;
  }
}

// Doubly Linked List for Playlist Management
export class Playlist {
  private head: PlaylistNode | null = null;
  private tail: PlaylistNode | null = null;
  private size: number = 0;

  addSong(title: string, artist: string, duration: number): Song {
    const song: Song = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      artist,
      duration
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

  deleteSong(index: number): boolean {
    if (index < 0 || index >= this.size) return false;

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }

    if (current!.prev) {
      current!.prev.next = current!.next;
    } else {
      this.head = current!.next;
    }

    if (current!.next) {
      current!.next.prev = current!.prev;
    } else {
      this.tail = current!.prev;
    }

    this.size--;
    return true;
  }

  moveSong(fromIndex: number, toIndex: number): boolean {
    if (fromIndex < 0 || fromIndex >= this.size || toIndex < 0 || toIndex >= this.size) {
      return false;
    }

    if (fromIndex === toIndex) return true;

    const song = this.getSong(fromIndex);
    if (!song) return false;

    this.deleteSong(fromIndex);
    
    // Adjust toIndex if we deleted from before the target position
    if (fromIndex < toIndex) {
      toIndex--;
    }

    this.insertAt(toIndex, song);
    return true;
  }

  private insertAt(index: number, song: Song): void {
    if (index === this.size) {
      this.addSong(song.title, song.artist, song.duration);
      return;
    }

    const newNode = new PlaylistNode(song);
    let current = this.head;
    
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }

    newNode.next = current;
    newNode.prev = current!.prev;

    if (current!.prev) {
      current!.prev.next = newNode;
    } else {
      this.head = newNode;
    }

    current!.prev = newNode;
    this.size++;
  }

  getSong(index: number): Song | null {
    if (index < 0 || index >= this.size) return null;

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }

    return current!.data;
  }

  getAllSongs(): Song[] {
    const songs: Song[] = [];
    let current = this.head;

    while (current) {
      songs.push(current.data);
      current = current.next;
    }

    return songs;
  }

  reversePlaylist(): void {
    let current = this.head;
    let temp: PlaylistNode | null = null;

    // Swap next and prev for all nodes
    while (current) {
      temp = current.prev;
      current.prev = current.next;
      current.next = temp;
      current = current.prev;
    }

    // Swap head and tail
    if (temp) {
      this.head = temp.prev;
    }

    // Update tail
    current = this.head;
    while (current && current.next) {
      current = current.next;
    }
    this.tail = current;
  }

  getSize(): number {
    return this.size;
  }
}

// Hash Table for Song Lookup
export class SongLookup {
  private table: Map<string, Song> = new Map();

  addSong(song: Song): void {
    this.table.set(song.id, song);
  }

  getSongById(id: string): Song | undefined {
    return this.table.get(id);
  }

  removeSong(id: string): boolean {
    return this.table.delete(id);
  }

  getAllSongs(): Song[] {
    return Array.from(this.table.values());
  }
}

// BST Node for Rating System
class RatingNode {
  rating: number;
  songs: Song[];
  left: RatingNode | null = null;
  right: RatingNode | null = null;

  constructor(rating: number, song: Song) {
    this.rating = rating;
    this.songs = [song];
  }
}

// Binary Search Tree for Rating System
export class RatingTree {
  private root: RatingNode | null = null;

  addRating(song: Song, rating: number): void {
    this.root = this.insertRating(this.root, song, rating);
  }

  private insertRating(node: RatingNode | null, song: Song, rating: number): RatingNode {
    if (!node) {
      return new RatingNode(rating, song);
    }

    if (rating === node.rating) {
      node.songs.push(song);
    } else if (rating < node.rating) {
      node.left = this.insertRating(node.left, song, rating);
    } else {
      node.right = this.insertRating(node.right, song, rating);
    }

    return node;
  }

  searchByRating(rating: number): Song[] {
    const node = this.findRatingNode(this.root, rating);
    return node ? node.songs : [];
  }

  private findRatingNode(node: RatingNode | null, rating: number): RatingNode | null {
    if (!node || node.rating === rating) {
      return node;
    }

    if (rating < node.rating) {
      return this.findRatingNode(node.left, rating);
    } else {
      return this.findRatingNode(node.right, rating);
    }
  }

  getAllRatings(): Array<{ rating: number; songs: Song[] }> {
    const ratings: Array<{ rating: number; songs: Song[] }> = [];
    this.inOrderTraversal(this.root, ratings);
    return ratings;
  }

  private inOrderTraversal(node: RatingNode | null, ratings: Array<{ rating: number; songs: Song[] }>): void {
    if (node) {
      this.inOrderTraversal(node.left, ratings);
      ratings.push({ rating: node.rating, songs: [...node.songs] });
      this.inOrderTraversal(node.right, ratings);
    }
  }
}

// Stack for History Management
export class HistoryStack {
  private stack: Song[] = [];

  addPlay(song: Song): void {
    this.stack.push(song);
  }

  undoLastPlay(): Song | null {
    return this.stack.pop() || null;
  }

  getHistory(): Song[] {
    return [...this.stack];
  }

  getLastPlayed(): Song | null {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  }
}

// Set-based Blocklist
export class ArtistBlocklist {
  private blockedArtists: Set<string> = new Set();

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

// Merge Sort Algorithm for Playlist Sorting
export class PlaylistSorter {
  static mergeSort(songs: Song[], criteria: SortCriteria, order: SortOrder): Song[] {
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
      
      if ((order === 'asc' && comparison <= 0) || (order === 'desc' && comparison >= 0)) {
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
      default:
        return 0;
    }
  }
}

// Main PlayWise Engine
export class PlaywiseEngine {
  public playlist: Playlist;
  public lookup: SongLookup;
  public ratingTree: RatingTree;
  public history: HistoryStack;
  public blocklist: ArtistBlocklist;
  private ratings: Map<string, number>;

  constructor() {
    this.playlist = new Playlist();
    this.lookup = new SongLookup();
    this.ratingTree = new RatingTree();
    this.history = new HistoryStack();
    this.blocklist = new ArtistBlocklist();
    this.ratings = new Map();
  }

  addSong(title: string, artist: string, duration: number): Song | null {
    if (this.blocklist.isBlocked(artist)) {
      return null;
    }

    const song = this.playlist.addSong(title, artist, duration);
    this.lookup.addSong(song);
    return song;
  }

  playSong(songId: string): boolean {
    const song = this.lookup.getSongById(songId);
    if (!song) return false;

    this.history.addPlay(song);
    return true;
  }

  rateSong(songId: string, rating: number): boolean {
    if (rating < 1 || rating > 5) return false;

    const song = this.lookup.getSongById(songId);
    if (!song) return false;

    this.ratings.set(songId, rating);
    this.ratingTree.addRating(song, rating);
    return true;
  }

  getSongRating(songId: string): number | null {
    return this.ratings.get(songId) || null;
  }

  exportSnapshot() {
    return {
      songs: this.playlist.getAllSongs(),
      history: this.history.getHistory(),
      blockedArtists: this.blocklist.getBlockedArtists(),
      ratings: Object.fromEntries(this.ratings),
      timestamp: Date.now()
    };
  }
}
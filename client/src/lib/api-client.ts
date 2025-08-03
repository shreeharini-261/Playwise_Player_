/**
 * API Client for PlayWise Flask Backend
 * Handles all communication with the Python Flask server
 */

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
}

export interface SystemSnapshot {
  songs: Song[];
  history: Song[];
  ratings: Record<string, number>;
  blockedArtists: string[];
  analytics: {
    totalSongs: number;
    totalDuration: number;
    longestSongs: Song[];
    ratingDistribution: Record<number, number>;
    totalPlays: number;
    blockedArtistsCount: number;
  };
  timestamp: string;
}

class APIClient {
  private baseURL: string;

  constructor() {
    // Use Flask backend URL - adjust for Replit environment
    const isReplit = window.location.hostname.includes('replit.dev') || window.location.hostname.includes('repl.co');
    this.baseURL = isReplit 
      ? `${window.location.protocol}//${window.location.hostname}:5001/api`
      : 'http://localhost:5001/api';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request('/health');
  }

  // System snapshot
  async getSnapshot(): Promise<SystemSnapshot> {
    return this.request('/snapshot');
  }

  // Playlist operations
  async addSong(song: Omit<Song, 'id'>): Promise<{ song: Song }> {
    return this.request('/songs', {
      method: 'POST',
      body: JSON.stringify(song),
    });
  }

  async deleteSong(index: number): Promise<{ message: string }> {
    return this.request(`/songs/${index}`, {
      method: 'DELETE',
    });
  }

  async moveSong(fromIndex: number, toIndex: number): Promise<{ message: string }> {
    return this.request('/songs/move', {
      method: 'POST',
      body: JSON.stringify({ fromIndex, toIndex }),
    });
  }

  async reversePlaylist(): Promise<{ message: string }> {
    return this.request('/playlist/reverse', {
      method: 'POST',
    });
  }

  async sortPlaylist(criteria: string, reverse: boolean = false): Promise<{ message: string }> {
    return this.request('/playlist/sort', {
      method: 'POST',
      body: JSON.stringify({ criteria, reverse }),
    });
  }

  // Playback history operations
  async playSong(songId: string): Promise<{ song: Song }> {
    return this.request('/history/play', {
      method: 'POST',
      body: JSON.stringify({ songId }),
    });
  }

  async undoLastPlay(): Promise<{ song: Song }> {
    return this.request('/history/undo', {
      method: 'POST',
    });
  }

  async getHistory(): Promise<Song[]> {
    return this.request('/history');
  }

  // Rating system operations
  async rateSong(songId: string, rating: number): Promise<{ message: string }> {
    return this.request('/ratings', {
      method: 'POST',
      body: JSON.stringify({ songId, rating }),
    });
  }

  async getSongsByRating(rating: number): Promise<Song[]> {
    return this.request(`/ratings/${rating}`);
  }

  async getSongRating(songId: string): Promise<{ songId: string; rating: number | null }> {
    return this.request(`/ratings/${songId}`);
  }

  // Artist blocklist operations
  async addToBlocklist(artist: string): Promise<{ message: string }> {
    return this.request('/blocklist', {
      method: 'POST',
      body: JSON.stringify({ artist }),
    });
  }

  async removeFromBlocklist(artist: string): Promise<{ message: string }> {
    return this.request(`/blocklist/${encodeURIComponent(artist)}`, {
      method: 'DELETE',
    });
  }

  async getBlocklist(): Promise<string[]> {
    return this.request('/blocklist');
  }

  // Search operations
  async searchSongs(query: string): Promise<Song[]> {
    return this.request(`/search/${encodeURIComponent(query)}`);
  }
}

export const apiClient = new APIClient();
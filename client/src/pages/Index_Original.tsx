import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaywiseHeader } from '@/components/PlaywiseHeader';
import { PlaylistPanel } from '@/components/PlaylistPanel';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { RatingPanel } from '@/components/RatingPanel';
import { HistoryPanel } from '@/components/HistoryPanel';
import { BlocklistPanel } from '@/components/BlocklistPanel';
import { apiClient, Song, SystemSnapshot } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [snapshot, setSnapshot] = useState<SystemSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Update snapshot from Flask backend
  const updateSnapshot = async () => {
    try {
      const newSnapshot = await apiClient.getSnapshot();
      setSnapshot(newSnapshot);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error updating snapshot:', err);
    }
  };

  // Initialize with some demo data
  useEffect(() => {
    // Add some demo songs
    engine.addSong("Bohemian Rhapsody", "Queen", 355);
    engine.addSong("Stairway to Heaven", "Led Zeppelin", 482);
    engine.addSong("Hotel California", "Eagles", 391);
    engine.addSong("Imagine", "John Lennon", 183);
    engine.addSong("Sweet Child O' Mine", "Guns N' Roses", 356);
    engine.addSong("Purple Haze", "Jimi Hendrix", 170);
    engine.addSong("Billie Jean", "Michael Jackson", 294);
    engine.addSong("Like a Rolling Stone", "Bob Dylan", 369);

    // Add some ratings
    const allSongs = engine.playlist.getAllSongs();
    allSongs.forEach((song, index) => {
      const rating = Math.floor(Math.random() * 5) + 1;
      engine.rateSong(song.id, rating);
    });

    // Add some to blocklist
    engine.blocklist.addToBlocklist("Nickelback");
    engine.blocklist.addToBlocklist("Justin Bieber");

    updateSnapshot();
  }, [engine]);

  const handleAddSong = (title: string, artist: string, duration: number) => {
    const song = engine.addSong(title, artist, duration);
    if (song) {
      toast({
        title: "Song Added",
        description: `"${title}" by ${artist} has been added to your playlist.`,
      });
    } else {
      toast({
        title: "Artist Blocked",
        description: `Cannot add song. ${artist} is in your blocklist.`,
        variant: "destructive",
      });
    }
    updateSnapshot();
  };

  const handleDeleteSong = (index: number) => {
    const songs = engine.playlist.getAllSongs();
    const song = songs[index];
    
    if (engine.playlist.deleteSong(index)) {
      engine.lookup.removeSong(song.id);
      toast({
        title: "Song Removed",
        description: `"${song.title}" has been removed from your playlist.`,
      });
      updateSnapshot();
    }
  };

  const handleMoveSong = (fromIndex: number, toIndex: number) => {
    if (engine.playlist.moveSong(fromIndex, toIndex)) {
      toast({
        title: "Song Moved",
        description: "Song position updated successfully.",
      });
      updateSnapshot();
    }
  };

  const handleReversePlaylist = () => {
    engine.playlist.reversePlaylist();
    toast({
      title: "Playlist Reversed",
      description: "Your playlist order has been reversed.",
    });
    updateSnapshot();
  };

  const handleSortPlaylist = (criteria: SortCriteria, order: SortOrder) => {
    const songs = engine.playlist.getAllSongs();
    const sortedSongs = PlaylistSorter.mergeSort(songs, criteria, order);
    
    // Clear current playlist and rebuild with sorted songs
    while (engine.playlist.getSize() > 0) {
      engine.playlist.deleteSong(0);
    }
    
    sortedSongs.forEach(song => {
      engine.playlist.addSong(song.title, song.artist, song.duration);
    });

    toast({
      title: "Playlist Sorted",
      description: `Playlist sorted by ${criteria} (${order}ending) using Merge Sort algorithm.`,
    });
    updateSnapshot();
  };

  const handlePlaySong = (songId: string) => {
    if (engine.playSong(songId)) {
      const song = engine.lookup.getSongById(songId);
      toast({
        title: "Now Playing",
        description: `"${song?.title}" by ${song?.artist}`,
      });
      updateSnapshot();
    }
  };

  const handleRateSong = (songId: string, rating: number) => {
    if (engine.rateSong(songId, rating)) {
      const song = engine.lookup.getSongById(songId);
      toast({
        title: "Song Rated",
        description: `"${song?.title}" rated ${rating} stars.`,
      });
      updateSnapshot();
    }
  };

  const handleSearchByRating = (rating: number): Song[] => {
    return engine.ratingTree.searchByRating(rating);
  };

  const handleUndoLastPlay = (): Song | null => {
    const song = engine.history.undoLastPlay();
    if (song) {
      toast({
        title: "Playback Undone",
        description: `"${song.title}" removed from history.`,
      });
      updateSnapshot();
    }
    return song;
  };

  const handleAddToBlocklist = (artist: string) => {
    engine.blocklist.addToBlocklist(artist);
    toast({
      title: "Artist Blocked",
      description: `${artist} has been added to your blocklist.`,
    });
    updateSnapshot();
  };

  const handleRemoveFromBlocklist = (artist: string) => {
    engine.blocklist.removeFromBlocklist(artist);
    toast({
      title: "Artist Unblocked",
      description: `${artist} has been removed from your blocklist.`,
    });
    updateSnapshot();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality here if needed
  };

  const currentSongs = engine.playlist.getAllSongs();

  return (
    <div className="min-h-screen bg-background">
      <PlaywiseHeader onSearch={handleSearch} searchQuery={searchQuery} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-music-text-primary mb-2">
            Welcome to PlayWise
          </h1>
          <p className="text-music-text-muted">
            A comprehensive music playlist management system demonstrating advanced data structures and algorithms.
          </p>
        </div>

        <Tabs defaultValue="playlist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-music-player border-border/50">
            <TabsTrigger value="playlist" className="data-[state=active]:bg-music-accent data-[state=active]:text-white">
              Playlist Engine
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-music-accent data-[state=active]:text-white">
              Analytics Dashboard
            </TabsTrigger>
            <TabsTrigger value="rating" className="data-[state=active]:bg-music-accent data-[state=active]:text-white">
              Rating System
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-music-accent data-[state=active]:text-white">
              History & Stack
            </TabsTrigger>
            <TabsTrigger value="blocklist" className="data-[state=active]:bg-music-accent data-[state=active]:text-white">
              Artist Blocklist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playlist" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <PlaylistPanel
                songs={currentSongs}
                onAddSong={handleAddSong}
                onDeleteSong={handleDeleteSong}
                onMoveSong={handleMoveSong}
                onReversePlayslist={handleReversePlaylist}
                onSortPlaylist={handleSortPlaylist}
                onPlaySong={handlePlaySong}
              />
              
              <div className="bg-music-player border border-border/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-music-text-primary mb-3">
                  Data Structure Implementation Notes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-medium text-music-accent">Doubly Linked List</h4>
                    <ul className="text-music-text-muted space-y-1">
                      <li>• O(1) insertion at head/tail</li>
                      <li>• O(n) deletion at arbitrary position</li>
                      <li>• O(n) move operation between positions</li>
                      <li>• O(n) reverse operation</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-music-accent">Merge Sort Algorithm</h4>
                    <ul className="text-music-text-muted space-y-1">
                      <li>• O(n log n) time complexity</li>
                      <li>• O(n) space complexity</li>
                      <li>• Stable sorting algorithm</li>
                      <li>• Divide and conquer approach</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard snapshot={snapshot} />
          </TabsContent>

          <TabsContent value="rating" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RatingPanel
                songs={currentSongs}
                onRateSong={handleRateSong}
                onSearchByRating={handleSearchByRating}
                getSongRating={(songId) => engine.getSongRating(songId)}
                snapshot={snapshot}
              />
              
              <div className="bg-music-player border border-border/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-music-text-primary mb-3">
                  Binary Search Tree Implementation
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-music-accent mb-2">Time Complexities</h4>
                    <ul className="text-music-text-muted space-y-1">
                      <li>• Insert: O(log n) average, O(n) worst case</li>
                      <li>• Search: O(log n) average, O(n) worst case</li>
                      <li>• Delete: O(log n) average, O(n) worst case</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-music-accent mb-2">Features</h4>
                    <ul className="text-music-text-muted space-y-1">
                      <li>• Rating buckets (1-5 stars)</li>
                      <li>• Multiple songs per rating</li>
                      <li>• In-order traversal for sorted access</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HistoryPanel
                history={snapshot.history}
                onUndoLastPlay={handleUndoLastPlay}
                lastPlayed={engine.history.getLastPlayed()}
              />
              
              <div className="bg-music-player border border-border/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-music-text-primary mb-3">
                  Stack Data Structure
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-music-accent mb-2">LIFO Operations</h4>
                    <ul className="text-music-text-muted space-y-1">
                      <li>• Push (add to history): O(1)</li>
                      <li>• Pop (undo last play): O(1)</li>
                      <li>• Peek (view recent): O(k)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-music-accent mb-2">Memory Management</h4>
                    <ul className="text-music-text-muted space-y-1">
                      <li>• Maximum size limit (50 songs)</li>
                      <li>• Automatic oldest removal</li>
                      <li>• Constant space per operation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="blocklist" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BlocklistPanel
                blockedArtists={snapshot.blockedArtists}
                onAddToBlocklist={handleAddToBlocklist}
                onRemoveFromBlocklist={handleRemoveFromBlocklist}
                snapshot={snapshot}
              />
              
              <div className="bg-music-player border border-border/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-music-text-primary mb-3">
                  HashSet Implementation
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-music-accent mb-2">Performance</h4>
                    <ul className="text-music-text-muted space-y-1">
                      <li>• Add artist: O(1) average case</li>
                      <li>• Check if blocked: O(1) average case</li>
                      <li>• Remove artist: O(1) average case</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-music-accent mb-2">Use Cases</h4>
                    <ul className="text-music-text-muted space-y-1">
                      <li>• Fast artist filtering during song addition</li>
                      <li>• Memory-efficient duplicate prevention</li>
                      <li>• Case-insensitive artist matching</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaywiseHeader } from '@/components/PlaywiseHeader';
import { apiClient, Song, SystemSnapshot } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Music, Play, Star, Clock, Users, TrendingUp, RotateCcw, Shuffle, Search, Plus, Trash2, Move } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  const [snapshot, setSnapshot] = useState<SystemSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSong, setNewSong] = useState({ title: '', artist: '', duration: 0 });
  const [newArtistBlock, setNewArtistBlock] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
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

  // Initialize with Flask backend data
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      try {
        // Check if backend is healthy
        await apiClient.healthCheck();
        
        // Get initial snapshot
        await updateSnapshot();
        
        setLoading(false);
      } catch (err) {
        setError('Failed to connect to Flask backend. Make sure the server is running on port 5000.');
        setLoading(false);
        console.error('Initialization error:', err);
      }
    };

    initializeApp();
  }, []);

  // Demo data initialization
  const initializeDemoData = async () => {
    try {
      const demoSongs = [
        { title: "Bohemian Rhapsody", artist: "Queen", duration: 355 },
        { title: "Stairway to Heaven", artist: "Led Zeppelin", duration: 482 },
        { title: "Hotel California", artist: "Eagles", duration: 391 },
        { title: "Imagine", artist: "John Lennon", duration: 183 },
        { title: "Sweet Child O' Mine", artist: "Guns N' Roses", duration: 356 },
        { title: "Purple Haze", artist: "Jimi Hendrix", duration: 170 },
        { title: "Billie Jean", artist: "Michael Jackson", duration: 294 },
        { title: "Like a Rolling Stone", artist: "Bob Dylan", duration: 369 },
      ];
      
      // Add demo songs
      for (const song of demoSongs) {
        await apiClient.addSong(song);
      }
      
      // Add some to blocklist
      await apiClient.addToBlocklist("Nickelback");
      await apiClient.addToBlocklist("Justin Bieber");
      
      // Refresh snapshot
      await updateSnapshot();
      
      toast({
        title: "Demo Data Added",
        description: "Added 8 demo songs and 2 blocked artists.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add demo data.",
        variant: "destructive",
      });
    }
  };

  const handleAddSong = async () => {
    if (!newSong.title || !newSong.artist || newSong.duration <= 0) {
      toast({
        title: "Invalid Song",
        description: "Please fill in all fields with valid data.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiClient.addSong(newSong);
      setNewSong({ title: '', artist: '', duration: 0 });
      await updateSnapshot();
      toast({
        title: "Song Added",
        description: `"${newSong.title}" by ${newSong.artist} has been added to your playlist.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add song",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSong = async (index: number) => {
    try {
      await apiClient.deleteSong(index);
      await updateSnapshot();
      toast({
        title: "Song Removed",
        description: "Song has been removed from your playlist.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove song",
        variant: "destructive",
      });
    }
  };

  const handlePlaySong = async (songId: string) => {
    try {
      const result = await apiClient.playSong(songId);
      await updateSnapshot();
      toast({
        title: "Now Playing",
        description: `Playing "${result.song.title}" by ${result.song.artist}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to play song",
        variant: "destructive",
      });
    }
  };

  const handleRateSong = async (songId: string, rating: number) => {
    try {
      await apiClient.rateSong(songId, rating);
      await updateSnapshot();
      toast({
        title: "Song Rated",
        description: `Rated ${rating} stars`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to rate song",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await apiClient.searchSongs(searchQuery);
      setSearchResults(results);
    } catch (err) {
      toast({
        title: "Search Error",
        description: "Failed to search songs",
        variant: "destructive",
      });
    }
  };

  const handleBlockArtist = async () => {
    if (!newArtistBlock.trim()) return;

    try {
      await apiClient.addToBlocklist(newArtistBlock);
      setNewArtistBlock('');
      await updateSnapshot();
      toast({
        title: "Artist Blocked",
        description: `${newArtistBlock} has been added to blocklist.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to block artist",
        variant: "destructive",
      });
    }
  };

  const handleUnblockArtist = async (artist: string) => {
    try {
      await apiClient.removeFromBlocklist(artist);
      await updateSnapshot();
      toast({
        title: "Artist Unblocked",
        description: `${artist} has been removed from blocklist.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to unblock artist",
        variant: "destructive",
      });
    }
  };

  const handleSortPlaylist = async (criteria: string) => {
    try {
      await apiClient.sortPlaylist(criteria);
      await updateSnapshot();
      toast({
        title: "Playlist Sorted",
        description: `Sorted by ${criteria}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to sort playlist",
        variant: "destructive",
      });
    }
  };

  const handleReversePlaylist = async () => {
    try {
      await apiClient.reversePlaylist();
      await updateSnapshot();
      toast({
        title: "Playlist Reversed",
        description: "Your playlist order has been reversed.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reverse playlist",
        variant: "destructive",
      });
    }
  };

  const handleUndoLastPlay = async () => {
    try {
      const result = await apiClient.undoLastPlay();
      await updateSnapshot();
      toast({
        title: "Play Undone",
        description: `Undid play of "${result.song.title}"`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No plays to undo",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Music className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold mb-2">Loading PlayWise...</h2>
          <p className="text-gray-300">Connecting to Flask backend...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="mt-2">
            <strong>Backend Connection Error</strong>
            <br />
            {error}
            <br /><br />
            To start the Flask backend:
            <br />
            <code className="text-sm bg-gray-100 p-1 rounded">python run_flask.py</code>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto py-8 px-4">
        <PlaywiseHeader 
          totalSongs={snapshot?.analytics.totalSongs || 0}
          totalDuration={snapshot?.analytics.totalDuration || 0}
          onAddDemo={initializeDemoData}
        />

        <Tabs defaultValue="playlist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="playlist" className="data-[state=active]:bg-purple-600">
              <Music className="w-4 h-4 mr-2" />
              Playlist
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ratings" className="data-[state=active]:bg-purple-600">
              <Star className="w-4 h-4 mr-2" />
              Ratings
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-purple-600">
              <Clock className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="blocklist" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Blocklist
            </TabsTrigger>
          </TabsList>

          {/* Playlist Tab */}
          <TabsContent value="playlist" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Add New Song</CardTitle>
                <CardDescription>Add songs to your playlist using doubly linked list</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="Song title"
                    value={newSong.title}
                    onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="Artist"
                    value={newSong.artist}
                    onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Input
                    type="number"
                    placeholder="Duration (seconds)"
                    value={newSong.duration || ''}
                    onChange={(e) => setNewSong({ ...newSong, duration: parseInt(e.target.value) || 0 })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button onClick={handleAddSong} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Song
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Current Playlist</CardTitle>
                  <CardDescription>Doubly linked list implementation - {snapshot?.songs.length || 0} songs</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSortPlaylist('title')} variant="outline" size="sm">
                    Sort by Title
                  </Button>
                  <Button onClick={() => handleSortPlaylist('artist')} variant="outline" size="sm">
                    Sort by Artist
                  </Button>
                  <Button onClick={() => handleSortPlaylist('duration')} variant="outline" size="sm">
                    Sort by Duration
                  </Button>
                  <Button onClick={handleReversePlaylist} variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {snapshot?.songs.map((song, index) => (
                    <div key={song.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">{index + 1}</Badge>
                        <div>
                          <p className="text-white font-medium">{song.title}</p>
                          <p className="text-gray-300 text-sm">{song.artist} • {formatDuration(song.duration)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button onClick={() => handlePlaySong(song.id)} size="sm" variant="outline">
                          <Play className="w-3 h-3" />
                        </Button>
                        <Button onClick={() => handleDeleteSong(index)} size="sm" variant="destructive">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!snapshot?.songs.length && (
                    <p className="text-gray-400 text-center py-8">No songs in playlist. Add some songs to get started!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Songs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{snapshot?.analytics.totalSongs || 0}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatDuration(snapshot?.analytics.totalDuration || 0)}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Plays</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{snapshot?.analytics.totalPlays || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Blocked Artists</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{snapshot?.analytics.blockedArtistsCount || 0}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Rating Distribution (BST)</CardTitle>
                <CardDescription>Songs organized by rating using Binary Search Tree</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = snapshot?.analytics.ratingDistribution[rating] || 0;
                    return (
                      <div key={rating} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {Array.from({ length: rating }, (_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            ))}
                          </div>
                          <span className="text-white">{rating} star{rating !== 1 ? 's' : ''}</span>
                        </div>
                        <Badge variant="outline">{count} songs</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings" className="space-y-6">
            {/* Search Section */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Search Songs (HashMap O(1) Lookup)</CardTitle>
                <CardDescription>Instant song lookup using hash table implementation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search by title or artist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
                
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-white font-medium">Search Results:</h4>
                    {searchResults.map(song => (
                      <div key={song.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{song.title}</p>
                          <p className="text-gray-300 text-sm">{song.artist} • {formatDuration(song.duration)}</p>
                        </div>
                        <Button onClick={() => handlePlaySong(song.id)} size="sm" variant="outline">
                          <Play className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {searchQuery && searchResults.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No songs found for "{searchQuery}"</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Rate Songs (Binary Search Tree)</CardTitle>
                <CardDescription>Rate songs 1-5 stars for efficient organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {snapshot?.songs.map(song => {
                    const currentRating = snapshot.ratings[song.id] || 0;
                    return (
                      <div key={song.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{song.title}</p>
                          <p className="text-gray-300 text-sm">{song.artist}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <button
                              key={rating}
                              onClick={() => handleRateSong(song.id, rating)}
                              className="p-1"
                            >
                              <Star 
                                className={`w-4 h-4 ${
                                  rating <= currentRating 
                                    ? 'fill-yellow-500 text-yellow-500' 
                                    : 'text-gray-400'
                                }`} 
                              />
                            </button>
                          ))}
                          <span className="text-white text-sm ml-2">
                            {currentRating > 0 ? `${currentRating}/5` : 'Not rated'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Playback History (Stack)</CardTitle>
                  <CardDescription>LIFO stack implementation for play history</CardDescription>
                </div>
                <Button onClick={handleUndoLastPlay} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Undo Last Play
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {snapshot?.history.map((song, index) => (
                    <div key={`${song.id}-${index}`} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <div>
                          <p className="text-white font-medium">{song.title}</p>
                          <p className="text-gray-300 text-sm">{song.artist}</p>
                        </div>
                      </div>
                      <Button onClick={() => handlePlaySong(song.id)} size="sm" variant="outline">
                        <Play className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {!snapshot?.history.length && (
                    <p className="text-gray-400 text-center py-8">No playback history yet. Play some songs!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blocklist Tab */}
          <TabsContent value="blocklist" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Add to Blocklist</CardTitle>
                <CardDescription>Block artists using HashSet for O(1) lookups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Artist name to block"
                    value={newArtistBlock}
                    onChange={(e) => setNewArtistBlock(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button onClick={handleBlockArtist} className="bg-red-600 hover:bg-red-700">
                    Block Artist
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Blocked Artists</CardTitle>
                <CardDescription>HashSet implementation - {snapshot?.blockedArtists.length || 0} blocked artists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {snapshot?.blockedArtists.map(artist => (
                    <div key={artist} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">{artist}</span>
                      <Button 
                        onClick={() => handleUnblockArtist(artist)} 
                        size="sm" 
                        variant="outline"
                        className="text-green-400 border-green-400 hover:bg-green-400 hover:text-black"
                      >
                        Unblock
                      </Button>
                    </div>
                  ))}
                  {!snapshot?.blockedArtists.length && (
                    <p className="text-gray-400 text-center py-8">No blocked artists.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
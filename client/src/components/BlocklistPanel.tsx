import { useState } from 'react';
import { Shield, Plus, Trash2, UserX, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BlocklistPanelProps {
  blockedArtists: string[];
  onAddToBlocklist: (artist: string) => void;
  onRemoveFromBlocklist: (artist: string) => void;
  snapshot: {
    songs: Array<{
      id: string;
      title: string;
      artist: string;
      duration: number;
    }>;
  };
}

export const BlocklistPanel = ({
  blockedArtists,
  onAddToBlocklist,
  onRemoveFromBlocklist,
  snapshot,
}: BlocklistPanelProps) => {
  const [newArtist, setNewArtist] = useState('');

  const handleAddArtist = () => {
    if (newArtist.trim() && !blockedArtists.includes(newArtist.toLowerCase())) {
      onAddToBlocklist(newArtist.trim());
      setNewArtist('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddArtist();
    }
  };

  // Get unique artists from current playlist
  const playlistArtists = Array.from(
    new Set(snapshot.songs.map(song => song.artist))
  ).sort();

  // Filter out already blocked artists
  const availableArtists = playlistArtists.filter(
    artist => !blockedArtists.includes(artist.toLowerCase())
  );

  // Count songs that would be affected by blocking
  const getAffectedSongsCount = (artist: string): number => {
    return snapshot.songs.filter(
      song => song.artist.toLowerCase() === artist.toLowerCase()
    ).length;
  };

  const totalBlockedSongs = blockedArtists.reduce((count, artist) => {
    return count + getAffectedSongsCount(artist);
  }, 0);

  return (
    <div className="space-y-6">
      <Card className="bg-music-sidebar border-border/50">
        <CardHeader>
          <CardTitle className="text-music-text-primary flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Artist Blocklist (Set Data Structure)
          </CardTitle>
          <CardDescription className="text-music-text-muted">
            Block artists to prevent their songs from being added to your playlist. Demonstrates set operations and duplicate prevention.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Blocklist Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-music-player rounded-lg border border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-music-text-primary">
                {blockedArtists.length}
              </div>
              <div className="text-sm text-music-text-muted">Blocked Artists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-music-text-primary">
                {totalBlockedSongs}
              </div>
              <div className="text-sm text-music-text-muted">Songs Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-music-text-primary">
                {availableArtists.length}
              </div>
              <div className="text-sm text-music-text-muted">Available Artists</div>
            </div>
          </div>

          {/* Add to Blocklist */}
          <div className="p-4 bg-music-player rounded-lg border border-border/50">
            <h3 className="text-lg font-semibold text-music-text-primary mb-4">
              Add Artist to Blocklist
            </h3>
            <div className="flex gap-4">
              <Input
                placeholder="Enter artist name..."
                value={newArtist}
                onChange={(e) => setNewArtist(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-music-sidebar border-border/50 text-music-text-primary"
              />
              <Button
                onClick={handleAddArtist}
                disabled={!newArtist.trim() || blockedArtists.includes(newArtist.toLowerCase())}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <UserX className="h-4 w-4 mr-2" />
                Block Artist
              </Button>
            </div>
            {newArtist.trim() && blockedArtists.includes(newArtist.toLowerCase()) && (
              <Alert className="mt-4 border-yellow-500 bg-yellow-50 text-yellow-800">
                <AlertDescription>
                  Artist "{newArtist}" is already in your blocklist.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Quick Add from Playlist */}
          {availableArtists.length > 0 && (
            <div className="p-4 bg-music-player rounded-lg border border-border/50">
              <h3 className="text-lg font-semibold text-music-text-primary mb-4">
                Quick Block from Current Playlist
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableArtists.map((artist) => {
                  const affectedCount = getAffectedSongsCount(artist);
                  return (
                    <div
                      key={artist}
                      className="flex items-center justify-between p-2 bg-music-sidebar rounded border border-border/50"
                    >
                      <div className="flex items-center space-x-3">
                        <Users className="h-4 w-4 text-music-text-muted" />
                        <span className="text-music-text-primary font-medium">{artist}</span>
                        <Badge variant="outline" className="border-border/50 text-music-text-muted">
                          {affectedCount} song{affectedCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onAddToBlocklist(artist)}
                      >
                        <UserX className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Current Blocklist */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-music-text-primary">
                Current Blocklist
              </h3>
              <Badge variant="secondary" className="bg-red-600 text-white">
                {blockedArtists.length} blocked
              </Badge>
            </div>

            {blockedArtists.length === 0 ? (
              <div className="text-center py-8 text-music-text-muted">
                <Shield className="h-12 w-12 mx-auto mb-4 text-music-text-muted/50" />
                <p>No artists blocked yet.</p>
                <p className="text-sm">Artists you block won't be able to be added to your playlist.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {blockedArtists.map((artist) => {
                  const affectedCount = getAffectedSongsCount(artist);
                  return (
                    <div
                      key={artist}
                      className="flex items-center justify-between p-3 bg-music-player rounded-lg border border-border/50 hover:bg-red-50/5 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <UserX className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="font-medium text-music-text-primary">
                            {artist}
                          </p>
                          {affectedCount > 0 && (
                            <p className="text-sm text-music-text-muted">
                              {affectedCount} song{affectedCount !== 1 ? 's' : ''} in playlist would be blocked
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRemoveFromBlocklist(artist)}
                        className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Unblock
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Blocklist Information */}
          <Alert className="border-blue-500 bg-blue-50/10">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-music-text-muted">
              <strong>How the blocklist works:</strong> When you try to add a song by a blocked artist, 
              it will be automatically rejected. This demonstrates the efficient lookup capabilities 
              of Set data structures - checking if an artist is blocked happens in O(1) constant time.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
import { History, Undo2, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Song } from '@/lib/playwise-engine';

interface HistoryPanelProps {
  history: Song[];
  onUndoLastPlay: () => Song | null;
  lastPlayed: Song | null;
}

export const HistoryPanel = ({
  history,
  onUndoLastPlay,
  lastPlayed,
}: HistoryPanelProps) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (index: number): string => {
    // Simulate timestamps based on reverse chronological order
    const now = Date.now();
    const minutes = (history.length - index) * 3; // 3 minutes apart
    const timestamp = now - (minutes * 60 * 1000);
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate play statistics
  const totalPlays = history.length;
  const uniqueSongs = new Set(history.map(song => song.id)).size;
  const totalDuration = history.reduce((acc, song) => acc + song.duration, 0);

  // Most played songs
  const playCount = history.reduce((acc, song) => {
    acc[song.id] = {
      song,
      count: (acc[song.id]?.count || 0) + 1
    };
    return acc;
  }, {} as Record<string, { song: Song; count: number }>);

  const mostPlayed = Object.values(playCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Recent artists
  const recentArtists = history
    .slice(-10)
    .reduce((acc, song) => {
      acc[song.artist] = (acc[song.artist] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topRecentArtists = Object.entries(recentArtists)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <Card className="bg-music-sidebar border-border/50">
        <CardHeader>
          <CardTitle className="text-music-text-primary flex items-center gap-2">
            <History className="h-5 w-5" />
            Playback History (Stack)
          </CardTitle>
          <CardDescription className="text-music-text-muted">
            Track your listening history and undo plays. Demonstrates stack (LIFO) data structure operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-music-player rounded-lg border border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-music-text-primary">{totalPlays}</div>
              <div className="text-sm text-music-text-muted">Total Plays</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-music-text-primary">{uniqueSongs}</div>
              <div className="text-sm text-music-text-muted">Unique Songs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-music-text-primary">
                {Math.floor(totalDuration / 60)}m
              </div>
              <div className="text-sm text-music-text-muted">Total Time</div>
            </div>
          </div>

          {/* Current Playing / Last Played */}
          {lastPlayed && (
            <div className="p-4 bg-music-player rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-music-text-primary flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last Played (Stack Top)
                </h3>
                <Button
                  onClick={onUndoLastPlay}
                  variant="outline"
                  size="sm"
                  className="border-border/50 text-music-text-primary hover:bg-music-accent hover:text-white"
                >
                  <Undo2 className="h-4 w-4 mr-2" />
                  Undo Last Play
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-music-sidebar rounded border border-border/50">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-music-text-primary truncate">
                    {lastPlayed.title}
                  </p>
                  <p className="text-sm text-music-text-muted truncate">
                    {lastPlayed.artist} • {formatDuration(lastPlayed.duration)}
                  </p>
                </div>
                <Badge className="bg-music-accent text-white">Playing</Badge>
              </div>
            </div>
          )}

          {/* Play History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-music-text-primary">
                Play History (Most Recent First)
              </h3>
              <Badge variant="secondary" className="bg-music-accent text-white">
                {history.length} plays
              </Badge>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-8 text-music-text-muted">
                No playback history yet. Start playing some songs!
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.slice().reverse().map((song, index) => (
                  <div
                    key={`${song.id}-${history.length - index}`}
                    className="flex items-center justify-between p-3 bg-music-player rounded-lg border border-border/50 hover:bg-music-accent/10 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant="outline"
                        className="border-border/50 text-music-text-muted text-xs"
                      >
                        #{history.length - index}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-music-text-primary truncate">
                          {song.title}
                        </p>
                        <p className="text-sm text-music-text-muted truncate">
                          {song.artist} • {formatDuration(song.duration)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-music-text-muted">
                        {formatTimestamp(index)}
                      </div>
                      {index === 0 && (
                        <Badge variant="outline" className="border-music-accent text-music-accent text-xs mt-1">
                          Latest
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Most Played Songs */}
          {mostPlayed.length > 0 && (
            <div className="p-4 bg-music-player rounded-lg border border-border/50">
              <h3 className="text-lg font-semibold text-music-text-primary flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4" />
                Most Played Songs
              </h3>
              <div className="space-y-2">
                {mostPlayed.map((item, index) => (
                  <div
                    key={item.song.id}
                    className="flex items-center justify-between p-2 bg-music-sidebar rounded border border-border/50"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="border-border/50 text-music-text-muted">
                        #{index + 1}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-music-text-primary truncate">
                          {item.song.title}
                        </p>
                        <p className="text-sm text-music-text-muted truncate">
                          {item.song.artist}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-music-accent text-white">
                      {item.count} plays
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Artists */}
          {topRecentArtists.length > 0 && (
            <div className="p-4 bg-music-player rounded-lg border border-border/50">
              <h3 className="text-lg font-semibold text-music-text-primary mb-4">
                Recent Favorite Artists
              </h3>
              <div className="flex flex-wrap gap-2">
                {topRecentArtists.map(([artist, count]) => (
                  <Badge
                    key={artist}
                    variant="outline"
                    className="border-music-accent text-music-accent"
                  >
                    {artist} ({count})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
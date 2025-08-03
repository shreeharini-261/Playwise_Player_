import React from 'react';
import { History, Undo2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Song, PlaywiseAnalytics } from '@/lib/playwise-engine';

interface HistoryPanelProps {
  recentHistory: Song[];
  onUndoLastPlay: () => Song | null;
  onPlaySong: (songId: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  recentHistory,
  onUndoLastPlay,
  onPlaySong
}) => {
  const handleUndo = () => {
    const undoneSeong = onUndoLastPlay();
    if (undoneSeong) {
      // Song was returned to playlist
    }
  };

  return (
    <Card className="bg-music-player border-border/50 shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-music-text-primary flex items-center">
            <History className="w-5 h-5 mr-2 text-music-accent" />
            Playback History
          </h2>
          
          <Button
            onClick={handleUndo}
            variant="outline"
            size="sm"
            disabled={recentHistory.length === 0}
            className="text-music-text-secondary border-border/50 hover:bg-music-accent/20"
          >
            <Undo2 className="w-4 h-4 mr-2" />
            Undo Last Play
          </Button>
        </div>

        <div className="space-y-2">
          {recentHistory.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-10 h-10 text-music-text-muted mx-auto mb-3" />
              <p className="text-music-text-muted">No songs played yet</p>
              <p className="text-sm text-music-text-muted/70 mt-1">Start playing songs to see history</p>
            </div>
          ) : (
            recentHistory.map((song, index) => (
              <div
                key={`${song.id}-${index}`}
                className="flex items-center justify-between p-3 rounded-lg bg-music-sidebar/50 hover:bg-music-sidebar/70 transition-colors border border-border/30"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-music-accent/20 text-music-accent text-xs font-medium">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-music-text-primary truncate">{song.title}</p>
                    <p className="text-sm text-music-text-muted truncate">{song.artist}</p>
                  </div>
                  
                  <div className="text-sm text-music-text-muted">
                    {PlaywiseAnalytics.formatDuration(song.duration)}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onPlaySong(song.id)}
                  className="w-8 h-8 p-0 hover:bg-music-accent/20 text-music-accent ml-2"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {recentHistory.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-xs text-music-text-muted">
              Showing {recentHistory.length} most recent songs • Stack-based LIFO implementation
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
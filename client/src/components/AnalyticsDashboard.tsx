import React from 'react';
import { Clock, TrendingUp, Star, Music, History, Ban } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlaywiseAnalytics, Song } from '@/lib/playwise-engine';

interface AnalyticsDashboardProps {
  snapshot: {
    totalSongs: number;
    totalDuration: number;
    longestSong: Song | null;
    shortestSong: Song | null;
    topLongestSongs: Song[];
    recentHistory: Song[];
    ratingStats: { [rating: number]: number };
    blockedArtists: string[];
    historySize: number;
  };
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ snapshot }) => {
  const {
    totalSongs,
    totalDuration,
    longestSong,
    shortestSong,
    topLongestSongs,
    recentHistory,
    ratingStats,
    blockedArtists,
    historySize
  } = snapshot;

  const maxRatingCount = Math.max(...Object.values(ratingStats));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-music-player border-border/50 shadow-card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-music-accent/20 flex items-center justify-center">
              <Music className="w-5 h-5 text-music-accent" />
            </div>
            <div>
              <p className="text-sm text-music-text-muted">Total Songs</p>
              <p className="text-2xl font-bold text-music-text-primary">{totalSongs}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-music-player border-border/50 shadow-card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-music-accent-secondary/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-music-accent-secondary" />
            </div>
            <div>
              <p className="text-sm text-music-text-muted">Total Duration</p>
              <p className="text-2xl font-bold text-music-text-primary">
                {PlaywiseAnalytics.formatDuration(totalDuration)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-music-player border-border/50 shadow-card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-music-text-muted">Play History</p>
              <p className="text-2xl font-bold text-music-text-primary">{historySize}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-music-player border-border/50 shadow-card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <Ban className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-music-text-muted">Blocked Artists</p>
              <p className="text-2xl font-bold text-music-text-primary">{blockedArtists.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Duration Extremes */}
        <Card className="bg-music-player border-border/50 shadow-card p-6">
          <h3 className="text-lg font-semibold text-music-text-primary mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-music-accent" />
            Duration Analysis
          </h3>
          
          <div className="space-y-4">
            {longestSong && (
              <div className="p-3 rounded-lg bg-music-sidebar/50 border border-border/30">
                <p className="text-sm text-music-text-muted mb-1">Longest Song</p>
                <p className="font-medium text-music-text-primary">{longestSong.title}</p>
                <p className="text-sm text-music-text-secondary">{longestSong.artist}</p>
                <p className="text-sm text-music-accent font-medium">
                  {PlaywiseAnalytics.formatDuration(longestSong.duration)}
                </p>
              </div>
            )}

            {shortestSong && (
              <div className="p-3 rounded-lg bg-music-sidebar/50 border border-border/30">
                <p className="text-sm text-music-text-muted mb-1">Shortest Song</p>
                <p className="font-medium text-music-text-primary">{shortestSong.title}</p>
                <p className="text-sm text-music-text-secondary">{shortestSong.artist}</p>
                <p className="text-sm text-music-accent font-medium">
                  {PlaywiseAnalytics.formatDuration(shortestSong.duration)}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Song Ratings */}
        <Card className="bg-music-player border-border/50 shadow-card p-6">
          <h3 className="text-lg font-semibold text-music-text-primary mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-music-accent" />
            Rating Distribution
          </h3>
          
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingStats[rating] || 0;
              const percentage = maxRatingCount > 0 ? (count / maxRatingCount) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm text-music-text-primary">{rating}</span>
                    <Star className="w-3 h-3 text-music-accent fill-current" />
                  </div>
                  <div className="flex-1">
                    <Progress value={percentage} className="h-2" />
                  </div>
                  <span className="text-sm text-music-text-muted w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Longest Songs */}
        <Card className="bg-music-player border-border/50 shadow-card p-6">
          <h3 className="text-lg font-semibold text-music-text-primary mb-4">
            Top 5 Longest Songs
          </h3>
          
          <div className="space-y-3">
            {topLongestSongs.slice(0, 5).map((song, index) => (
              <div key={song.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-music-sidebar/30 transition-colors">
                <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs border-music-accent text-music-accent">
                  {index + 1}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-music-text-primary truncate">{song.title}</p>
                  <p className="text-sm text-music-text-muted truncate">{song.artist}</p>
                </div>
                <span className="text-sm text-music-accent font-medium">
                  {PlaywiseAnalytics.formatDuration(song.duration)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent History */}
        <Card className="bg-music-player border-border/50 shadow-card p-6">
          <h3 className="text-lg font-semibold text-music-text-primary mb-4">
            Recent Play History
          </h3>
          
          <div className="space-y-3">
            {recentHistory.slice(0, 5).map((song, index) => (
              <div key={`${song.id}-${index}`} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-music-sidebar/30 transition-colors">
                <div className="w-2 h-2 rounded-full bg-music-accent"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-music-text-primary truncate">{song.title}</p>
                  <p className="text-sm text-music-text-muted truncate">{song.artist}</p>
                </div>
                <span className="text-sm text-music-text-muted">
                  {PlaywiseAnalytics.formatDuration(song.duration)}
                </span>
              </div>
            ))}
            
            {recentHistory.length === 0 && (
              <p className="text-center text-music-text-muted py-4">
                No songs played yet
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
import { useState } from 'react';
import { Star, Search, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Song } from '@/lib/playwise-engine';

interface RatingPanelProps {
  songs: Song[];
  onRateSong: (songId: string, rating: number) => void;
  onSearchByRating: (rating: number) => Song[];
  getSongRating: (songId: string) => number | null;
  snapshot: {
    ratings: Record<string, number>;
  };
}

export const RatingPanel = ({
  songs,
  onRateSong,
  onSearchByRating,
  getSongRating,
  snapshot,
}: RatingPanelProps) => {
  const [searchRating, setSearchRating] = useState<number>(5);
  const [searchResults, setSearchResults] = useState<Song[]>([]);

  const handleRating = (songId: string, rating: number) => {
    onRateSong(songId, rating);
  };

  const handleSearchByRating = () => {
    const results = onSearchByRating(searchRating);
    setSearchResults(results);
  };

  const renderStars = (songId: string, currentRating: number | null) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => handleRating(songId, rating)}
            className={`transition-colors ${
              currentRating && rating <= currentRating
                ? 'text-yellow-400'
                : 'text-gray-400 hover:text-yellow-300'
            }`}
          >
            <Star
              className={`h-4 w-4 ${
                currentRating && rating <= currentRating ? 'fill-current' : ''
              }`}
            />
          </button>
        ))}
        {currentRating && (
          <span className="text-sm text-music-text-muted ml-2">
            ({currentRating}/5)
          </span>
        )}
      </div>
    );
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate rating statistics
  const ratingStats = Object.values(snapshot.ratings).reduce((acc, rating) => {
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const totalRated = Object.keys(snapshot.ratings).length;
  const averageRating = totalRated > 0 
    ? Object.entries(snapshot.ratings).reduce((sum, [, rating]) => sum + rating, 0) / totalRated 
    : 0;

  return (
    <div className="space-y-6">
      <Card className="bg-music-sidebar border-border/50">
        <CardHeader>
          <CardTitle className="text-music-text-primary flex items-center gap-2">
            <Award className="h-5 w-5" />
            Rating System (Binary Search Tree)
          </CardTitle>
          <CardDescription className="text-music-text-muted">
            Rate songs and search by ratings. Demonstrates BST operations for efficient rating queries.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-music-player rounded-lg border border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-music-text-primary">
                {totalRated}
              </div>
              <div className="text-sm text-music-text-muted">Songs Rated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-music-text-primary">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-music-text-muted">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-4 w-4 ${
                      rating <= Math.round(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-music-text-muted">Overall</div>
            </div>
          </div>

          {/* Search by Rating */}
          <div className="p-4 bg-music-player rounded-lg border border-border/50">
            <h3 className="text-lg font-semibold text-music-text-primary mb-4">
              Search by Rating (BST Query)
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-music-text-muted">Rating:</span>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSearchRating(rating)}
                    className={`p-1 rounded transition-colors ${
                      searchRating === rating
                        ? 'bg-music-accent text-white'
                        : 'text-music-text-muted hover:text-music-text-primary'
                    }`}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        rating <= searchRating ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Button
                onClick={handleSearchByRating}
                className="bg-music-accent hover:bg-music-accent/80 text-white"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-music-text-primary">
                  Songs with {searchRating} star rating ({searchResults.length} found)
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {searchResults.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center justify-between p-2 bg-music-sidebar rounded border border-border/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-music-text-primary truncate">
                          {song.title}
                        </p>
                        <p className="text-sm text-music-text-muted truncate">
                          {song.artist}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-border/50 text-music-text-muted">
                        {formatDuration(song.duration)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Song Ratings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-music-text-primary">
                Rate Your Songs
              </h3>
              <Badge variant="secondary" className="bg-music-accent text-white">
                {songs.length} songs available
              </Badge>
            </div>

            {songs.length === 0 ? (
              <div className="text-center py-8 text-music-text-muted">
                No songs available for rating. Add some songs to your playlist first!
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {songs.map((song) => {
                  const currentRating = getSongRating(song.id);
                  return (
                    <div
                      key={song.id}
                      className="flex items-center justify-between p-3 bg-music-player rounded-lg border border-border/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-music-text-primary truncate">
                          {song.title}
                        </p>
                        <p className="text-sm text-music-text-muted truncate">
                          {song.artist} • {formatDuration(song.duration)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        {renderStars(song.id, currentRating)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Rating Distribution */}
          {totalRated > 0 && (
            <div className="p-4 bg-music-player rounded-lg border border-border/50">
              <h3 className="text-lg font-semibold text-music-text-primary mb-4">
                Rating Distribution
              </h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingStats[rating] || 0;
                  const percentage = totalRated > 0 ? (count / totalRated) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-16">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-sm text-music-text-primary">{rating}</span>
                      </div>
                      <div className="flex-1 bg-music-sidebar rounded-full h-2">
                        <div
                          className="bg-music-accent rounded-full h-2 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-music-text-muted w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
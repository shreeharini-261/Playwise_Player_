import React, { useState } from 'react';
import { Star, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Song, PlaywiseAnalytics } from '@/lib/playwise-engine';

interface RatingPanelProps {
  onRateSong: (songId: string, rating: number) => void;
  onSearchByRating: (rating: number) => Song[];
  allSongs: Song[];
}

export const RatingPanel: React.FC<RatingPanelProps> = ({
  onRateSong,
  onSearchByRating,
  allSongs
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [selectedSongForRating, setSelectedSongForRating] = useState<string>('');

  const handleSearchByRating = (rating: number) => {
    const results = onSearchByRating(rating);
    setSearchResults(results);
    setSelectedRating(rating);
  };

  const handleRateSong = () => {
    if (selectedSongForRating) {
      const rating = Math.floor(Math.random() * 5) + 1; // Random rating for demo
      onRateSong(selectedSongForRating, rating);
      setSelectedSongForRating('');
    }
  };

  return (
    <Card className="bg-music-player border-border/50 shadow-card">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-music-text-primary mb-6 flex items-center">
          <Star className="w-5 h-5 mr-2 text-music-accent" />
          Song Rating System
        </h2>

        {/* Rating Search */}
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-lg font-medium text-music-text-primary mb-3">Search by Rating</h3>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={selectedRating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSearchByRating(rating)}
                  className={selectedRating === rating 
                    ? "bg-music-accent hover:bg-music-accent/90" 
                    : "border-border/50 text-music-text-secondary"
                  }
                >
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  {rating}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-music-text-muted mb-2">
                Songs with {selectedRating} star{selectedRating !== 1 ? 's' : ''} ({searchResults.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {searchResults.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-music-sidebar/50 border border-border/30"
                  >
                    <div>
                      <p className="font-medium text-music-text-primary">{song.title}</p>
                      <p className="text-sm text-music-text-muted">{song.artist}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(song.rating || 0)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-music-accent fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-music-text-muted">
                        {PlaywiseAnalytics.formatDuration(song.duration)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rate Song */}
        <div className="border-t border-border/50 pt-6">
          <h3 className="text-lg font-medium text-music-text-primary mb-3">Rate a Song</h3>
          <div className="space-y-3">
            <select
              value={selectedSongForRating}
              onChange={(e) => setSelectedSongForRating(e.target.value)}
              className="w-full p-2 rounded-lg bg-music-sidebar border border-border/50 text-music-text-primary"
            >
              <option value="">Select a song to rate...</option>
              {allSongs.map((song) => (
                <option key={song.id} value={song.id}>
                  {song.title} - {song.artist}
                </option>
              ))}
            </select>

            <Button
              onClick={handleRateSong}
              disabled={!selectedSongForRating}
              className="w-full bg-music-accent hover:bg-music-accent/90"
            >
              Rate Song (Random Rating)
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
import { useState } from 'react';
import { Search, Music } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PlaywiseHeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const PlaywiseHeader = ({ onSearch, searchQuery }: PlaywiseHeaderProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = () => {
    onSearch(localQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-music-player border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-music-accent p-2 rounded-lg">
              <Music className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-music-text-primary">PlayWise</h1>
              <p className="text-sm text-music-text-muted">Smart Playlist Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-music-text-muted" />
              <Input
                type="text"
                placeholder="Search songs, artists..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 bg-music-sidebar border-border/50 text-music-text-primary placeholder-music-text-muted"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-music-accent hover:bg-music-accent/80 text-white"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
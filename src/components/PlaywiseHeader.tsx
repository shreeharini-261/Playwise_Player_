import React from 'react';
import { Music, Search, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PlaywiseHeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const PlaywiseHeader: React.FC<PlaywiseHeaderProps> = ({ onSearch, searchQuery }) => {
  return (
    <header className="bg-music-sidebar border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PlayWise
            </h1>
          </div>
          <span className="text-music-text-muted text-sm font-medium">
            Smart Playlist Engine
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-music-text-muted" />
            <Input
              type="text"
              placeholder="Search songs, artists..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 bg-music-player border-border/50 text-music-text-primary placeholder:text-music-text-muted"
            />
          </div>
          <Button variant="ghost" size="icon" className="text-music-text-secondary hover:text-music-text-primary">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
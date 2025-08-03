import React, { useState } from 'react';
import { Ban, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface BlocklistPanelProps {
  blockedArtists: string[];
  onAddToBlocklist: (artist: string) => void;
  onRemoveFromBlocklist: (artist: string) => void;
}

export const BlocklistPanel: React.FC<BlocklistPanelProps> = ({
  blockedArtists,
  onAddToBlocklist,
  onRemoveFromBlocklist
}) => {
  const [newArtist, setNewArtist] = useState('');

  const handleAddArtist = () => {
    if (newArtist.trim()) {
      onAddToBlocklist(newArtist.trim());
      setNewArtist('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddArtist();
    }
  };

  return (
    <Card className="bg-music-player border-border/50 shadow-card">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-music-text-primary mb-6 flex items-center">
          <Ban className="w-5 h-5 mr-2 text-destructive" />
          Artist Blocklist
        </h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter artist name to block..."
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-music-sidebar border-border/50"
            />
            <Button
              onClick={handleAddArtist}
              disabled={!newArtist.trim()}
              className="bg-destructive hover:bg-destructive/90"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-music-text-muted">
                Blocked Artists ({blockedArtists.length})
              </h3>
              {blockedArtists.length > 0 && (
                <p className="text-xs text-music-text-muted">
                  HashSet O(1) lookup
                </p>
              )}
            </div>

            {blockedArtists.length === 0 ? (
              <div className="text-center py-8">
                <Ban className="w-10 h-10 text-music-text-muted mx-auto mb-3" />
                <p className="text-music-text-muted">No artists blocked</p>
                <p className="text-sm text-music-text-muted/70 mt-1">Add artists to prevent their songs from being added</p>
              </div>
            ) : (
              <div className="space-y-2">
                {blockedArtists.map((artist) => (
                  <div
                    key={artist}
                    className="flex items-center justify-between p-3 rounded-lg bg-music-sidebar/50 border border-border/30"
                  >
                    <div className="flex items-center space-x-3">
                      <Ban className="w-4 h-4 text-destructive" />
                      <span className="font-medium text-music-text-primary">
                        {artist}
                      </span>
                    </div>
                    
                    <Button
                      onClick={() => onRemoveFromBlocklist(artist)}
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 hover:bg-destructive/20 text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {blockedArtists.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-music-sidebar/30 border border-border/30">
              <p className="text-xs text-music-text-muted">
                <strong>Implementation:</strong> Uses HashSet for O(1) constant-time artist lookup when adding songs. 
                Blocked artists are automatically filtered during song addition.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
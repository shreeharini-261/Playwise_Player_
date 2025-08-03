import React, { useState } from 'react';
import { Plus, Play, MoreVertical, ArrowUpDown, RotateCcw, Trash2, ArrowUp, ArrowDown, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Song, SortCriteria, SortOrder, PlaywiseAnalytics } from '@/lib/playwise-engine';

interface PlaylistPanelProps {
  songs: Song[];
  onAddSong: (title: string, artist: string, duration: number) => void;
  onDeleteSong: (index: number) => void;
  onMoveSong: (fromIndex: number, toIndex: number) => void;
  onReversePlayslist: () => void;
  onSortPlaylist: (criteria: SortCriteria, order: SortOrder) => void;
  onPlaySong: (songId: string) => void;
}

export const PlaylistPanel: React.FC<PlaylistPanelProps> = ({
  songs,
  onAddSong,
  onDeleteSong,
  onMoveSong,
  onReversePlayslist,
  onSortPlaylist,
  onPlaySong
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', artist: '', duration: '' });
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('addedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleAddSong = () => {
    if (newSong.title && newSong.artist && newSong.duration) {
      const duration = parseInt(newSong.duration) * 60; // Convert minutes to seconds
      onAddSong(newSong.title, newSong.artist, duration);
      setNewSong({ title: '', artist: '', duration: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleSort = () => {
    onSortPlaylist(sortCriteria, sortOrder);
  };

  return (
    <Card className="bg-music-player border-border/50 shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-music-text-primary mb-1">Current Playlist</h2>
            <p className="text-sm text-music-text-muted">
              {songs.length} songs • {PlaywiseAnalytics.formatDuration(PlaywiseAnalytics.getTotalDuration(songs))}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-music-text-secondary border-border/50">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-music-player border-border/50">
                <div className="p-3 space-y-3">
                  <div>
                    <Label className="text-xs text-music-text-muted">Sort by</Label>
                    <Select value={sortCriteria} onValueChange={(value) => setSortCriteria(value as SortCriteria)}>
                      <SelectTrigger className="bg-music-sidebar border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-music-player border-border/50">
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="artist">Artist</SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                        <SelectItem value="addedAt">Date Added</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-music-text-muted">Order</Label>
                    <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                      <SelectTrigger className="bg-music-sidebar border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-music-player border-border/50">
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSort} size="sm" className="w-full bg-music-accent hover:bg-music-accent/90">
                    Apply Sort
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReversePlayslist}
              className="text-music-text-secondary border-border/50"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-music-accent hover:bg-music-accent/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Song
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-music-player border-border/50">
                <DialogHeader>
                  <DialogTitle className="text-music-text-primary">Add New Song</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-music-text-secondary">Song Title</Label>
                    <Input
                      id="title"
                      value={newSong.title}
                      onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                      className="bg-music-sidebar border-border/50"
                      placeholder="Enter song title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="artist" className="text-music-text-secondary">Artist</Label>
                    <Input
                      id="artist"
                      value={newSong.artist}
                      onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                      className="bg-music-sidebar border-border/50"
                      placeholder="Enter artist name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-music-text-secondary">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newSong.duration}
                      onChange={(e) => setNewSong({ ...newSong, duration: e.target.value })}
                      className="bg-music-sidebar border-border/50"
                      placeholder="Enter duration in minutes"
                    />
                  </div>
                  <Button onClick={handleAddSong} className="w-full bg-music-accent hover:bg-music-accent/90">
                    Add Song
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-2">
          {songs.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-12 h-12 text-music-text-muted mx-auto mb-4" />
              <p className="text-music-text-muted">Your playlist is empty</p>
              <p className="text-sm text-music-text-muted/70 mt-1">Add some songs to get started</p>
            </div>
          ) : (
            songs.map((song, index) => (
              <div
                key={song.id}
                className="flex items-center justify-between p-3 rounded-lg bg-music-sidebar/50 hover:bg-music-sidebar/70 transition-colors border border-border/30"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onPlaySong(song.id)}
                    className="w-8 h-8 p-0 hover:bg-music-accent/20 text-music-accent"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-music-text-primary truncate">{song.title}</p>
                    <p className="text-sm text-music-text-muted truncate">{song.artist}</p>
                  </div>
                  
                  <div className="text-sm text-music-text-muted">
                    {PlaywiseAnalytics.formatDuration(song.duration)}
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => index > 0 && onMoveSong(index, index - 1)}
                    disabled={index === 0}
                    className="w-8 h-8 p-0 text-music-text-muted hover:text-music-text-primary"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => index < songs.length - 1 && onMoveSong(index, index + 1)}
                    disabled={index === songs.length - 1}
                    className="w-8 h-8 p-0 text-music-text-muted hover:text-music-text-primary"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-music-text-muted hover:text-music-text-primary">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-music-player border-border/50">
                      <DropdownMenuItem 
                        onClick={() => onDeleteSong(index)}
                        className="text-destructive hover:bg-destructive/20"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
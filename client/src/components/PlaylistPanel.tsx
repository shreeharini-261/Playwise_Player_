import { useState } from 'react';
import { Plus, Play, Trash2, ArrowUpDown, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Song, SortCriteria, SortOrder } from '@/lib/playwise-engine';

interface PlaylistPanelProps {
  songs: Song[];
  onAddSong: (title: string, artist: string, duration: number) => void;
  onDeleteSong: (index: number) => void;
  onMoveSong: (fromIndex: number, toIndex: number) => void;
  onReversePlayslist: () => void;
  onSortPlaylist: (criteria: SortCriteria, order: SortOrder) => void;
  onPlaySong: (songId: string) => void;
}

export const PlaylistPanel = ({
  songs,
  onAddSong,
  onDeleteSong,
  onMoveSong,
  onReversePlayslist,
  onSortPlaylist,
  onPlaySong,
}: PlaylistPanelProps) => {
  const [newSong, setNewSong] = useState({ title: '', artist: '', duration: '' });
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleAddSong = () => {
    if (newSong.title && newSong.artist && newSong.duration) {
      onAddSong(newSong.title, newSong.artist, parseInt(newSong.duration));
      setNewSong({ title: '', artist: '', duration: '' });
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSort = () => {
    onSortPlaylist(sortCriteria, sortOrder);
  };

  return (
    <Card className="bg-music-sidebar border-border/50">
      <CardHeader>
        <CardTitle className="text-music-text-primary flex items-center gap-2">
          <Play className="h-5 w-5" />
          Playlist Engine (Doubly Linked List)
        </CardTitle>
        <CardDescription className="text-music-text-muted">
          Add, remove, and manage songs in your playlist. Demonstrates doubly linked list operations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Song Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-music-player rounded-lg border border-border/50">
          <Input
            placeholder="Song title"
            value={newSong.title}
            onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
            className="bg-music-sidebar border-border/50 text-music-text-primary"
          />
          <Input
            placeholder="Artist"
            value={newSong.artist}
            onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
            className="bg-music-sidebar border-border/50 text-music-text-primary"
          />
          <Input
            placeholder="Duration (seconds)"
            type="number"
            value={newSong.duration}
            onChange={(e) => setNewSong({ ...newSong, duration: e.target.value })}
            className="bg-music-sidebar border-border/50 text-music-text-primary"
          />
          <Button 
            onClick={handleAddSong} 
            className="bg-music-accent hover:bg-music-accent/80 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Song
          </Button>
        </div>

        {/* Playlist Controls */}
        <div className="flex flex-wrap gap-4 p-4 bg-music-player rounded-lg border border-border/50">
          <div className="flex gap-2">
            <Select value={sortCriteria} onValueChange={(value: SortCriteria) => setSortCriteria(value)}>
              <SelectTrigger className="w-32 bg-music-sidebar border-border/50 text-music-text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="artist">Artist</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(value: SortOrder) => setSortOrder(value)}>
              <SelectTrigger className="w-32 bg-music-sidebar border-border/50 text-music-text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleSort}
              variant="outline"
              className="border-border/50 text-music-text-primary hover:bg-music-accent hover:text-white"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort (Merge Sort)
            </Button>
          </div>
          <Button 
            onClick={onReversePlayslist}
            variant="outline"
            className="border-border/50 text-music-text-primary hover:bg-music-accent hover:text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reverse Playlist
          </Button>
        </div>

        {/* Song List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-music-text-primary">
              Current Playlist ({songs.length} songs)
            </h3>
            <Badge variant="secondary" className="bg-music-accent text-white">
              Total: {songs.reduce((acc, song) => acc + song.duration, 0)} seconds
            </Badge>
          </div>
          
          {songs.length === 0 ? (
            <div className="text-center py-8 text-music-text-muted">
              No songs in playlist. Add some songs to get started!
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between p-3 bg-music-player rounded-lg border border-border/50 hover:bg-music-accent/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col space-y-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => index > 0 && onMoveSong(index, index - 1)}
                        disabled={index === 0}
                        className="h-6 w-6 p-0 text-music-text-muted hover:text-music-text-primary"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => index < songs.length - 1 && onMoveSong(index, index + 1)}
                        disabled={index === songs.length - 1}
                        className="h-6 w-6 p-0 text-music-text-muted hover:text-music-text-primary"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-music-text-primary truncate">{song.title}</p>
                      <p className="text-sm text-music-text-muted truncate">{song.artist}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-border/50 text-music-text-muted">
                      {formatDuration(song.duration)}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => onPlaySong(song.id)}
                      className="bg-music-accent hover:bg-music-accent/80 text-white"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteSong(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
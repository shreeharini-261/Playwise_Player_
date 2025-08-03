import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Users, Music } from 'lucide-react';

interface AnalyticsDashboardProps {
  snapshot: {
    songs: Array<{
      id: string;
      title: string;
      artist: string;
      duration: number;
    }>;
    history: Array<{
      id: string;
      title: string;
      artist: string;
      duration: number;
    }>;
    blockedArtists: string[];
    ratings: Record<string, number>;
  };
}

export const AnalyticsDashboard = ({ snapshot }: AnalyticsDashboardProps) => {
  // Calculate analytics data
  const totalSongs = snapshot.songs.length;
  const totalDuration = snapshot.songs.reduce((acc, song) => acc + song.duration, 0);
  const totalPlays = snapshot.history.length;
  const blockedCount = snapshot.blockedArtists.length;

  // Artist distribution
  const artistData = snapshot.songs.reduce((acc, song) => {
    acc[song.artist] = (acc[song.artist] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const artistChartData = Object.entries(artistData)
    .map(([artist, count]) => ({ artist, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Duration distribution
  const durationRanges = {
    'Short (< 3 min)': 0,
    'Medium (3-5 min)': 0,
    'Long (> 5 min)': 0
  };

  snapshot.songs.forEach(song => {
    if (song.duration < 180) durationRanges['Short (< 3 min)']++;
    else if (song.duration <= 300) durationRanges['Medium (3-5 min)']++;
    else durationRanges['Long (> 5 min)']++;
  });

  const durationChartData = Object.entries(durationRanges).map(([range, count]) => ({
    range,
    count
  }));

  // Rating distribution
  const ratingData = Object.values(snapshot.ratings).reduce((acc, rating) => {
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const ratingChartData = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} Star${rating > 1 ? 's' : ''}`,
    count: ratingData[rating] || 0
  }));

  // Most played artists
  const playedArtists = snapshot.history.reduce((acc, song) => {
    acc[song.artist] = (acc[song.artist] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPlayedArtists = Object.entries(playedArtists)
    .map(([artist, plays]) => ({ artist, plays }))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 5);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d084d0'];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-music-sidebar border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-music-text-muted">Total Songs</CardTitle>
            <Music className="h-4 w-4 text-music-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-music-text-primary">{totalSongs}</div>
          </CardContent>
        </Card>

        <Card className="bg-music-sidebar border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-music-text-muted">Total Duration</CardTitle>
            <Clock className="h-4 w-4 text-music-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-music-text-primary">{formatDuration(totalDuration)}</div>
          </CardContent>
        </Card>

        <Card className="bg-music-sidebar border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-music-text-muted">Total Plays</CardTitle>
            <TrendingUp className="h-4 w-4 text-music-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-music-text-primary">{totalPlays}</div>
          </CardContent>
        </Card>

        <Card className="bg-music-sidebar border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-music-text-muted">Blocked Artists</CardTitle>
            <Users className="h-4 w-4 text-music-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-music-text-primary">{blockedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Artist Distribution */}
        <Card className="bg-music-sidebar border-border/50">
          <CardHeader>
            <CardTitle className="text-music-text-primary">Artist Distribution</CardTitle>
            <CardDescription className="text-music-text-muted">
              Number of songs per artist in your playlist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={artistChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="artist" 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    color: '#F3F4F6'
                  }} 
                />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Duration Distribution */}
        <Card className="bg-music-sidebar border-border/50">
          <CardHeader>
            <CardTitle className="text-music-text-primary">Duration Distribution</CardTitle>
            <CardDescription className="text-music-text-muted">
              Songs grouped by duration ranges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={durationChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, count }) => `${range}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {durationChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    color: '#F3F4F6'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="bg-music-sidebar border-border/50">
          <CardHeader>
            <CardTitle className="text-music-text-primary">Rating Distribution</CardTitle>
            <CardDescription className="text-music-text-muted">
              Distribution of song ratings using BST analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="rating" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    color: '#F3F4F6'
                  }} 
                />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Played Artists */}
        <Card className="bg-music-sidebar border-border/50">
          <CardHeader>
            <CardTitle className="text-music-text-primary">Most Played Artists</CardTitle>
            <CardDescription className="text-music-text-muted">
              Artists with the most plays from your history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPlayedArtists.length === 0 ? (
                <p className="text-music-text-muted text-center py-4">
                  No playback history available
                </p>
              ) : (
                topPlayedArtists.map((item, index) => (
                  <div key={item.artist} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="border-border/50 text-music-text-muted">
                        #{index + 1}
                      </Badge>
                      <span className="text-music-text-primary font-medium">{item.artist}</span>
                    </div>
                    <Badge className="bg-music-accent text-white">
                      {item.plays} plays
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
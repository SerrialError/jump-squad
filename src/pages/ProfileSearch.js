import React, { useState, useEffect, useCallback } from 'react';
import supabase from '../components/Supabase';
import { useParams } from 'react-router-dom';
import { Typography, Container, Box, Avatar, TextField, Button } from '@mui/material';

function ProfileSearch() {
  const [profile, setProfile] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const [searchUsername, setSearchUsername] = useState(''); // State for search input
  const [searchResults, setSearchResults] = useState(null); // State for search results
  const [searchTotalHours, setSearchTotalHours] = useState(0); // State for search results total hours
  const { username } = useParams();

  const fetchProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, social, avatar_url, affiliation')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    }
  }, [username]);

  const fetchTotalHours = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('Statistics')
        .select('January, February, March, April, May, June, July, August, September, October, November, December')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching statistics:', error);
      } else {
        const total = Object.values(data).reduce((sum, value) => sum + (Number(value) || 0), 0);
        setTotalHours(total);
      }
    }
  }, [username]);

  useEffect(() => {
    fetchProfile();
    fetchTotalHours();
  }, [fetchProfile, fetchTotalHours]);

  async function handleSearchSubmit(event) {
    event.preventDefault();
    if (searchUsername) {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, social, avatar_url, affiliation')
        .eq('username', searchUsername)
        .single();

      if (error) {
        console.error('Error fetching search results:', error);
      } else {
        setSearchResults(data);
        // Fetch total hours for the searched username
        const { data: stats, error: statsError } = await supabase
          .from('Statistics')
          .select('January, February, March, April, May, June, July, August, September, October, November, December')
          .eq('username', searchUsername)
          .single();

        if (statsError) {
          console.error('Error fetching search statistics:', statsError);
        } else {
          const total = Object.values(stats).reduce((sum, value) => sum + (Number(value) || 0), 0);
          setSearchTotalHours(total);
        }
      }
    }
  }

  if (!profile) {
    return (
      <div>
        <header className="App-header">
          <Typography variant="h3">Please Login To View Profile Search.</Typography>
        </header>
      </div>
    )
  }

  return (
    <div>
      <header className="App-header">
        <Typography component="h1" variant="h3" gutterBottom>
          Profile Search
        </Typography>
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            label="Search by Username"
            variant="outlined"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              style: {
                backgroundColor: "white",
              },
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >Search</Button>
        </Box>
        {searchResults && (
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={searchResults.avatar_url}
              alt={searchResults.username}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="h4" gutterBottom>{searchResults.username}</Typography>
            <Typography variant="body1" gutterBottom>Affiliation: {searchResults.affiliation}</Typography>
            <Typography variant="body1" gutterBottom>Social Media: {searchResults.social}</Typography>
            <Typography variant="h6" gutterBottom>Total Volunteering Hours: {searchTotalHours}</Typography>
          </Box>
        )}
      </header>
    </div>
  );
}

export default ProfileSearch;

import React, { useState, useEffect } from 'react';
import supabase from '../components/Supabase';
import { Typography, Container, Box, Avatar } from '@mui/material';

function PublicProfile() {
  const [profile, setProfile] = useState(null);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    fetchProfile();
    fetchTotalHours();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, email, avatar_url, affiliation, social')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    }
  }

  async function fetchTotalHours() {
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
  }

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          src={profile.avatar_url}
          alt={profile.username}
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Typography variant="h4" gutterBottom>{profile.username}</Typography>
        <Typography variant="body1" gutterBottom>Email: {profile.email}</Typography>
        <Typography variant="body1" gutterBottom>Affiliation: {profile.affiliation}</Typography>
        <Typography variant="body1" gutterBottom>Social Media: {profile.social}</Typography>
        <Typography variant="h6" gutterBottom>Total Volunteering Hours: {totalHours}</Typography>
      </Box>
    </Container>
  );
}

export default PublicProfile;

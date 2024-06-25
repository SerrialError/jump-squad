import React, { useState, useEffect } from 'react';
import supabase from '../components/Supabase';
import Avatar from '../components/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import '../App.css';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [social, setSocial] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [description, setDescription] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);

      const { data: { session: userSession } } = await supabase.auth.getSession();
      setSession(userSession);

      if (!userSession || !userSession.user) {
        setLoading(false);
        return;
      }

      const { user } = userSession;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`username, social, avatar_url, description`)
        .eq('id', user.id)
        .single();

      if (!ignore) {
        if (profileError) {
          console.warn(profileError);
        } else if (profileData) {
          setUsername(profileData.username);
          setSocial(profileData.social);
          setAvatarUrl(profileData.avatar_url);
          setDescription(profileData.description);
        }
      }

      const { data: statsData, error: statsError } = await supabase
        .from('Statistics')
        .select()
        .eq('id', user.id)
        .single();

      if (!ignore) {
        if (statsError) {
          console.warn(statsError);
        } else if (statsData) {
          const monthlyHours = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          const totalHours = monthlyHours.reduce((acc, month) => acc + (Number(statsData[month]) || 0), 0);
          setTotalHours(totalHours);
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Typography component="h1" variant="h3" gutterBottom>
          Profile
        </Typography>
        {session && session.user ? (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Avatar url={avatar_url} size={150} />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {username}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {session.user.email}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {social}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {description}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Total Volunteering Hours: {totalHours}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Typography variant="body1">Please sign in to view your profile.</Typography>
        )}
      </header>
    </div>
  );
}


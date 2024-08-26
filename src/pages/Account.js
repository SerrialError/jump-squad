import '../App.css';
import supabase from '../components/Supabase';
import Avatar from '../components/AvatarUpload';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const affiliations = [
  // 'Full Gospel Las Vegas Church',
  'No Affiliation',
];

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [social, setSocial] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [affiliation, setAffiliation] = useState('No Affiliation');

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, social, avatar_url, affiliation`)
        .eq('id', user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setSocial(data.social);
          setAvatarUrl(data.avatar_url);
	        setAffiliation(data.affiliation);
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  async function updateProfile(event, avatarUrl) {
    event.preventDefault();

    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      username,
      social,
      avatar_url: avatarUrl,
      updated_at: new Date(),
      affiliation,
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      alert(error.message);
    } else {
      setAvatarUrl(avatarUrl);
    }
    setLoading(false);
  }
  
  const handleChange = (event) => {
    setAffiliation(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Typography component="h1" variant="h3" gutterBottom>
          Profile Information
        </Typography>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box component="form" onSubmit={updateProfile} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={session.user.email}
                disabled
                color="primary"
                InputProps={{
                  style: {
                    backgroundColor: 'white',
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Name"
                name="username"
                autoComplete="username"
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                color="primary"
                InputProps={{
                  style: {
                    backgroundColor: 'white',
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="affiliation"
                label="Affiliation"
                name="affiliation"
                select
                value={affiliation}
                onChange={handleChange}
                color="primary"
                InputProps={{
                  style: {
                    backgroundColor: 'white',
                  },
                }}
              >
                {affiliations.map((affiliation) => (
                  <MenuItem key={affiliation} value={affiliation}>
                    {affiliation}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="normal"
                fullWidth
                id="social"
                label="Social Media"
                name="Social"
                autoComplete="social"
                value={social || ''}
                onChange={(e) => setSocial(e.target.value)}
                color="primary"
                InputProps={{
                  style: {
                    backgroundColor: 'white',
                  },
                }}
              />
              <Typography component="h1" variant="h5" gutterTop>
                Upload Profile Picture
              </Typography>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Avatar
                  url={avatar_url}
                  size={150}
                  onUpload={(event, url) => {
                    updateProfile(event, url)
                  }}
                />
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Update Profile'}
              </Button>
            </Box>
          </Box>
        </Container>
      </header>
    </div>
  );
}


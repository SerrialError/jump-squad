import '../App.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import supabase from '../components/Supabase';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import TwitterIcon from '@mui/icons-material/Twitter';
import XIcon from '@mui/icons-material/X';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signUpNewUser() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: 'https://jumpsquad.teambirb.com/Login',
      },
    });
    setLoading(false);
    if (error) {
      console.error("Error during sign-up:", error);
    } else {
      console.log("Sign-up data:", data);
    }
  }

  async function signInWithGithub() {
    const { data: githubData, error: githubError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `https://jumpsquad.teambirb.com`,
      },
    });
    if (githubError) {
      console.error("Error during GitHub sign-in:", githubError);
    } else {
      console.log("GitHub sign-in data:", githubData);
    }
  }

  async function signInWithGoogle() {
    const { data: googleData, error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://jumpsquad.teambirb.com`,
      },
    });
    if (googleError) {
      console.error("Error during Google sign-in:", googleError);
    } else {
      console.log("Google sign-in data:", googleData);
    }
  }

  async function signInWithMicrosoft() {
    const { data: microsoftData, error: microsoftError } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `https://jumpsquad.org`,
      },
    });
    if (microsoftError) {
      console.error("Error during Microsoft sign-in:", microsoftError);
    } else {
      console.log("Microsoft sign-in data:", microsoftData);
    }
  }

  async function signInWithTwitter() {
    const { data: twitterData, error: twitterError } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `https://jumpsquad.org`,
      },
    });
    if (twitterError) {
      console.error("Error during Twitter sign-in:", twitterError);
    } else {
      console.log("Twitter sign-in data:", twitterData);
    }
  }

  const handleLogin = () => {
    navigate("/Login");
  };

  return (
    <div className="App">
      <header className="App-header">
        <Typography component="h1" variant="h3" gutterBottom>
          Sign up to Jump Squad
        </Typography>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="form" onSubmit={signUpNewUser} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              color="primary"
              InputProps={{
                style: {
                  backgroundColor: 'white',
                },
              }}
            />
            <FormControlLabel
              control={<Checkbox checked={showPassword} onChange={() => setShowPassword(!showPassword)} color="primary" style={{ color: 'white' }}/>}
              label="Show Password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" style={{ color: 'white' }}/>}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Signup with Email"}
            </Button>
              <Box display="flex" justifyContent="center">
                <Grid item>
                  <Link href="#" variant="body2" onClick={handleLogin}>
                    {"Already have an account? Log in."}
                  </Link>
                </Grid>
              </Box>
          </Box>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={signInWithGoogle}
          >
            <GoogleIcon sx={{ mr: 1 }} />
            Sign Up with Google
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            onClick={signInWithMicrosoft}
          >
            <MicrosoftIcon sx={{ mr: 1 }} />
            Sign Up with Microsoft
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            onClick={signInWithTwitter}
          >
            <XIcon sx={{ mr: 1 }} />
            <TwitterIcon sx={{ mr: 1 }} />
            Sign Up with Twitter
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            onClick={signInWithGithub}
          >
            <GitHubIcon sx={{ mr: 1 }} />
            Sign Up with GitHub
          </Button>
        </Box>
      </Container>
      </header>
    </div>
  );
}

export default Signup;

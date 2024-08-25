import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Grid, Paper, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Carousel from 'react-material-ui-carousel';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import supabase from '../components/Supabase';
import '../App.css';
import { opportunities, featuredOpportunityIds } from '../components/opportunities';
import { fullGospel } from '../components/affiliation-opportunities';
import fglv from '../images/fglv.png';
import village from '../images/opportunity-village.png';
import project150 from '../images/project150.png';
import lvrm from '../images/lvrm.png';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

function Dashboard() {
  const [affiliation, setAffiliation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const localizer = momentLocalizer(moment);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const checkAuthStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  const fetchCalendarEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('directory_events')
        .select('*')
        .eq('user_id', user.id);
      if (error) {
        console.error('Error fetching calendar events:', error);
      } else {
        setCalendarEvents(data.map(event => ({
          title: event.name,
          start: new Date(event.date),
          end: new Date(event.date),
          location: event.location,
          allDay: true,
        })));
      }
    }
  };

  const fetchFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('favorites')
        .select('name')
        .eq('user_id', user.id);
      if (error) {
        console.error('Error adding favorites:', error);
      } else {
        setFavorites(data.map(favorite => favorite.name));
      }
    }
  };

  const toggleFavorite = async (opportunity) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      if (favorites.includes(opportunity.name)) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('name', opportunity.name);
        if (error) {
          console.error('Error removing favorite:', error);
          alert('Failed to remove opportunity from favorites. Please try again.');
        } else {
          setFavorites(prevFavorites => prevFavorites.filter(name => name !== opportunity.name));
        }
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            name: opportunity.name
           });
        if (error) {
          console.error('Error adding favorite:', error);
          alert('Failed to add opportunity to favorites. Please try again.');
        } else {
          setFavorites(prevFavorites => [...prevFavorites, opportunity.name]);
        }
      }
    } else {
      alert('Please sign in to manage your favorites.');
    }
  };

  const addToCalendar = async (opportunity) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      if (calendarEvents.find(event => event.title === opportunity.name)) {
        const { error } = await supabase
          .from('directory_events')
          .delete()
          .eq('user_id', user.id)
          .eq('name', opportunity.name);
        if (error) {
          console.error('Error removing event from calendar:', error);
          alert('Failed to remove opportunity from calendar. Please try again.');
        } else {
          setCalendarEvents(prev => prev.filter(event => event.title !== opportunity.name));
          alert('Event removed from calendar!');
        }
      } else {
        const { error } = await supabase
          .from('directory_events')
          .insert({
            user_id: user.id,
            name: opportunity.name,
            date: opportunity.date,
            location: opportunity.location
          });
        if (error) {
          console.error('Error adding event to calendar:', error);
          alert('Failed to add opportunity to calendar. Please try again.');
        } else {
          setCalendarEvents(prev => [...prev, {
            title: opportunity.name,
            start: new Date(opportunity.date),
            end: new Date(opportunity.date),
            location: opportunity.location,
            allDay: true,
          }]);
          alert('Event added to calendar!');
        }
      }
    } else {
      alert('Please sign in to manage your calendar events.');
    }
  };

  useEffect(() => {
    async function fetchEvents() {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setError('Please sign in to view Leaderboard');
        setAffiliation("No Affiliation");
        setLoading(false);
        return;
      }
    }

    async function fetchAffiliations() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setError('Please sign in to view Leaderboard');
	      setAffiliation("No Affiliation");
        setLoading(false);
        return;
      }

      const { data: affData, error: affError } = await supabase
        .from('profiles')
        .select('affiliation')
        .eq('id', user.id)
        .single();

      if (affError) {
        console.warn(affError);
      } else if (affData) {
        setAffiliation(affData.affiliation);
      }

      setLoading(false);
    }

    checkAuthStatus();
    if (isAuthenticated) {
      fetchCalendarEvents();
    }

    fetchEvents();
    fetchAffiliations();
    fetchFavorites();
  }, [affiliation, isAuthenticated]);

  const carouselItems = [
    {
      image: village,
      description: 'Image 1 description',
    },
    {
      image: project150,
      description: 'Image 2 description',
    },
    {
      image: lvrm,
      description: 'Image 3 description',
    },
  ];

  const featuredOpportunities = opportunities.filter(opportunity =>
    featuredOpportunityIds.includes(opportunity.id)
  );

  return (
    <div className="App">
      <header className="App-header">
        <Typography component="h1" variant="h3" gutterBottom>
          Dashboard
        </Typography>
        <div style={{ width: "100%", height: "500px" }}>
          <Carousel>
            {carouselItems.map((item, index) => (
              <div key={index}>
                <img
                  src={item.image}
                  alt={`Carousel Item ${index}`}
                  style={{
                    width: "100%",
                    height: "500px",
                    objectFit: "cover",
                  }}
                />
                <Typography variant="body1" align="center" gutterBottom>
                  {item.description}
                </Typography>
              </div>
            ))}
          </Carousel>
        </div>
        {isAuthenticated ? (
          <>
            <Typography variant="h3" component="h2" marginTop="75px">
              Schedule
            </Typography>
            <Paper
              style={{
                display: "flex",
                height: "43vh",
                width: "80%",
                justifyContent: "center",
                margin: "auto",
                marginTop: "10px",
                padding: "5px"
              }}
            >
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
              />
            </Paper>
          </>
        ) : (
          <Typography variant="h6" component="h2" marginTop="20px">
            Please sign in to view your schedule and manage your favorites.
          </Typography>
        )}
        <Typography variant="h3" component="h2" marginTop="75px">
          Featured Community Service Options
        </Typography>
        <Grid container spacing={3} marginTop="20px">
          {featuredOpportunities.map((opportunity) => (
            <Grid item xs={12} sm={6} md={4} key={opportunity.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={opportunity.image}
                  alt={opportunity.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {opportunity.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {opportunity.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(opportunity.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location: {opportunity.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contact: {opportunity.contact}
                  </Typography>
                  {isAuthenticated && (
                    <div>
                      <Button
                        onClick={() => toggleFavorite(opportunity)}
                        variant="contained"
                        startIcon={favorites.includes(opportunity.name) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      >
                        {favorites.includes(opportunity.name) ? 'Unfavorite' : 'Favorite'}
                      </Button>
                      <Button
                        onClick={() => addToCalendar(opportunity)}
                        variant="contained"
                        startIcon={<AddIcon />}
                      >
                        Add to Calendar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Typography variant="h3" component="h2" marginTop="75px">
          Affiliation Community Service Options
        </Typography>
        <Grid container spacing={3} marginTop="20px">
          {fullGospel.map((opportunity) => (
            <Grid item xs={12} sm={6} md={4} key={opportunity.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={opportunity.image}
                  alt={opportunity.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {opportunity.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {opportunity.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(opportunity.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location: {opportunity.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contact: {opportunity.contact}
                  </Typography>
                  {isAuthenticated && (
                    <div>
                      <Button
                        onClick={() => toggleFavorite(opportunity)}
                        variant="contained"
                        startIcon={favorites.includes(opportunity.name) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      >
                        {favorites.includes(opportunity.name) ? 'Unfavorite' : 'Favorite'}
                      </Button>
                      <Button
                        onClick={() => addToCalendar(opportunity)}
                        variant="contained"
                        startIcon={<AddIcon />}
                      >
                        Add to Calendar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </header>
    </div>
  );
}

export default Dashboard;


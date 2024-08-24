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
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const localizer = momentLocalizer(moment);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
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
          // maybe add feature to set times that you will attend the opportunity?
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
        setFavorites(data.map(favorite => favorite.opportunity.name));
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
          setFavorites(prevFavorites => prevFavorites.filter(id => id !== opportunity.name));
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
      if (calendarEvents.includes(opportunity.name)) {
        const { error } = await supabase
          .from('directory_events')
          .delete()
          .eq('user_id', user.id)
          .eq('name', opportunity.name);
        if (error) {
          console.error('Error removing event from calendar:', error);
          alert('Failed to remove opportunity from calendar. Please try again.');
        } else {
          setCalendarEvents(prev => prev.filter(name => name !== opportunity.name));
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
          setCalendarEvents(prev => [...prev, opportunity.name]);
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
  }, [affiliation]);

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
                padding: "20px",
                backgroundColor: "rgb(255, 255, 255)",
                borderRadius: "5px",
                marginTop: "15px",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <div style={{ height: 500, marginBottom: "25px" }}>
                    <Calendar
                      localizer={localizer}
                      events={calendarEvents}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: "100%" }}
                      views={["month", "week", "agenda"]}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h4"
                    component="h2"
                    align="center"
                    gutterBottom
                  >
                    Your Volunteer Schedule
                  </Typography>
                  {calendarEvents.length > 0 ? (
                    <Grid container spacing={2}>
                      {calendarEvents.map((event, index) => (
                        <Grid item xs={12} key={index}>
                          <Card className="card">
                            <CardContent>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {event.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Date: {event.start.toLocaleDateString()}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Location: {event.location || "Not specified"}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body1" align="center">
                      You have no upcoming volunteer events. Check out the
                      opportunities below!
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </>
        ) : (
          <Typography variant="h5" component="h2" marginTop="75px">
            Please sign in to view your schedule.
          </Typography>
        )}

        <div style={{ marginTop: "25px" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Featured Opportunities for {formattedDate}
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {featuredOpportunities.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={8}>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          align="center"
                        >
                          <Link
                            href={item.contact}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="textPrimary"
                            underline="hover"
                            className="App-Link"
                          >
                            {item.name}
                          </Link>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <CardMedia
                          className="img-dashboard-table"
                          component="img"
                          height="60"
                          image={item.image}
                          alt={item.name}
                        />
                      </Grid>
                    </Grid>
                      <Typography color="textSecondary">
                        {item.organization}
                      </Typography>
                      <Typography variant="body2" component="p">
                        {item.description}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Date: {item.date.toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Location: {item.location}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Contact: {item.contact}
                      </Typography>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        sx={{ position: "absolute", top: 5, right: 5 }}
                      >
                        {favorites.includes(item.id) ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCalendar(item);
                        }}
                        sx={{ position: "absolute", top: 5, right: 40 }}
                      >
                        {calendarEvents.includes(item.name) ? (
                          <CheckIcon />
                        ) : (
                          <AddIcon />
                        )}
                      </Button>
                    </CardContent>
                  </Card>
              </Grid>
            ))}
          </Grid>
        </div>
        <div style={{ marginTop: "25px", width: "100%" }}>
          {affiliation !== "No Affiliation" && (
            <>
              <Typography
                variant="h4"
                component="h2"
                align="center"
                gutterBottom
              >
                Opportunities with {affiliation}
              </Typography>
              <Grid container spacing={3} justifyContent="center">
                {fullGospel.map((item, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card className="card">
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={8}>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                              align="center"
                            >
                              <Link
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="textPrimary"
                                underline="hover"
                                className="App-Link"
                              >
                                {item.name}
                              </Link>
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CardMedia
                              className="img-dashboard-table"
                              component="img"
                              height="60"
                              image={item.image}
                              alt={item.name}
                            />
                          </Grid>
                        </Grid>
                        <Typography
                          color="textSecondary"
                          className="card-content"
                          variant="body2"
                          component="p"
                        >
                          {item.description}
                        </Typography>
                      </CardContent>
                      <Divider />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default Dashboard;

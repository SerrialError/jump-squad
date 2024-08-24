import '../App.css';
import React, { useState, Component, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Card, CardContent, Grid } from '@mui/material';
import { Modal, Button } from '@mui/material';
import Link from '@mui/material/Link';
import CardMedia from '@mui/material/CardMedia';
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import GoogleMapReact from "google-map-react";
import supabase from '../components/Supabase';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { opportunities } from '../components/opportunities';

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [filterEl, setFilterEl] = React.useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const handleApiLoaded = (map, maps) => {
    if (selectedOpportunity) {
      const marker = new maps.Marker({
        position: {
          lat: parseFloat(selectedOpportunity.latitude),
          lng: parseFloat(selectedOpportunity.longitude)
        },
        map,
        title: selectedOpportunity.name
      });

      const infoWindow = new maps.InfoWindow({
        content: `<div>
          <h3>${selectedOpportunity.name}</h3>
          <h3>${selectedOpportunity.location}</h3>
        </div>`
      });
  
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
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
        console.error('Error fetching favorites:', error);
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
  
  const fetchCalendarEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('directory_events')
        .select('name')
        .eq('user_id', user.id);
      if (error) {
        console.error('Error fetching calendar events:', error);
      } else {
        setCalendarEvents(data.map(event => event.name));
      }
    }
  };

  const filteredOpportunities = opportunities.filter((opportunity) =>
    opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!showOnlyFavorites || favorites.includes(opportunity.id))
  );

  const handleOpenModal = (opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const handleCloseModal = () => {
    setSelectedOpportunity(null);
  };  

  const handleFilterClick = (e) => {
    setFilterEl(e.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterEl(null);
  };

  const handleFavoriteClick = () => {
    setShowOnlyFavorites(!showOnlyFavorites);
  };

  const filterPopoverOpen = Boolean(filterEl);

  useEffect(() => {
    fetchCalendarEvents();
    fetchFavorites();
  }, []);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <Typography component="h1" variant="h3" gutterBottom>
            Directory (delete not working)
          </Typography>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginBottom: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <TextField
                  margin="normal"
                  fullWidth
                  id="search"
                  label="Search Opportunities"
                  name="search"
                  autoComplete="search"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  color="primary"
                  InputProps={{
                    style: {
                      backgroundColor: "white",
                    },
                  }}
                />
                <Button
                  variant="light"
                  aria-label="account options"
                  onClick={handleFilterClick}
                >
                  <FilterAltOutlinedIcon sx={{ fontSize: "2rem" }} />
                </Button>
              </Box>
              <Popover
                open={filterPopoverOpen}
                anchorEl={filterEl}
                onClose={handleFilterClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <List disablePadding>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleFavoriteClick}>
                      <ListItemText
                        primary={
                          showOnlyFavorites ? "Show All" : "Show Only Favorites"
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Popover>
            </Box>
          </Container>
          <Grid
            container
            spacing={3}
            sx={{ "& .MuiGrid-item": { height: "100" } }}
          >
            {filteredOpportunities.map((opportunity) => (
              <Grid item xs={12} sm={6} md={4} key={opportunity.id}>
                <Box sx={{ height: "100%" }}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={() => handleOpenModal(opportunity)}
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
                            href={opportunity.contact}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="textPrimary"
                            underline="hover"
                            className="App-Link"
                          >
                            {opportunity.name}
                          </Link>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <CardMedia
                          className="img-dashboard-table"
                          component="img"
                          height="60"
                          image={opportunity.image}
                          alt={opportunity.name}
                        />
                      </Grid>
                    </Grid>
                      <Typography color="textSecondary">
                        {opportunity.organization}
                      </Typography>
                      <Typography variant="body2" component="p">
                        {opportunity.description}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Date: {opportunity.date.toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Location: {opportunity.location}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Contact: {opportunity.contact}
                      </Typography>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(opportunity.id);
                        }}
                        sx={{ position: "absolute", top: 5, right: 5 }}
                      >
                        {favorites.includes(opportunity.id) ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCalendar(opportunity);
                        }}
                        sx={{ position: "absolute", top: 5, right: 40 }}
                      >
                        {calendarEvents.includes(opportunity.name) ? (
                          <CheckIcon />
                        ) : (
                          <AddIcon />
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>
        </header>
      </div>
      <Modal
        open={selectedOpportunity !== null}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedOpportunity && (
            <>
              <Typography id="modal-title" variant="h6" component="h2">
                {selectedOpportunity.name}
              </Typography>
              <Box sx={{ display: "flex", mt: 2 }}>
                <Box sx={{ width: "50%", mr: 2 }}>
                  <img
                    src={selectedOpportunity.image}
                    alt={selectedOpportunity.name}
                    style={{ width: "100%", height: "auto" }}
                  />
                </Box>
                <Box sx={{ width: "50%" }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                    }}
                    center={{
                      lat: parseFloat(selectedOpportunity.latitude),
                      lng: parseFloat(selectedOpportunity.longitude),
                    }}
                    defaultZoom={17}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) =>
                      handleApiLoaded(map, maps)
                    }
                  />
                </Box>
              </Box>
              <Typography id="modal-description" sx={{ mt: 2 }}>
                {selectedOpportunity.description}
              </Typography>
              <Button onClick={handleCloseModal}>Close</Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Directory;

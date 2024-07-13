import '../App.css';
import React, { useState, Component } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Card, CardContent, Grid } from '@mui/material';
import { Modal, Button } from '@mui/material';
import GoogleMapReact from "google-map-react";
import noimage from '../images/no-image.png';

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const ClickableMarker = ({ text, info }) => {
    const [showInfo, setShowInfo] = useState(false);
  
    console.log(selectedOpportunity.latitude, selectedOpportunity.longitude);

    return (
      <div
        onClick={() => setShowInfo(!showInfo)}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          color: 'red',
          fontSize: '30px',
          transform: 'translate(-50%, -50%)',
          cursor: 'pointer'
        }}
      >
        {text}
        {showInfo && (
          <div style={{
            position: 'absolute',
            backgroundColor: 'white',
            padding: '5px',
            borderRadius: '5px',
            fontSize: '14px',
            color: 'black',
            width: '150px',
            zIndex: 1000
          }}>
            {info}
          </div>
        )}
      </div>
    );
  };

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

  const opportunities = [
    {
      id: 1,
      name: 'Opportunity Village Thrift Store',
      organization: 'Opportunity Village',
      description: 'Join us at our thrift store volunteers assist with sorting, placing, organizing, and moving donations.',
      location: 'Downtown Las Vegas',
      latitude: '36.16886114726847',
      longitude: '-115.2072297310761',
      contact: 'https://www.opportunityvillage.org/thrift-store',
      image: noimage,
    },
    {
      id: 2,
      name: 'Project 150',
      organization: 'Homeless Kids',
      description: 'Project 150 started in December 2011, when we learned that the Clark County School District has an overwhelming number of homeless teenagers attending school.',
      location: 'Downtown Las Vegas',
      contact: 'https://www.opportunityvillage.org/thrift-store',
      image: noimage,
    },
    {
      id: 3,
      name: 'Las Vegas Rescue Mission',
      organization: 'Local Food Organization',
      description: 'Founded in 1970, the Las Vegas Rescue Mission (LVRM) started with a small storefront building that included the chapel, kitchen and a shelter that could house a few men.',
      location: 'East Las Vegas',
      contact: 'https://www.opportunityvillage.org/thrift-store',
      image: noimage,
    },
    {
      id: 4,
      name: 'Animal Shelter Volunteer',
      organization: 'Local Animal Shelter',
      description: 'Help care for and socialize with the animals at the shelter.',
      location: 'North Las Vegas',
      contact: 'https://www.opportunityvillage.org/thrift-store',
      image: noimage,
    },
    {
      id: 5,
      name: 'Goodie Two Shoes Foundation',
      organization: 'Feet Organization',
      description: 'Our programming is based on the premise that we do not just provide a child with a new pair of shoes. We measure their feet on-site to ensure proper fit.',
      location: 'West Las Vegas',
      contact: 'https://www.opportunityvillage.org/thrift-store',
      image: noimage,
    },
    {
      id: 6,
      name: 'Test Foundation',
      organization: 'Hello organization',
      description: 'This is a test to make sure the grid height works. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      location: 'Las Vegas',
      contact: 'https://www.opportunityvillage.org/thrift-store',
      image: noimage,
    }
  ];

  const filteredOpportunities = opportunities.filter((opportunity) =>
    opportunity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const handleCloseModal = () => {
    setSelectedOpportunity(null);
  };  

  return (
    <>
      <div className="App">
        <header className="App-header">
          <Typography component="h1" variant="h3" gutterBottom>
            Directory
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
                    }}
                    onClick={() => handleOpenModal(opportunity)}
                  >
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {opportunity.name}
                      </Typography>
                      <Typography color="textSecondary">
                        {opportunity.organization}
                      </Typography>
                      <Typography variant="body2" component="p">
                        {opportunity.description}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Location: {opportunity.location}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Contact: {opportunity.contact}
                      </Typography>
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

import '../App.css';
import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Card, CardContent, Grid } from '@mui/material';

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const opportunities = [
    {
      id: 1,
      name: 'Opportunity Village Thrift Store',
      organization: 'Opportunity Village',
      description: 'Join us at our thrift store volunteers assist with sorting, placing, organizing, and moving donations.',
      location: 'Downtown Las Vegas',
      contact: 'https://www.opportunityvillage.org/thrift-store',
    },
    {
      id: 2,
      name: 'Project 150',
      organization: 'Homeless Kids',
      description: 'Project 150 started in December 2011, when we learned that the Clark County School District has an overwhelming number of homeless teenagers attending school.',
      location: 'Downtown Las Vegas',
      contact: 'https://www.opportunityvillage.org/thrift-store',
    },
    {
      id: 3,
      name: 'Las Vegas Rescue Mission',
      organization: 'Local Food Organization',
      description: 'Founded in 1970, the Las Vegas Rescue Mission (LVRM) started with a small storefront building that included the chapel, kitchen and a shelter that could house a few men.',
      location: 'East Las Vegas',
      contact: 'https://www.opportunityvillage.org/thrift-store',
    },
    {
      id: 4,
      name: 'Animal Shelter Volunteer',
      organization: 'Local Animal Shelter',
      description: 'Help care for and socialize with the animals at the shelter.',
      location: 'North Las Vegas',
      contact: 'https://www.opportunityvillage.org/thrift-store',
    },
    {
      id: 5,
      name: 'Goodie Two Shoes Foundation',
      organization: 'Feet Organization',
      description: 'Our programming is based on the premise that we do not just provide a child with a new pair of shoes. We measure their feet on-site to ensure proper fit.',
      location: 'West Las Vegas',
      contact: 'https://www.opportunityvillage.org/thrift-store',
    },
    {
      id: 6,
      name: 'Test Foundation',
      organization: 'Hello organization',
      description: 'This is a test to make sure the grid height works. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      location: 'Las Vegas',
      contact: 'https://www.opportunityvillage.org/thrift-store',
    }
  ];

  const filteredOpportunities = opportunities.filter((opportunity) =>
    opportunity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
        <Grid container spacing={3} sx={{ "& .MuiGrid-item": { height: "100" } }}>
          {filteredOpportunities.map((opportunity) => (
            <Grid item xs={12} sm={6} md={4} key={opportunity.id}>
              <Box sx={{ height: "100%" }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: 'center' 
                  }}
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
  );
};

export default Directory;

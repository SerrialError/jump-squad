import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Grid, Paper, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import Carousel from 'react-material-ui-carousel';
import supabase from '../components/Supabase';
import '../App.css';
import { opportunities, featuredOpportunityIds } from '../components/opportunities';
import { fullGospel } from '../components/affiliation-opportunities';
import village from '../images/opportunity-village.png';
import project150 from '../images/project150.png';
import lvrm from '../images/lvrm.png';

function Dashboard() {
  const [affiliation, setAffiliation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
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
    fetchEvents();
    fetchAffiliations();
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {affiliation !== "No Affiliation" && (
          <>
            <Typography variant="h3" component="h2" marginTop="75px">
              {affiliation} Community Service Options
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
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </header>
    </div>
  );
}

export default Dashboard;


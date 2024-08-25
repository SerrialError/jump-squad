import '../App.css';
import React, { useState, useEffect } from 'react';
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
import supabase from '../components/Supabase';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { opportunities } from '../components/opportunities';

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [filterEl, setFilterEl] = React.useState(null);

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

  const filteredOpportunities = opportunities.filter((opportunity) =>
    opportunity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // You can fetch data here if needed
  }, []);

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
                open={Boolean(filterEl)}
                anchorEl={filterEl}
                onClose={handleFilterClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <List disablePadding>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleFilterClose}>
                      <ListItemText primary="Filters" />
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
                  <Typography id="modal-description" sx={{ mt: 2 }}>
                    {selectedOpportunity.description}
                  </Typography>
                </Box>
              </Box>
              <Button onClick={handleCloseModal}>Close</Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Directory;


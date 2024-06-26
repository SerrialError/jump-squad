import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Carousel from 'react-material-ui-carousel';
import village from '../images/opportunity-village.png';
import project150 from '../images/project150.png';
import lvrm from '../images/lvrm.png';
import goodieshoes from '../images/goodie-two-shoes.png';
import supabase from '../components/Supabase';
import fglv from '../images/fglv.png';
import '../App.css';

function Dashboard() {
  const [affiliation, setAffiliation] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchAffiliations() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setError('Please sign in to view Leaderboard');
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

    fetchAffiliations();
  }, []);

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

  return (
    <div className="App">
      <header className="App-header">
        <Typography component="h1" variant="h3" gutterBottom>
          Dashboard
        </Typography>
        <div style={{ width: '100%', height: '500px' }}>
          <Carousel>
            {carouselItems.map((item, index) => (
              <div key={index}>
                <img
                  src={item.image}
                  alt={`Carousel Item ${index}`}
                  style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                />
                <Typography variant="body1" align="center" gutterBottom>
                  {item.description}
                </Typography>
              </div>
            ))}
          </Carousel>
        </div>
        <div style={{ marginTop: '75px' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Featured Opportunities for Week of June 16
          </Typography>
          <Grid container spacing={3}>
            {[
              { name: 'Opportunity Village Thrift Store', link: 'https://app.betterimpact.com/PublicEnterprise/EnterpriseActivity?enterpriseGuid=e47c0801-34d2-4710-8067-a87c71c30c29&activityGuid=2fced57d-0970-469a-96bc-d859d2bb886c&searchUrl=https%253a%252f%252fapp.betterimpact.com%252fPublicEnterprise%252fEnterpriseSearch%253fEnterpriseGuid%253de47c0801-34d2-4710-8067-a87c71c30c29%2526SearchType%253dOrganization%2526SearchId%253d22981', description: 'Taken from the Opportunity Village website. Join us at our thrift store volunteers assist with sorting, placing, organizing, and moving donations. In addition, special projects and events held at the store are posted as they are scheduled.', image: village },
              { name: 'Project 150', link: 'https://www.project150.org/volunteer-with-us', description: 'Project 150 started in December 2011, when we learned that the Clark County School District has an overwhelming number of homeless teenagers attending school. The issue was highlighted in a local TV news report that focused on 150 homeless students attending Rancho High School. The shock over this hidden reality for over 7,500 students in the Las Vegas Valley created a buzz among a network of friends and business colleagues.', image: project150 },
              { name: 'Las Vegas Rescue Mission', link: 'https://vegasrescue.org/volunteer/', description: 'Founded in 1970, the Las Vegas Rescue Mission (LVRM) started with a small storefront building that included the chapel, kitchen and a shelter that could house a few men. Today, LVRM campus takes up two city blocks in downtown Las Vegas, helping hundreds of men, women and their children daily, and provides approximately 30,000 meals each month.', image: lvrm },
              { name: 'Goodie Two Shoes Foundation', link: 'https://goodietwoshoes.org/volunteering/', description: 'Our programming is based on the premise that we do not just provide a child with a new pair of shoes. We measure their feet on-site to ensure proper fit. We pair them one-on-one with a community volunteer, whom takes a special interest and walks them through the process. We make them the center of attention, and we EMPOWER them with choice; by giving them the opportunity to select any pair of properly fitting shoes they choose from our large inventory of high-quality athletic shoes, just like the ones their friends at school are wearing.', image: goodieshoes },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card className="card">
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={8}>
                        <Typography gutterBottom variant="h5" component="div" align="center">
                          <Link href={item.link} target="_blank" rel="noopener noreferrer" color="textPrimary" underline="hover" className="App-Link">
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
                    <Typography color="textSecondary" className="card-content" variant="body2" component="p">
                      {item.description}
                    </Typography>
                  </CardContent>
                  <Divider />
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
        <div style={{ marginTop: '20px' }}>
          {affiliation === "Full Gospel Las Vegas Church" && (
            <>
              <Typography variant="h4" component="h2" align="center" gutterBottom>
                Full Gospel Church
              </Typography>
              <Grid container spacing={3}>
                {[
                  { name: 'Fireworks Displays', link: 'https://fglvchurch.com', description: 'Firework displays all day at 9415 W Tropicana Ave, Las Vegas, NV 89147.', image: fglv },
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card className="card">
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={8}>
                            <Typography gutterBottom variant="h5" component="div" align="center">
                              <Link href={item.link} target="_blank" rel="noopener noreferrer" color="textPrimary" underline="hover" className="App-Link">
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
                        <Typography color="textSecondary" className="card-content" variant="body2" component="p">
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

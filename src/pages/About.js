import '../App.css';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import fglv from '../images/fglv.png';

function About() {
  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1>About Us</h1>
        <h2>Welcome to Jump Squad!</h2>
        <p>
          Jump Squad is a dynamic and passionate community service organization located in the vibrant city of Las Vegas, Nevada. Our mission is to make a positive impact on our community by harnessing the energy, creativity, and dedication of our youth volunteers.
        </p>

        <h2>Who We Are</h2>
        <p>
          Jump Squad is comprised of enthusiastic young individuals who are eager to give back to their community. Our volunteers come from diverse backgrounds, but they share a common goal: to create meaningful change and improve the lives of those around them.
        </p>

        <h2>Our Mission</h2>
        <p>
          At Jump Squad, we believe in the power of community and the importance of service. Our mission is to:
        </p>
        <ul>
          <li>
            <p>
              Empower Youth: We provide young people with opportunities to develop leadership skills, gain valuable experiences, and become active citizens.
            </p>
          </li>
          <li>
            <p>
              Serve the Community: Through various service projects and initiatives, we aim to address the needs of our community, from helping the less fortunate to promoting environmental sustainability.
            </p>
          </li>
          <li>
            <p>
              Foster Unity: We strive to bring people together, building a stronger, more connected community in Las Vegas.
            </p>
          </li>
        </ul>

        <h2>What We Do</h2>
        <p>
          Our activities are diverse and aimed at addressing a wide range of community needs. Some of our key initiatives include:
        </p>
        <ul>
          <li>
            <p>
              Food Drives: Collecting and distributing food to local shelters and families in need.
            </p>
          </li>
          <li>
            <p>
              Environmental Cleanups: Organizing clean-up events in parks and public spaces to promote environmental stewardship.
            </p>
          </li>
          <li>
            <p>
              Youth Mentorship: Providing mentorship programs for younger students to inspire and guide them.
            </p>
          </li>
          <li>
            <p>
              Community Events: Hosting events that bring the community together, such as health fairs, educational workshops, and cultural festivals.
            </p>
          </li>
        </ul>

        <h2>Join Us</h2>
        <p>
          Jump Squad is always looking for passionate and dedicated youth volunteers who want to make a difference. Whether you're a high school student looking to complete community service hours or a young adult wanting to contribute your time and skills, we welcome you to join our squad.
        </p>
        <p>
          Together, we can create a brighter future for Las Vegas. If you're interested in volunteering or partnering with us, please get in touch. Let's jump into action and make a positive impact, one step at a time!
        </p>
        <p>
          For more information about our upcoming events, volunteer opportunities, or to donate, please contact us at [we need to create email] or visit our website at jumpsquad.com. Follow us on social media [links to social media profiles] to stay updated on our latest projects and activities.
        </p>
        <h1>Some of our Affiliates</h1>
        <a href="https://www.fglvchurch.com/">
          <img src={fglv} alt="Full Gospel Church Las Vegas" height="100px"/>
        </a>    
      </Box>
    </Container>
  );
}

export default About;

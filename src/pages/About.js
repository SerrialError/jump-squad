import '../App.css';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import fglv from '../images/fglv.png';
import meettheteam from '../images/meettheteam.png';

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
          Jump Squad is a dynamic and passionate community service network located in the vibrant city of Las Vegas, Nevada. Our mission is to make a positive impact on our community by harnessing the energy, creativity, and dedication of our youth volunteers.
        </p>

        <h2>Who We Are</h2>
        <p>
          Jump Squad is comprised of enthusiastic young individuals who are eager to give back to their community. Our volunteers come from diverse backgrounds, but they share a common goal: to create meaningful change and improve the lives of those around them.
        </p>

        <h2>Mission Statement</h2>
        <p> Jump Squad is dedicated to uniting the Las Vegas community through the love and compassion that Christ teaches us. Our mission is to foster connections among neighbors, local businesses, schools, and churches, creating a network of support that reflects the Christian values of kindness, generosity, and service. By organizing fundraisers, we aim not only to raise money for important causes but also to spread awareness and encourage active participation in building a better community.</p>
	<p>At the heart of Jump Squad is a commitment to living out our faith by giving back. We partner with local charities and organizations that align with our mission to serve others, ensuring that the funds we raise are used to support those in need, uplift families, and strengthen the bonds of our community. We believe in the power of prayer, fellowship, and the collective efforts of our community members to make a lasting difference.</p>
	<p>Service is a core aspect of our faith, and we strive to provide meaningful opportunities for volunteerism that allow individuals to live out their calling to serve others. Whether it’s through organizing events, participating in local service projects, or offering a helping hand to those in need, we are committed to being the hands and feet of Christ in our community.</p>
	<p>Our mission is guided by the Christian virtues of love, hope, and faith. We believe that when we come together in the spirit of Christ, we can achieve great things and make a profound impact on the lives of others. Jump Squad is here to inspire, support, and lead our community in living out these values, creating a Las Vegas where everyone is cared for, supported, and empowered to thrive.</p>

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
        <img src={meettheteam} alt="Full Gospel Church Las Vegas" height="600px"/> 
 
         
      </Box>
    </Container>
  );
}

export default About;

import noimage from '../images/no-image.png';
import village from '../images/opportunity-village.png';
import project150 from '../images/project150.png';
import lvrm from '../images/lvrm.png';
import goodieshoes from '../images/goodie-two-shoes.png';

export const featuredOpportunityIds = [1, 2, 3, 5];

export const opportunities = [
  {
    id: 1,
    name: 'Opportunity Village Thrift Store',
    organization: 'Opportunity Village',
    description: 'Join us at our thrift store volunteers assist with sorting, placing, organizing, and moving donations.',
    date: new Date('2024-07-13:00:00'),
    location: 'Downtown Las Vegas',
    latitude: '36.16886114726847',
    longitude: '-115.2072297310761',
    contact: 'https://www.opportunityvillage.org/thrift-store',
    image: village,
  },
  {
    id: 2,
    name: 'Project 150',
    organization: 'Homeless Kids',
    description: 'Project 150 started in December 2011, when we learned that the Clark County School District has an overwhelming number of homeless teenagers attending school.',
    date: new Date('2024-01-01T00:00:00'),
    location: 'Downtown Las Vegas',
    contact: 'https://www.opportunityvillage.org/thrift-store',
    image: project150,
  },
  {
    id: 3,
    name: 'Las Vegas Rescue Mission',
    organization: 'Local Food Organization',
    description: 'Founded in 1970, the Las Vegas Rescue Mission (LVRM) started with a small storefront building that included the chapel, kitchen and a shelter that could house a few men.',
    date: new Date('2024-01-01T00:00:00'),
    location: 'East Las Vegas',
    contact: 'https://www.opportunityvillage.org/thrift-store',
    image: lvrm,
  },
  {
    id: 4,
    name: 'Animal Shelter Volunteer',
    organization: 'Local Animal Shelter',
    description: 'Help care for and socialize with the animals at the shelter.',
    date: new Date('2024-01-01T00:00:00'),
    location: 'North Las Vegas',
    contact: 'https://www.opportunityvillage.org/thrift-store',
    image: noimage,
  },
  {
    id: 5,
    name: 'Goodie Two Shoes Foundation',
    organization: 'Feet Organization',
    description: 'Our programming is based on the premise that we do not just provide a child with a new pair of shoes. We measure their feet on-site to ensure proper fit.',
    date: new Date('2024-01-01T00:00:00'),
    location: 'West Las Vegas',
    contact: 'https://www.opportunityvillage.org/thrift-store',
    image: goodieshoes,
  }
];

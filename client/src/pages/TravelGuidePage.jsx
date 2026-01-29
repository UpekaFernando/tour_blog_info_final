import { useState, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FlightTakeoff,
  DirectionsBus,
  AttachMoney,
  LocalHospital,
  Language,
  Restaurant,
  Hotel,
  Info,
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const TravelGuidePage = () => {
  const { user } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const travelGuides = [
    {
      id: 1,
      category: 'visa',
      icon: <FlightTakeoff sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Visa & Entry Requirements',
      sections: [
        {
          subtitle: 'Electronic Travel Authorization (ETA)',
          content: [
            'Citizens of most countries can obtain an ETA online before arrival',
            'Valid for 30 days, can be extended up to 6 months',
            'Apply at: www.eta.gov.lk',
            'Processing time: Usually within 24 hours',
            'Cost: $50 USD for most nationalities',
          ]
        },
        {
          subtitle: 'Visa on Arrival',
          content: [
            'Available at Bandaranaike International Airport',
            'Must have return ticket and proof of accommodation',
            'Valid passport with at least 6 months validity',
          ]
        },
        {
          subtitle: 'Documents Required',
          content: [
            'Valid passport (6+ months validity)',
            'Confirmed return or onward ticket',
            'Proof of sufficient funds',
            'Hotel booking confirmation',
          ]
        }
      ]
    },
    {
      id: 2,
      category: 'transport',
      icon: <DirectionsBus sx={{ fontSize: 40, color: '#2e7d32' }} />,
      title: 'Getting Around Sri Lanka',
      sections: [
        {
          subtitle: 'Trains',
          content: [
            'Scenic train journeys (Kandy to Ella is world-famous)',
            'Book tickets online or at stations',
            'First, second, and third class available',
            'Popular routes: Colombo-Kandy-Ella, Colombo-Galle',
            'Book in advance for reserved seats',
          ]
        },
        {
          subtitle: 'Buses',
          content: [
            'Extensive network covering entire island',
            'Very affordable but can be crowded',
            'Private air-conditioned buses available for longer routes',
            'Express buses connect major cities',
          ]
        },
        {
          subtitle: 'Tuk-Tuks (Three-Wheelers)',
          content: [
            'Ideal for short distances within cities',
            'Always negotiate fare before starting',
            'Use PickMe or Uber apps for fixed rates',
            'Typical cost: LKR 50-100 per km',
          ]
        },
        {
          subtitle: 'Private Hire',
          content: [
            'Hire a car with driver (recommended)',
            'Cost: $40-60 USD per day',
            'Driver handles navigation and parking',
            'Flexible itinerary',
          ]
        }
      ]
    },
    {
      id: 3,
      category: 'budget',
      icon: <AttachMoney sx={{ fontSize: 40, color: '#ed6c02' }} />,
      title: 'Budget & Money',
      sections: [
        {
          subtitle: 'Currency',
          content: [
            'Sri Lankan Rupee (LKR)',
            'Exchange rate: ~300-330 LKR = 1 USD',
            'Change money at banks or licensed dealers',
            'Credit cards accepted in major hotels and restaurants',
          ]
        },
        {
          subtitle: 'Daily Budget Estimates',
          content: [
            'Budget traveler: $20-30 USD per day',
            'Mid-range: $50-80 USD per day',
            'Luxury: $150+ USD per day',
            'Street food meal: $1-3 USD',
            'Restaurant meal: $5-15 USD',
            'Guesthouse: $15-30 USD per night',
          ]
        },
        {
          subtitle: 'Money Saving Tips',
          content: [
            'Eat at local restaurants (hotel rice and curry)',
            'Use public transport (trains and buses)',
            'Visit free attractions (beaches, temples)',
            'Bargain at markets',
            'Book accommodation in advance for better rates',
          ]
        }
      ]
    },
    {
      id: 4,
      category: 'health',
      icon: <LocalHospital sx={{ fontSize: 40, color: '#d32f2f' }} />,
      title: 'Health & Safety',
      sections: [
        {
          subtitle: 'Vaccinations',
          content: [
            'Routine vaccinations (MMR, Tetanus, etc.)',
            'Hepatitis A and Typhoid recommended',
            'Japanese Encephalitis for rural areas',
            'Malaria prophylaxis not usually necessary',
          ]
        },
        {
          subtitle: 'Health Tips',
          content: [
            'Drink bottled or filtered water only',
            'Use mosquito repellent',
            'Sun protection (SPF 50+)',
            'Avoid street food if you have a sensitive stomach',
            'Travel insurance is highly recommended',
          ]
        },
        {
          subtitle: 'Emergency Numbers',
          content: [
            'Police: 119',
            'Ambulance: 110',
            'Fire: 111',
            'Tourist Police: 1912',
            'Sri Lanka Tourism: +94 11 242 6900',
          ]
        },
        {
          subtitle: 'Safety Tips',
          content: [
            'Sri Lanka is generally safe for tourists',
            'Be aware of your belongings in crowded places',
            'Avoid unlicensed tour guides',
            'Dress modestly when visiting religious sites',
            'Be cautious on beaches (strong currents)',
          ]
        }
      ]
    },
    {
      id: 5,
      category: 'culture',
      icon: <Language sx={{ fontSize: 40, color: '#9c27b0' }} />,
      title: 'Culture & Etiquette',
      sections: [
        {
          subtitle: 'Temple Etiquette',
          content: [
            'Remove shoes before entering',
            'Cover shoulders and knees',
            'Don\'t turn your back on Buddha statues',
            'No photos with your back to Buddha',
            'Dress in white at some temples',
          ]
        },
        {
          subtitle: 'Social Customs',
          content: [
            'Greet with "Ayubowan" (long life)',
            'Right hand only for eating and giving',
            'Avoid public displays of affection',
            'Respect elders',
            'Remove hat when entering homes',
          ]
        },
        {
          subtitle: 'Useful Phrases',
          content: [
            'Hello: Ayubowan',
            'Thank you: Istuti (Sinhala) / Nandri (Tamil)',
            'Yes: Ow / No: Nehe',
            'How much?: Kiyada?',
            'Delicious: Rasa',
          ]
        }
      ]
    },
    {
      id: 6,
      category: 'food',
      icon: <Restaurant sx={{ fontSize: 40, color: '#f57c00' }} />,
      title: 'Food & Dining',
      sections: [
        {
          subtitle: 'Must-Try Dishes',
          content: [
            'Rice and curry (national dish)',
            'Hoppers (bowl-shaped pancakes)',
            'Kottu Roti (chopped roti with vegetables)',
            'String hoppers (steamed rice noodles)',
            'Lamprais (rice cooked in stock)',
            'Fresh seafood (especially crab)',
          ]
        },
        {
          subtitle: 'Where to Eat',
          content: [
            'Hotel (local restaurant, not accommodation)',
            'Street food stalls (safe in busy areas)',
            'Beach shacks for fresh seafood',
            'Hotel restaurants for variety',
          ]
        },
        {
          subtitle: 'Dining Tips',
          content: [
            'Eat where locals eat for authentic food',
            'Try "hotel rice and curry" for lunch',
            'Fresh fruit from markets',
            'Ceylon tea is a must-try',
            'Spicy food - ask for "less spicy"',
          ]
        }
      ]
    },
    {
      id: 7,
      category: 'accommodation',
      icon: <Hotel sx={{ fontSize: 40, color: '#0288d1' }} />,
      title: 'Accommodation Guide',
      sections: [
        {
          subtitle: 'Types of Accommodation',
          content: [
            'Guesthouses: $15-40 per night (best value)',
            'Boutique hotels: $50-150 per night',
            'Luxury resorts: $200+ per night',
            'Homestays: Cultural experience, $20-35',
            'Beach cabanas: Relaxed beach vibes',
          ]
        },
        {
          subtitle: 'Booking Tips',
          content: [
            'Book in advance during peak season (Dec-Mar)',
            'Read reviews on TripAdvisor/Booking.com',
            'Check location relative to attractions',
            'Wifi and hot water not always available',
            'Negotiate for longer stays',
          ]
        },
        {
          subtitle: 'Best Areas to Stay',
          content: [
            'Colombo: Fort, Galle Face for city access',
            'Kandy: City center or lakeside',
            'Ella: Town center for restaurants',
            'Galle: Inside the Fort for atmosphere',
            'Mirissa/Unawatuna: Beachfront',
          ]
        }
      ]
    },
    {
      id: 8,
      category: 'general',
      icon: <Info sx={{ fontSize: 40, color: '#00695c' }} />,
      title: 'Essential Information',
      sections: [
        {
          subtitle: 'Best Time to Visit',
          content: [
            'West/South coast: December to March',
            'East coast: May to September',
            'Hill country: Year-round (Jan-Mar driest)',
            'Peak season: December to March',
            'Monsoon seasons vary by region',
          ]
        },
        {
          subtitle: 'What to Pack',
          content: [
            'Light, breathable clothing',
            'Modest wear for temples',
            'Sun protection (hat, sunscreen)',
            'Insect repellent',
            'Light rain jacket',
            'Comfortable walking shoes',
            'Power adapter (Type D/G/M)',
          ]
        },
        {
          subtitle: 'Internet & Communication',
          content: [
            'SIM cards available at airport',
            'Dialog, Mobitel, Hutch are main providers',
            'Cost: ~$10 for tourist SIM with data',
            'Wifi available in most hotels',
            'Mobile data is reliable and fast',
          ]
        },
        {
          subtitle: 'Time Zone & Language',
          content: [
            'Time: UTC +5:30',
            'Official languages: Sinhala, Tamil',
            'English widely spoken in tourist areas',
            'Currency: Sri Lankan Rupee (LKR)',
          ]
        }
      ]
    }
  ];

  const categories = [
    { value: 'all', label: 'All Guides', color: '#1976d2' },
    { value: 'visa', label: 'Visa & Entry', color: '#1976d2' },
    { value: 'transport', label: 'Transportation', color: '#2e7d32' },
    { value: 'budget', label: 'Budget & Money', color: '#ed6c02' },
    { value: 'health', label: 'Health & Safety', color: '#d32f2f' },
    { value: 'culture', label: 'Culture', color: '#9c27b0' },
    { value: 'food', label: 'Food & Dining', color: '#f57c00' },
    { value: 'accommodation', label: 'Accommodation', color: '#0288d1' },
    { value: 'general', label: 'General Info', color: '#00695c' },
  ];


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Travel Guide to Sri Lanka
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Everything you need to know for your Sri Lankan adventure
        </Typography>
      </Box>

      {/* Category Filter */}
      <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map((cat) => (
            <Chip
              key={cat.value}
              label={cat.label}
              onClick={() => setSelectedCategory(cat.value)}
              color={selectedCategory === cat.value ? 'primary' : 'default'}
              sx={{
                fontSize: '0.95rem',
                fontWeight: selectedCategory === cat.value ? 600 : 400,
                backgroundColor: selectedCategory === cat.value ? cat.color : undefined,
                '&:hover': {
                  backgroundColor: selectedCategory === cat.value ? cat.color : undefined,
                  opacity: 0.9,
                }
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Travel Guides */}
      <Grid container spacing={3}>
        {filteredGuides.map((guide) => (
          <Grid item xs={12} md={6} key={guide.id}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent>
                {/* Icon and Title */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2 }}>
                    {guide.icon}
                  </Box>
                  <Typography variant="h5" component="h2" fontWeight={600}>
                    {guide.title}
                  </Typography>
                </Box>

                {/* Sections */}
                <Box>
                  {guide.sections.map((section, idx) => (
                    <Accordion key={idx} defaultExpanded={idx === 0}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight={600}>
                          {section.subtitle}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box component="ul" sx={{ pl: 2, m: 0 }}>
                          {section.content.map((item, i) => (
                            <Typography 
                              key={i} 
                              component="li" 
                              variant="body2"
                              sx={{ mb: 0.5 }}
                            >
                              {item}
                            </Typography>
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body2">
          <strong>Note:</strong> This information is current as of 2026. Always verify visa requirements, 
          health advisories, and travel restrictions with official sources before your trip.
        </Typography>
      </Alert>
    </Container>
  );
};

export default TravelGuidePage;

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  Divider, 
  Grid, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Skeleton, 
  Stack, 
  Typography 
} from "@mui/material";
import { 
  Pets, 
  Cake, 
  Science, 
  LocalHospital, 
  LocationOn, 
  QuestionAnswer, 
  ArrowBack 
} from "@mui/icons-material";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import BASE_URL from '../Components/Config';

function PetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAi6t6s9HB1NyToVrDhpvn3PHMSrpC_1as",
  });

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/pets/${id}`)
      .then((res) => {
        setPet(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch pet:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={6} key={i}>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!pet) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Pet not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBack />
      </IconButton>

      <Grid container spacing={4}>
        {/* Left Column - Circular Image */}
        <Grid item xs={12} md={4}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            height: 'fit-content'
          }}>
            <CardMedia
              component="img"
              image={pet.image ? `${BASE_URL}/files/${pet.image}` : "/default-pet.jpg"}
              alt={pet.petName}
              sx={{
                width: 280,
                height: 280,
                borderRadius: '50%',
                border: '4px solid #fff',
                boxShadow: 3,
                objectFit: 'cover'
              }}
            />
          </Box>
        </Grid>

        {/* Right Column - Content */}
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 4,
            p: 3
          }}>
            <Stack spacing={3}>
              {/* Header Section */}
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {pet.petName}
                </Typography>
                <Chip
                  label={pet.status}
                  color={pet.status === 'Available' ? 'success' : 'warning'}
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              {/* Details Grid */}
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  {/* Details Grid */}
                  <Grid container spacing={2}>
  <DetailItem icon={<Pets />} label="Pet Name" value={pet.petName} />
  <DetailItem icon={<Pets />} label="Type" value={pet.type} />
  <DetailItem icon={<Science />} label="Species" value={pet.species} />
  <DetailItem icon={<Pets />} label="Breed" value={pet.breed} />
  <DetailItem icon={<Cake />} label="Age" value={pet.age} />
  <DetailItem icon={<Pets />} label="Status" value={pet.status} />

  {/* Image preview */}


  {/* Owner info (customize based on what you have available) */}
  <DetailItem
    icon={<Pets />}
    label="Owner"
    value={`${pet.owner.firstName} ${pet.owner.lastName}`}
  />
</Grid>
                </Grid>
              </Grid>

              {/* Location Section */}
              {/* Location */}
            <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
              <LocationOn fontSize="small" />
              <Typography variant="body2">
                {[pet.barangay, pet.city, pet.country].filter(Boolean).join(', ')}
              </Typography>
            </Stack>

              {/* Action Buttons */}
              <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(`/adopt/${id}`)}
                  startIcon={<Pets />}
                >
                  Adopt Now
                </Button>
              </Grid>
              {pet.owner?.id && (
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate(`/messages/${pet.owner.id}`)}
                    startIcon={<QuestionAnswer />}
                  >
                    Contact Owner
                  </Button>
                </Grid>
              )}
            </Grid>

              {/* Map Section */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Location Map
                </Typography>
                <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden' }}>
                  {pet.latitude && pet.longitude && isLoaded && (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={{ lat: pet.latitude, lng: pet.longitude }}
                      zoom={13}
                    >
                      <Marker position={{ lat: pet.latitude, lng: pet.longitude }} />
                    </GoogleMap>
                  )}
                </Box>
              </Box>

              {/* FAQs Section */}
             
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// Updated DetailItem component
const DetailItem = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Box sx={{ color: 'primary.main' }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  </Stack>
);

// Reusable FAQ Component
const FAQItem = ({ question, answer }) => (
  <ListItem sx={{ px: 0 }}>
    <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
      <QuestionAnswer fontSize="small" />
    </ListItemIcon>
    <ListItemText
      primary={question}
      secondary={answer}
      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
      secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
    />
  </ListItem>
);

export default PetDetails;
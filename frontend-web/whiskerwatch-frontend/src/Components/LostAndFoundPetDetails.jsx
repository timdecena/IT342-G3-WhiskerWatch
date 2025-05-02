import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Box, 
  Button, 
  Card, 
  Chip, 
  CardMedia, 
  Grid, 
  IconButton, 
  Stack, 
  Skeleton,
  Typography 
} from "@mui/material";
import { 
  Pets, 
  CalendarToday, 
  LocationOn, 
  Description, 
  QuestionAnswer, 
  ArrowBack,
  Share
} from "@mui/icons-material";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import BASE_URL from '../Components/Config';

function LostAndFoundPetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAi6t6s9HB1NyToVrDhpvn3PHMSrpC_1as",
  });

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "12px",
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/lost-and-found/${id}`)
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
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Skeleton variant="rectangular" height={280} sx={{ 
          borderRadius: '50%', 
          width: 280, 
          mx: 'auto',
          mb: 4 
        }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
          </Grid>
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
                objectFit: 'cover',
                margin: 'auto'
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
            p: 3,
            height: '100%'
          }}>
            <Stack spacing={3}>
              {/* Header Section */}
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {pet.petName}
                </Typography>
                <Chip
                  label={pet.status}
                  color={pet.status === "LOST" ? 'error' : 'success'}
                  sx={{ fontWeight: 600, mb: 2 }}
                />
              </Box>

              {/* Basic Info Grid */}
              <Grid container spacing={2}>
                <Grid item xs={6} md={4}>
                  <DetailItem 
                    icon={<Pets />} 
                    label="Species" 
                    value={pet.species || "Unknown"} 
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <DetailItem 
                    icon={<CalendarToday />} 
                    label="Reported" 
                    value={pet.reportedDate ? new Date(pet.reportedDate).toLocaleDateString() : "Unknown"} 
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DetailItem 
                    icon={<LocationOn />} 
                    label="Location" 
                    value={[pet.barangay, pet.city, pet.country].filter(Boolean).join(', ')} 
                  />
                </Grid>
              </Grid>

              {/* Additional Details */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Breed:</strong> {pet.breed}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong> Status:</strong> {pet.status}
                  </Typography>

                </Grid>
              </Grid>

              {/* Description */}
              {pet.description && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {pet.description}
                  </Typography>
                </Box>
              )}

              {/* Action Buttons */}
              <Grid container spacing={2} sx={{ mt: 'auto' }}>
                <Grid item xs={12} md={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<QuestionAnswer />}
                    sx={{ fontWeight: 700 }}
                    onClick={() => navigate(`/messages/${pet.reporter?.id}`)}
                  >
                    Contact Reporter
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<Share />}
                    sx={{ fontWeight: 700 }}
                  >
                    Share Post
                  </Button>
                </Grid>
              </Grid>

              {/* Map Section */}
              {pet.latitude && pet.longitude && isLoaded && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Last Seen Location
                  </Typography>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{ lat: pet.latitude, lng: pet.longitude }}
                    zoom={14}
                  >
                    <Marker position={{ lat: pet.latitude, lng: pet.longitude }} />
                  </GoogleMap>
                </Box>
              )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// Reusable DetailItem Component
const DetailItem = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Box sx={{ color: 'primary.main' }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  </Stack>
);

export default LostAndFoundPetDetails;
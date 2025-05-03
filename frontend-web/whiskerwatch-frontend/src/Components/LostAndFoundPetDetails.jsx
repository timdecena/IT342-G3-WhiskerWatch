import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Pets,
  CalendarToday,
  LocationOn,
  Description,
  QuestionAnswer,
  ArrowBack,
  Science,
  Share,
} from "@mui/icons-material";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import BASE_URL from "../Components/Config";

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
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Skeleton
          variant="circular"
          width={280}
          height={280}
          sx={{ mx: "auto", mb: 4 }}
        />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
      </Box>
    );
  }

  if (!pet) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Pet not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBack />
      </IconButton>

      <Grid container spacing={4}>
        {/* Left - Circular Image */}
        <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              width: 280,
              height: 280,
              borderRadius: "50%",
              overflow: "hidden",
              border: "4px solid #fff",
              boxShadow: 3,
            }}
          >
            <CardMedia
              component="img"
              image={pet.image ? `${BASE_URL}/files/${pet.image}` : "/default-pet.jpg"}
              alt={pet.petName}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Grid>

        {/* Right - Pet Info */}
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <Stack spacing={1}>
              {/* Pet Name + Status */}
              <Box>
                <Typography variant="h4" fontWeight={100} gutterBottom>
                  {pet.petName}
                </Typography>
                <Chip
                  label={pet.status}
                  color={pet.status === "LOST" ? "error" : "success"}
                  sx={{ fontWeight: 100 }}
                />
              </Box>

              {/* Details Grid */}
              <Grid container spacing={1}>
                <Grid item xs={4} md={2}>
                  <DetailItem icon={<Pets />} label="Pet Name" value={pet.petName || "Unknown"} />
                </Grid>
                <Grid item xs={4} md={2}>
                  <DetailItem icon={<Science />} label="Species" value={pet.species || "Unknown"} />
                </Grid>
                <Grid item xs={6} md={2}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="Location"
                    value={[pet.barangay, pet.city, pet.country].filter(Boolean).join(", ") || "Unknown"}
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <DetailItem icon={<Pets />} label="Status" value={pet.status || "Unknown"} />
                </Grid>
                <Grid item xs={6} md={4}>
                  <DetailItem
                    icon={<CalendarToday />}
                    label="Coordinates"
                    value={
                      pet.latitude && pet.longitude
                        ? `${pet.latitude.toFixed(5)}, ${pet.longitude.toFixed(5)}`
                        : "Unavailable"
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <DetailItem
                    icon={<Description />}
                    label="Description"
                    value={pet.description || "No description provided"}
                  />
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

              {/* Buttons */}
              <Grid container spacing={2}>
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

              {/* Map */}
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

// Detail item component
const DetailItem = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Box sx={{ color: "primary.main" }}>{icon}</Box>
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

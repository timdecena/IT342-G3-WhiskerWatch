// src/pages/Developers.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import pp from "../assets/pp.jpg";
import ty from "../assets/ty.jpg";
import rhan from "../assets/rhan.jpg";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Link,
} from '@mui/material';

const developers = [
  {
    name: 'Tyrone Beldad',
    role: 'Frontend Developer',
    image: ty,
    link: 'https://github.com/tyronebeldad123',
    linkLabel: 'GitHub',
  },
  {
    name: 'Anthony Decena',
    role: 'Backend Developer',
    image: pp,
    link: 'https://github.com/timdecena',
    linkLabel: 'GitHub',
  },
  {
    name: 'Rhandulf Saceda',
    role: 'Android Developer',
    image: rhan,
    link: 'https://github.com/superdaks',
    linkLabel: 'GitHub',
  },
];

function Developers() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
        Meet the Developers
      </Typography>

      <Grid container spacing={4} justifyContent="center" mt={2}>
        {developers.map((dev) => (
          <Grid item xs={12} sm={6} md={4} key={dev.name}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="240"
                image={dev.image}
                alt={dev.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {dev.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dev.role}
                </Typography>
                <Box mt={1.5}>
                  <Link
                    href={dev.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="primary"
                    fontWeight={500}
                  >
                    {dev.linkLabel}
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={6} display="flex" justifyContent="center">
        <Button
          variant="contained"
          component={RouterLink}
          to="/"
          size="large"
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 4,
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
          }}
        >
          ← Back 
        </Button>
      </Box>
    </Container>
  );
}

export default Developers;

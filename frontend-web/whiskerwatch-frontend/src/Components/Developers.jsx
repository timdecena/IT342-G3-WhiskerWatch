// src/pages/Developers.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import pp from "../assets/pp.jpg";
import ty from "../assets/ty.jpg";
import rhan from "../assets/rhan.jpg";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Link,
  useTheme,
} from '@mui/material';

const developers = [
  {
    name: 'Tyrone Beldad',
    role: 'Frontend Developer',
    description: 'UI/UX Specialist, React Developer\nAge: 21',
    techStack: 'ReactJS Stylesheet Springboot Figma',
    image: ty,
    link: 'https://github.com/tyronebeldad123',
    linkLabel: 'GitHub',
  },
  {
    name: 'Anthony Decena',
    role: 'Backend Developer',
    description: 'Backend Lead, Fullstack Developer\nAge: 21',
    techStack: 'Spring Boot ReactJS AWS SQL Workbench',
    image: pp,
    link: 'https://github.com/timdecena',
    linkLabel: 'GitHub',
  },
  {
    name: 'Rhandulf Saceda',
    role: 'Android Developer',
    description: 'Mobile App Developer\nAge: 21',
    techStack: 'Java Kotlin SQL Workbench Android Studio',
    image: rhan,
    link: 'https://github.com/superdaks',
    linkLabel: 'GitHub',
  },
];

function Developers() {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        fontWeight={700}
        color={theme.palette.primary.main}
      >
        Meet the Developers
      </Typography>

      <Box
        display="flex"
        justifyContent="center"
        gap={4}
        mt={4}
        flexWrap="nowrap"
        overflow="auto"
        sx={{
          pb: 2,
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.grey[400],
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: theme.palette.grey[600],
          },
        }}
      >
        {developers.map((dev) => (
          <Card
            key={dev.name}
            elevation={6}
            sx={{
              minWidth: 300,
              borderRadius: 4,
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: theme.shadows[8],
              },
              flex: '0 0 auto',
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <CardMedia
              component="img"
              height="220"
              image={dev.image}
              alt={dev.name}
              sx={{ objectFit: 'cover', borderBottom: '1px solid #eee' }}
            />
            <CardContent sx={{ px: 3, py: 2.5 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {dev.name}
              </Typography>
              <Typography variant="subtitle2" color="primary" fontWeight={500}>
                {dev.role}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                mt={1}
                whiteSpace="pre-line"
                sx={{ lineHeight: 1.6 }}
              >
                {dev.description}
              </Typography>
              <Typography
                variant="body2"
                color="secondary"
                fontWeight={600}
                mt={1}
              >
                {dev.techStack}
              </Typography>
              <Box mt={2}>
                <Link
                  href={dev.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  fontWeight={600}
                  color="secondary"
                >
                  {dev.linkLabel}
                </Link>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box mt={6} display="flex" justifyContent="center">
        <Button
          variant="contained"
          component={RouterLink}
          to="/"
          size="large"
          sx={{
            textTransform: 'none',
            borderRadius: 3,
            px: 5,
            py: 1.2,
            fontWeight: 600,
            fontSize: '1rem',
            backgroundColor: theme.palette.primary.main,
            '&:hover': { backgroundColor: theme.palette.primary.dark },
          }}
        >
          ← Back
        </Button>
      </Box>
    </Container>
  );
}

export default Developers;

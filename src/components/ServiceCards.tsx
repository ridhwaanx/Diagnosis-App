import React from "react";
import { Box, Typography, Card, CardContent, Button, Grid } from "@mui/material";

const services = [
  {
    title: "Symptom Analysis",
    image: "/images/img1.jpeg",
  },
  {
    title: "AI-Powered Chatbot",
    image: "/images/img2.jpeg",
  },
  {
    title: "User-Friendly",
    image: "/images/img3.jpeg",
  },
];

const ServiceCards = () => {
  return (
    <Box sx={{ backgroundColor: "transparent", py: 8, px: 3, textAlign: "center" }}>
      <Grid container spacing={8} justifyContent="center">
        {services.map((service, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: 400,
                width: 300,
                backgroundColor: "transparent",
                p: 2,
                borderRadius: 2,
                boxShadow: 3,
                border: "2px solid white",
                backgroundImage: `url(${service.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                position: "relative",
              }}
            >
              <CardContent sx={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
                <Typography
                  variant="h5"
                  fontWeight="medium"
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.6)", 
                    p: 1,
                    borderRadius: 1,
                    textAlign: "center",
                  }}
                >
                  {service.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button variant="contained" color="primary" href="/Login" sx={{ mt: 4, px: 4, py: 1.5 }}>
        EXPLORE OUR SERVICES
      </Button>
    </Box>
  );
};

export default ServiceCards;

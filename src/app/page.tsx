import type { NextPage } from 'next';
import { Box, Typography  } from '@mui/material';
import ServiceCards from '@/components/ServiceCards';

const Home: NextPage = () => {
  return (
    <Box
      sx={{
        height: "92vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
        px: 2,
      }}
    >
      <Typography variant="h3" fontWeight="bold">
        <span style={{ color: "#8cf3fb" }}>EMPOWER YOUR HEALTH</span> WITH AI PRECISION
      </Typography>
      <Typography variant="h5" mt={2} sx={{ maxWidth: '1000px'}}>
      Say goodbye to uncertainty. Our AI-powered system analyzes symptoms instantly, providing <span style={{ color: "#8cf3fb" }}>personalized health insights</span> and recommendations tailored just for you.
      </Typography>
      <Box>
        <ServiceCards />
      </Box>
    </Box>
  );
};

export default Home;
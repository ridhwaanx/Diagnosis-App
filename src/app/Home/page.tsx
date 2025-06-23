"use client"

// Import necessary MUI components
import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import CardComponent from '@/components/DashCard';
import { Box } from '@mui/material';
import HumanScene from '@/components/HumanModel'
import Breadcrumbs from '@/components/Breadcrumbs';

const Home: NextPage = () => {

  const [name, setName] = useState('');

  // Fetch User ID from local storage
  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      setName(parsedUser.name);
    }
  }, []);

  // Redirects to mail
  const handleConsultClick = () => {
    window.location.href = "mailto:healthcare@example.com?subject=Consultation Request&body=Dear Professional,%0D%0A%0D%0AI would like to consult about my symptoms.";
  };

  return (
    <Box sx={{ height: '92vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

      <Box sx={{display: 'flex', border: '2px solid none', borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}>

        <Box sx={{display: 'flex', flexWrap: 'wrap', width: 900, columnGap: 2, justifyContent: 'center', alignItems: 'center' }}>

          <Box sx={{display: 'flex', marginBottom: 2, justifyContent: 'start', width: '800px'}}>
            <Breadcrumbs/>
          </Box>
          
          <CardComponent
            title={`${name}'s Health Profile`}
            subtitle="Health Profile"
            width={800}
            healthProp={true}
            href='Home/Profile'
          />

          <CardComponent
            title="Chat With AI Doctor"
            subtitle="Symptoms Analysis"
            width={390}
            imageUrl='/images/ai.png'
            href='Home/Chat'
          />

          <CardComponent
            title="Medication Plan"
            subtitle="Reminders & Dosage Tracking"
            width={390}
            imageUrl='/images/pills.png'
            href='Home/Medication'
          />

          <CardComponent
            title="Health Reports"
            subtitle="View Trends and Key Health Metrics"
            width={390}
            imageUrl='/images/report.png'
            href='Home/Health'
          />

          <CardComponent
            title="My Symptoms Timeline"
            subtitle="Tracking symptoms over time for better care"
            width={390}
            imageUrl='/images/Timeline.png'
            href='Home/Timeline'
          />

          <CardComponent
            title="Consult a Professional"
            subtitle="Online Consultation with top Doctors from the US and Europe."
            width={800}
            imageUrl='/images/doctor.png'
            onClick={handleConsultClick}
          />
        </Box>
        <HumanScene />

      </Box>
      
    </Box>
  );
};

export default Home;
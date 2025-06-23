"use client"

// Import necessary MUI components
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ProgressBar } from '@/components/ProgressBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GeneralInformation from '@/components/GeneralInformation';
import CardComponent from '@/components/DashCard';

const Profile: NextPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch User ID from local storage
  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      setUserId(parsedUser.id);
    }
  }, []);

  useEffect(() => {
    // Fetch progress whenever userId or refreshTrigger changes
    const fetchProgress = async () => {
      if (!userId) return;
  
      try {
        let totalProgress = 0;
  
        // Fetch basic profile
        const profileResponse = await fetch(`/api/profile/${userId}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
  
          const profileFields = ['age', 'height', 'weight', 'ethnicity', 'sex'];
          let completedProfileFields = 0;
  
          profileFields.forEach(field => {
            if (profileData[field] !== null && profileData[field] !== undefined && profileData[field] !== '') {
              completedProfileFields++;
            }
          });
  
          // 10% per field, max 50%
          totalProgress += Math.min(completedProfileFields * 10, 50);
        }
  
        // Fetch health profile
        const healthResponse = await fetch(`/api/health/${userId}`);
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();

          const healthFields = ['bloodPressure', 'bloodType', 'cholesterol', 'hasAllergies', 'hasConditions'];
          let completedHealthFields = 0;

          healthFields.forEach(field => {
            const value = healthData.data[field];
            
            // Special handling for 'cholesterol' (must have valid numeric values)
            if (field === 'cholesterol') {
              if (value && typeof value === 'object' && 
                  ('total' in value || 'hdl' in value || 'ldl' in value)) {
                completedHealthFields++;
              }
            }
            // For other fields (exclude `false` if needed)
            else if (
              value !== null &&
              value !== undefined &&
              value !== '' &&
              value !== false &&
              !(Array.isArray(value) && value.length === 0)
            ) {
              completedHealthFields++;
            }
          });

          // 10% per field, max 50%
          totalProgress += Math.min(completedHealthFields * 10, 50);
        }

        setProgress(totalProgress);
  
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };
  
    fetchProgress();
  }, [userId, refreshTrigger]);
  

  const handleProfileUpdate = () => {
    // Trigger progress refresh after updates
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Box sx={{ height: '92vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: 1200, alignItems: 'center'}}>

        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '1000px'}}>
          <IconButton aria-label="Back" href="/Home">
            <ArrowBackIcon sx={{ color: "white", scale: 1.4 }} />
          </IconButton>
          <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'white'}}>
            Health Profile
          </Typography>
        </Box>

        {/* Progress Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4, marginY: '1.5vh', width: '1000px'}}>
          <Typography sx={{ color: 'white'}}>
            Complete your health profile to get valuable insights into your health.
          </Typography>
          <ProgressBar value={progress} />
        </Box>

        {/* Profile Form */}
        <GeneralInformation onUpdate={handleProfileUpdate} />

        {/* Health Cards */}
        <CardComponent
          title="Main Health Information"
          subtitle="Manage & View Key Health Insights"
          width={1000}
          imageUrl='/images/arrow.png'
          href='Health'
        />

      </Box>
    </Box>
  );
};

export default Profile;
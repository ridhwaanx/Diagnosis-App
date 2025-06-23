'use client';

// Import necessary MUI components
import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, IconButton, Typography } from '@mui/material';
import HealthDashboard from '@/components/HealthDashboard';
import MinimalHealthForm from '@/components/HealthForm';
import { HealthProfile } from '@/types/health';
import  ArrowBackIcon  from '@mui/icons-material/ArrowBack';


const HealthPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<HealthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch user ID from local storage
  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      setUserId(parsedUser.id);
    }
  }, []);

  // Fetch health data
  useEffect(() => {
    const fetchHealthData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const response = await fetch(`/api/health/${userId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch health data');
        }
        
        if (data.success && data.data) {
          setHealthData(data.data);
        } else {
          setHealthData(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHealthData();
  }, [userId, refreshTrigger]);

  // Function to trigger refresh
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!userId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '92vh', display: 'flex', justifyContent: 'top', alignItems: 'center', flexDirection: 'column'}}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '93%', mt: 3 }}>
        <IconButton aria-label="Back" href="/Home">
          <ArrowBackIcon sx={{ color: "white", scale: 1.4 }} />
        </IconButton>
        <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'white' }}>
          Health Report
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', width: '93%', alignItems: 'top', height: 'auto' }}>
        <MinimalHealthForm 
          userId={userId} 
          onSubmitSuccess={triggerRefresh} // Pass the refresh function
        />
        <HealthDashboard 
          healthData={healthData} 
          loading={loading} 
          error={error} 
          userId={userId}
        />
      </Box>
    </Box>
  );
};

export default HealthPage;
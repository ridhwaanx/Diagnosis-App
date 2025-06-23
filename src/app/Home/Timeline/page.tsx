"use client"

// Import necessary MUI components
import SymptomTracker from '@/components/SymptomTracker';
import React, {useState, useEffect} from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import  ArrowBackIcon  from '@mui/icons-material/ArrowBack';

const UserSymptomsPage = () => {

    const [userId, setUserId] = useState<string | null>(null);

    // Fetch User ID from local storage
    useEffect(() => {
        const localUser = localStorage.getItem('user');
        if (localUser) {
        const parsedUser = JSON.parse(localUser);
        setUserId(parsedUser.id);
        }
    }, []);

    return (
        <Box sx={{ height: '92vh', display: 'flex', justifyContent: 'top', alignItems: 'center', flexDirection: 'column'}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '93%', mt: 3, ml: '30%' }}>
                <IconButton aria-label="Back" href="/Home">
                <ArrowBackIcon sx={{ color: "white", scale: 1.4 }} />
                </IconButton>
                <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'white' }}>
                My Symptom Timeline
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginY: '1.5vh', width: '93%', ml: '30%' }}>
                <Typography sx={{ color: 'white' }}>
                Documenting symptoms to identify patterns
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', maxWidth: 1000}}>
                <SymptomTracker userId={userId} />
            </Box>
        </Box>
    );
};

export default UserSymptomsPage;
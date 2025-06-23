'use client';

// Import necessary MUI components
import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { Box, IconButton, Typography, Chip } from '@mui/material';
import AddMedicationForm from '@/components/AddMedicationForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MedicationCalendar from '@/components/MedicationCalendar';
import { Medication } from '@/types/medications';
import DeleteIcon from '@mui/icons-material/Cancel';

const Medications: NextPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [medicationPeriods, setMedicationPeriods] = useState<Medication[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Fetch User ID from local storage
  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      setUserId(parsedUser.id);
    }
  }, []);

  // Fetch user's medication plans from database
  useEffect(() => {
    const fetchMedications = async () => {
      if (!userId) return;

      try {
        const res = await fetch(`/api/medication/${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();

        // Set date ranges on calendar
        if (data.success) {
          setMedicationPeriods(data.medications);
        }
      } catch (err) {
        console.error('Error fetching medications:', err);
      }
    };

    fetchMedications();
  }, [userId, refreshTrigger]);

  const handleFormSubmit = () => {
    // Trigger re-fetch when a new medication is added
    setRefreshTrigger((prev) => prev + 1);
  };

  // Remove medication plan from database
  const handleDelete = async (medicationId: string) => {
    if (!userId) return;

    try {
      const res = await fetch(`/api/medication/delete/${medicationId}?userId=${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setMedicationPeriods((prev) => prev.filter((med) => med._id !== medicationId));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  return (
    <Box sx={{ height: '92vh', display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '93%', alignItems: 'center', marginTop: 3 }}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '93%' }}>
          <IconButton aria-label="Back" href="/Home">
            <ArrowBackIcon sx={{ color: "white", scale: 1.4 }} />
          </IconButton>
          <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'white' }}>
            Medication Plan
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginY: '1.5vh', width: '93%' }}>
          <Typography sx={{ color: 'white' }}>
            Stay in track with new & existing plans
          </Typography>
        </Box>

        <Box sx={{ marginBottom: '16px', height: 75, overflowY: 'hidden' }}>
          {medicationPeriods.map((period) => (
            <Chip
              key={period._id}
              label={`${period.medicationName} (${period.dosage} - ${period.frequency})`}
              onDelete={() => handleDelete(period._id)}
              deleteIcon={<DeleteIcon sx={{ stroke: 'white' }} />}
              style={{
                backgroundColor: period.color || '#3174ad',
                color: 'white',
                marginRight: '8px',
                marginBottom: '8px',
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'start', width: '100%', height: '100%' }}>
          <AddMedicationForm onSubmitSuccess={handleFormSubmit} userId={userId} />
          <MedicationCalendar medicationPeriods={medicationPeriods} />
        </Box>
      </Box>
    </Box>
  );
};

export default Medications;

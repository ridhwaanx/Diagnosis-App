"use client"

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

// Props interface for the component
interface GeneralInformationProps {
  onUpdate: () => void;
}

// Type definition for profile data structure
interface ProfileData {
  age: string;
  height: string;
  weight: string;
  ethnicity: string;
  sex: string;
}

const GeneralInformationCard = ({ onUpdate }: GeneralInformationProps) => {
  // State management
  const [profileData, setProfileData] = useState<ProfileData>({
    age: '',
    height: '',
    weight: '',
    ethnicity: '',
    sex: ''
  });

  const [editingField, setEditingField] = useState<keyof ProfileData | null>(null); // Currently edited field
  const [tempValue, setTempValue] = useState(''); // Temporary value during editing
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      setError('User ID not found. Please log in again.');
      setIsLoading(false);
      setUserId(parsedUser.id);
      fetchProfileData(parsedUser.id);
    }
  }, []);

  // Fetch profile data from API
  const fetchProfileData = async (userId: string) => {
    try {
      const response = await fetch(`/api/profile/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit field handlers
  const handleEditClick = (field: keyof ProfileData) => {
    setEditingField(field);
    setTempValue(profileData[field]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(e.target.value);
  };

  // Save updated field to API
  const handleSave = async (field: keyof ProfileData) => {
    try {
      const updatedData = {
        ...profileData,
        [field]: tempValue
      };
      setProfileData(updatedData);

      const response = await fetch(`/api/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: tempValue }),
      });

      if (response.ok) {
        onUpdate(); // Trigger parent to refresh progress
      }
      else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setEditingField(null);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  // Reusable component for editable info fields
  const InfoField = ({ 
    label,
    endLabel, 
    fieldKey,
    editable = true 
  }: {
    label: string;
    endLabel: string;
    fieldKey: keyof ProfileData;
    editable?: boolean;
  }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {label}
      </Typography>
      {editingField === fieldKey ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
          <TextField
            variant="outlined"
            size="small"
            value={tempValue}
            onChange={handleChange}
            autoFocus
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">
                  <IconButton onClick={() => handleSave(fieldKey)} color="primary">
                    <SaveIcon />
                  </IconButton>
                </InputAdornment>,
              },
            }}
            sx={{width: 275}}
          />
          <IconButton onClick={handleCancel} color="primary">
            <EditIcon />
          </IconButton>
          
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            value={isLoading ? 'Loading...' : profileData[fieldKey] || 'Not provided'}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">{`${endLabel}`}</InputAdornment>,
              },
            }}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#F8F9F8',
              },
              '& .MuiOutlinedInput-input': {
                cursor: 'default',
              },
              width: 275
            }}
          />
          {editable && (
            <IconButton 
              onClick={() => handleEditClick(fieldKey)}
              aria-label={`Edit ${label.toLowerCase()}`}
              sx={{ ml: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        p: 3,
        backgroundColor: 'white',
        width: 1000,
        marginY: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          General Information
        </Typography>
      </Box>
      
      <Grid container spacing={6} sx={{ width: '100%', justifyContent: 'space-around', }}>
        {/* Left column: Age, Height, Weight */}
        <Grid xs={12} md={6}>
          <InfoField label="Age" fieldKey="age" endLabel='Years' />
          <InfoField label="Height" fieldKey="height" endLabel='cm' />
          <InfoField label="Weight" fieldKey="weight" endLabel='Kg' />
        </Grid>

        {/* Middle column: Image placeholder */}
        <Grid xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ 
            maxWidth: 150,
            height: 250,
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <Box
              component="img"
              src="../images/human.png"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
              alt="Profile illustration"
            />
          </Box>
        </Grid>

        {/* Right column: Ethnicity, Sex */}
        <Grid xs={12} md={6}>
          <InfoField label="Ethnicity" fieldKey="ethnicity" endLabel=''/>
          <InfoField label="Sex assigned at birth" fieldKey="sex" endLabel=''/>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeneralInformationCard;
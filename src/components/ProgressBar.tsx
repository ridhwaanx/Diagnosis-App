"use client"

import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface ProgressWithLabelProps {
  value: number;
}

export const ProgressBar: React.FC<ProgressbarProps> = ({ value }) => 
   {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '40%' }}>
      <Box sx={{ flexGrow: 1, mr: 2 }}>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            height: 8,
            borderRadius: 5,
            backgroundColor: '#eee',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#4CAF50', // Green
              borderRadius: 5,
            },
          }}
        />
      </Box>
      <Typography variant="body2" fontWeight="bold" sx={{ color: 'white' }}>
        {value}% completed
      </Typography>
    </Box>
  );
};

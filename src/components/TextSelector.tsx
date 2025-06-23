// components/TextSelector.tsx
import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';

interface TextSelectorProps {
  title: string;
  options: string[];
  onSelect: (option: string) => void;
}

const TextSelector: React.FC<TextSelectorProps> = ({ title, options, onSelect }) => {
  const handleClick = (option: string) => {
    onSelect(option);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
        {title}
      </Typography>
      <Grid container spacing={1}>
        {options.map((option, index) => (
          <Grid item key={index}>
            <Button
              variant="outlined"
              onClick={() => handleClick(option)}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                borderColor: '#e0e0e0',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  borderColor: 'primary.dark',
                  color: 'white'
                },
              }}
            >
              {option.replace(/_/g, ' ')} {/* Convert underscores to spaces for display */}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TextSelector;
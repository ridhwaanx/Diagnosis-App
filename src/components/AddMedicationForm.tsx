"use client"

import React from 'react';
import { 
  Box,  
  TextField, 
  Button, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography
} from '@mui/material';

// Props interface for the component
interface AddMedicationFormProps {
  userId: string | null;
  onSubmitSuccess: () => void;
}

// Form data structure
interface MedicationFormData {
  startDate: string;
  endDate: string;
  timeOfDay: string;
  medicineName: string;
  dose: string;
  noTimes: string;
}

const AddMedicationForm: React.FC<AddMedicationFormProps> = ({ userId, onSubmitSuccess }) => {
  // State to manage form data
  const [formData, setFormData] = React.useState<MedicationFormData>({
    startDate: '',
    endDate: '',
    timeOfDay: 'Before Breakfast',
    medicineName: '',
    dose: '',
    noTimes: '',
  });

  // Handler for text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler for select dropdown changes
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  
    // API call to submit medication data
    try {
      const res = await fetch(`/api/medication/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicationName: formData.medicineName,
          startDate: formData.startDate,
          endDate: formData.endDate,
          dosage: formData.dose,
          frequency: formData.noTimes,
        })
      });
  
      const data = await res.json();
      if (data.success) {
        onSubmitSuccess(true) // Trigger success callback
        alert('Medication added successfully');
        // Reset form or redirect as needed
      } else {
        alert('Failed to add medication');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };
  

  return (
    // Form container with styling
    <Box sx={{ maxWidth: 470, height: 521, p: 3, borderRadius: 2, backgroundColor: 'white' }}>
      <form onSubmit={handleSubmit}>
        {/* Form title */}
        <Typography variant='h4' sx={{ mb: 3, fontWeight: 'bold'}}>New Plan</Typography>
        <Grid container spacing={3} sx={{ mb: 3}}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          {/* Date inputs grid */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }} // Makes label always visible
              fullWidth
              required
            />
          </Grid>
        </Grid>

        {/* Time of day selection */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="time-of-day-label">Time of Day</InputLabel>
          <Select
            labelId="time-of-day-label"
            name="timeOfDay"
            value={formData.timeOfDay}
            label="Time of Day"
            onChange={handleSelectChange}
            required
          >
            {/* Time options */}
            <MenuItem value="Before Breakfast">Before Breakfast</MenuItem>
            <MenuItem value="After Breakfast">After Breakfast</MenuItem>
            <MenuItem value="Before Lunch">Before Lunch</MenuItem>
            <MenuItem value="After Lunch">After Lunch</MenuItem>
            <MenuItem value="Before Dinner">Before Dinner</MenuItem>
            <MenuItem value="After Dinner">After Dinner</MenuItem>
            <MenuItem value="At Bedtime">At Bedtime</MenuItem>
          </Select>
        </FormControl>

        {/* Medicine name input */}
        <TextField
          label="Medicine Name"
          name="medicineName"
          fullWidth
          value={formData.medicineName}
          onChange={handleInputChange}
          sx={{ mb: 3 }}
          required
        />

        {/* Dose and frequency grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <TextField
              label="Dose"
              name="dose"
              fullWidth
              value={formData.dose}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="No Times"
              name="noTimes"
              fullWidth
              value={formData.noTimes}
              onChange={handleInputChange}
              required
            />
          </Grid>
        </Grid>

        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{
            py: 2,
            fontWeight: 'bold',
            textTransform: 'none',
            fontSize: '1.1rem'
          }}
        >
          Add New Medication
        </Button>
      </form>
    </Box>
  );
};

export default AddMedicationForm;
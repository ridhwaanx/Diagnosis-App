'use client';

import React, { useState, useEffect } from 'react';
import { HealthProfile, ApiResponse } from '@/types/health';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip
} from '@mui/material';

// Interface for form data structure
interface HealthFormData {
  bloodType?: string;
  bloodPressure?: string;
  cholesterol?: {
    total?: number;
    hdl?: number;   
    ldl?: number;
  };
  hasAllergies?: boolean;
  allergies?: string[];
  hasConditions?: boolean;
  conditions?: string[];
}

const MinimalHealthForm = ({ userId, onSubmitSuccess }: { userId: string, onSubmitSuccess?: () => void; }) => {
    // Component state management
    const [formData, setFormData] = useState<HealthProfile>({});
    const [loading, setLoading] = useState(false);
    const [newAllergy, setNewAllergy] = useState('');
    const [newCondition, setNewCondition] = useState('');

    // Handlers for form inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };
    
    // Add new allergy/condition to the list
    const handleAddItem = (type: 'allergies' | 'conditions') => {
        const value = type === 'allergies' ? newAllergy : newCondition;
        if (value.trim()) {
            setFormData(prev => ({
            ...prev,
            [type]: [...(prev[type] || []), value.trim()]
            }));
            if (type === 'allergies') setNewAllergy('');
            if (type === 'conditions') setNewCondition('');
        }
    };
    
  
    // Form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
  
      if (!userId) return;
      
      try {
        const response = await fetch(`/api/health/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        const result: ApiResponse<void> = await response.json();
        
        if (!result.success) {
          throw new Error(result.message);
        }
        
        // Call the success callback if provided
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } catch (error) {
        console.error('Error saving health profile:', error);
        alert(error instanceof Error ? error.message : 'Failed to save health profile');
      } finally {
        setLoading(false);
      }
    };
  
    // Fetch existing health profile on component mount
    useEffect(() => {
      const fetchHealthProfile = async () => {
        if (!userId) return;
        try {
          const response = await fetch(`/api/health/${userId}`);
          const result: ApiResponse<HealthProfile> = await response.json();
          
          if (result.success && result.data) {
            setFormData(result.data);
          }
        } catch (error) {
          console.error('Error fetching health profile:', error);
        }
      };
  
      fetchHealthProfile();
    }, [userId]);

  return (
    <Box sx={{ maxWidth: 400, p: 3, backgroundColor: 'white', borderRadius: 1, minHeight: '546px',  mt: 2}}>

      <Box component="form" onSubmit={handleSubmit}>
        {/* Blood Type */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Blood Type</InputLabel>
          <Select
            value={formData.bloodType || ''}
            onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
            label="Blood Type"
          >
            <MenuItem value="A+">A+</MenuItem>
            <MenuItem value="A-">A-</MenuItem>
            <MenuItem value="B+">B+</MenuItem>
            <MenuItem value="B-">B-</MenuItem>
            <MenuItem value="AB+">AB+</MenuItem>
            <MenuItem value="AB-">AB-</MenuItem>
            <MenuItem value="O+">O+</MenuItem>
            <MenuItem value="O-">O-</MenuItem>
          </Select>
        </FormControl>

        {/* Blood Pressure */}
        <TextField
          fullWidth
          label="Blood Pressure"
          name="bloodPressure"
          value={formData.bloodPressure || ''}
          onChange={handleInputChange}
          placeholder="e.g. 120/80"
          sx={{ mb: 2 }}
        />

        {/* Cholesterol */}
        <Typography variant="subtitle2" sx={{ mb: 2 }}>Cholesterol (mg/dL)</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Total"
            type="number"
            name="total"
            value={formData.cholesterol?.total || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              cholesterol: { ...prev.cholesterol, total: Number(e.target.value) }
            }))}
          />
          <TextField
            fullWidth
            label="HDL"
            type="number"
            name="hdl"
            value={formData.cholesterol?.hdl || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              cholesterol: { ...prev.cholesterol, hdl: Number(e.target.value) }
            }))}
          />
          <TextField
            fullWidth
            label="LDL"
            type="number"
            name="ldl"
            value={formData.cholesterol?.ldl || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              cholesterol: { ...prev.cholesterol, ldl: Number(e.target.value) }
            }))}
          />
        </Box>

        {/* Allergies */}
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.hasAllergies || false}
              onChange={handleCheckboxChange}
              name="hasAllergies"
            />
          }
          label="I have allergies"
          sx={{ mb: 2 }}
        />
        
        {formData.hasAllergies && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Add allergy"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                size="small"
              />
              <Button 
                variant="outlined" 
                onClick={() => handleAddItem('allergies')}
                disabled={!newAllergy.trim()}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ mt: 1 }}>
              {formData.allergies?.map((item, i) => (
                <Chip 
                  key={i} 
                  label={item} 
                  onDelete={() => setFormData(prev => ({
                    ...prev,
                    allergies: prev.allergies?.filter((_, index) => index !== i)
                  }))}
                  size="small"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Conditions */}
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.hasConditions || false}
              onChange={handleCheckboxChange}
              name="hasConditions"
            />
          }
          label="I have chronic conditions"
          sx={{ mb: 2 }}
        />
        
        {formData.hasConditions && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Add condition"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                size="small"
              />
              <Button 
                variant="outlined" 
                onClick={() => handleAddItem('conditions')}
                disabled={!newCondition.trim()}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ mt: 1 }}>
              {formData.conditions?.map((item, i) => (
                <Chip 
                  key={i} 
                  label={item} 
                  onDelete={() => setFormData(prev => ({
                    ...prev,
                    conditions: prev.conditions?.filter((_, index) => index !== i)
                  }))}
                  size="small"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        )}

        <Button 
          type="submit" 
          variant="contained" 
          fullWidth
          disabled={loading}
          sx={{ mb: 2, py: 1.5  }}
        >
          {loading ? 'Saving...' : 'Save Health Profile'}
        </Button>
      </Box>
    </Box>
  );
};

export default MinimalHealthForm;
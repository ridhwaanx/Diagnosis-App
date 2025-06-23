"use client"

// Import necessary MUI components
import React, { useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import TextSelector from '@/components/TextSelector';
import SymptomChat from '@/components/SymptomChat';

const Chat = () => {
  const [selectedSymptom, setSelectedSymptom] = useState<string>('');
  const symptomOptions = [
    'fever',
    'frequent urination',
    'cough',
    'headache',
    'nausea',
    'vomiting',
    'fatigue',
    'abdominal pain',
    'diarrhoea',
    'constipation',
    'joint pain',
    'muscle pain',
    'back pain',
    'chest pain',
    'sore throat',
    'throat irritation',
    'shortness of breath',
    'breathlessness',
    'runny nose',
    'sneezing',
  ];

  const handleSymptomSelect = (symptom: string) => {
    setSelectedSymptom(symptom);
  };

  return (
    <Box sx={{ height: '92vh', display: 'flex', justifyContent: 'center', alignItems: 'top' }}>
      <Container sx={{ pt: 4, pb: 10, width: '100%' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="body1" sx={{ color: 'primary.dark' }}>
            Hello! I'm your AI Doctor trained by human doctors.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignitems: 'center', gap: 2 }}>
            <Typography variant="h4" sx={{ mt: 1, color: 'white', fontWeight: 'bold' }}>
              How can I help you?
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignitems: 'center', color: 'white', width: '100%'}}>
          <TextSelector 
            title="Start with Symptoms" 
            options={symptomOptions} 
            onSelect={handleSymptomSelect}
          />
        </Box>

        <SymptomChat selectedSymptom={selectedSymptom} />
      </Container>
    </Box>
  );
};

export default Chat;
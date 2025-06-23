"use client"

import React, { useEffect, useState } from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from '@mui/lab';
import { Typography, Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Type definitions
type Symptom = {
  name: string;
  date: string;
};

type SymptomTrackerProps = {
  userId: string;
};

// Styled paper component for timeline items
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  justifyItems: 'center'
}));

const SymptomTracker: React.FC<SymptomTrackerProps> = ({ userId }) => {
  // State management
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

  // Fetch symptoms when userId changes
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await fetch(`${API_URL}/symptoms/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch symptoms');
        }
        const data = await response.json();
        setSymptoms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSymptoms();
    }
  }, [userId]);

  // Loading and error states
  if (loading) return <Typography>Loading symptoms...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (symptoms.length === 0) return <Typography>No symptoms recorded</Typography>;

  // Sort symptoms by date (newest first)
  const sortedSymptoms = [...symptoms].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Box
      sx={{
        maxHeight: '600px',
        width: 1200,
        overflowY: 'auto',
        padding: 2,
      }}
    >
      <Timeline position="alternate">
        {sortedSymptoms.map((symptom, index) => (
          <TimelineItem key={`${symptom.name}-${symptom.date}`}>
            <TimelineOppositeContent
              sx={{ m: 'auto 0' }}
              align="right"
              variant="body2"
              color="white"
            >
              {formatDate(symptom.date)}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              {index !== sortedSymptoms.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <StyledPaper elevation={3}>
                <Typography variant="h6" component="h1">
                  {symptom.name}
                </Typography>
              </StyledPaper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default SymptomTracker;
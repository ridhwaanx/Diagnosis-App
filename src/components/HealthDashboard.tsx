'use client';

import React from 'react';
import { Box, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useRouter } from 'next/navigation';
import { HealthProfile } from '@/types/health';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Component props interface
interface HealthDashboardProps {
  healthData: HealthProfile | null;
  loading?: boolean;
  error?: string | null;
  userId: string;
}

const HealthDashboard = ({ 
  healthData, 
  loading = false, 
  error = null, 
  userId 
}: HealthDashboardProps) => {
  const router = useRouter();

  // Prepare cholesterol data for visualization
  const prepareCholesterolData = () => {
    if (!healthData?.cholesterol) return [];
    
    return [
      { name: 'Total', value: healthData.cholesterol.total },
      { name: 'HDL', value: healthData.cholesterol.hdl },
      { name: 'LDL', value: healthData.cholesterol.ldl }
    ].filter(item => item.value !== undefined);
  };

  // Parse blood pressure string into numeric values
  const parseBloodPressure = () => {
    if (!healthData?.bloodPressure) return null;
    const [systolic, diastolic] = healthData.bloodPressure.split('/').map(Number);
    return { systolic, diastolic };
  };

  // Format blood pressure data for chart
  const bloodPressureData = healthData?.bloodPressure ? [
    { 
      name: 'Blood Pressure',
      systolic: parseInt(healthData.bloodPressure.split('/')[0]),
      diastolic: parseInt(healthData.bloodPressure.split('/')[1])
    }
  ] : [];

  // Loading state UI
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px" marginLeft="500px">
        <CircularProgress />
      </Box>
    );
  }

  // Error state UI
  if (error) {
    return (
      <Box textAlign="center" p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Empty state UI (no health data)
  if (!healthData) {
    return (
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            No Health Profile Found
          </Typography>
          <Typography sx={{ mb: 3 }}>
            You don't have a health profile yet. Create one to track your health metrics.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push(`/profile/health`)}
          >
            Create Health Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  const cholesterolData = prepareCholesterolData();
  const bloodPressure = parseBloodPressure();

  return (
    <Box sx={{ mt: 2, width: '1000px', mx: 3 }}>
      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        {/* Blood Type Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Blood Type
            </Typography>
            <Typography variant="h3" color="primary">
              {healthData.bloodType || 'Not specified'}
            </Typography>
          </CardContent>
        </Card>

        {/* Blood Pressure Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Blood Pressure
            </Typography>
            {bloodPressure ? (
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <Typography variant="h3" color="primary">
                  {bloodPressure.systolic}/{bloodPressure.diastolic}
                </Typography>
                <Typography variant="body2">
                  mmHg
                </Typography>
              </Box>
            ) : (
              <Typography>Not specified</Typography>
            )}
          </CardContent>
        </Card>

        {/* Allergies List */}
        {healthData.allergies?.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Allergies
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {healthData.allergies.map((allergy, index) => (
                  <Typography
                    key={index}
                    component="span"
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: COLORS[index % COLORS.length],
                      color: 'white',
                      borderRadius: 1,
                    }}
                  >
                    {allergy}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Conditions List */}
        {healthData.conditions?.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chronic Conditions
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {healthData.conditions.map((condition, index) => (
                  <Typography
                    key={index}
                    component="span"
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: COLORS[index % COLORS.length],
                      color: 'white',
                      borderRadius: 1,
                    }}
                  >
                    {condition}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 4, justifyContent: 'space-center' }}>
        {/* Cholesterol Chart */}
        {cholesterolData.length > 0 && (
          <Card sx={{ width: '43%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cholesterol Levels (mg/dL)
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cholesterolData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Cholesterol" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Blood Pressure Chart */}
        {bloodPressureData.length > 0 && (
          <Card sx={{ width: '43%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Blood Pressure
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bloodPressureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="systolic" fill="#FF8042" />
                  <Bar dataKey="diastolic" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default HealthDashboard;
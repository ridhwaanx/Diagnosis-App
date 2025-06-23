"use client"

import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { usePathname } from 'next/navigation';

export default function NavigationBreadcrumbs() {
  const pathname = usePathname();
  
  // Map paths to their display names
  const pathMap: Record<string, string> = {
    '/Home': 'Dashboard',
    '/Profile': 'Profile',
    '/Chat': 'Chat',
    '/MedicationPlan': 'Medication Plan',
    '/UpcomingAppointments': 'Upcoming Appointments',
    '/ConsultDoctor': 'Consult a Doctor'
  };

  // Get current path segments
  const paths = pathname.split('/').filter(Boolean);
  paths.unshift(''); // Add empty string to represent root

  return (
    <Breadcrumbs 
      aria-label="breadcrumb" 
      sx={{ 
        color: 'white', 
        fontWeight: 'bold',
        '& .MuiLink-root': {
          '&:hover': {
            textDecoration: 'underline',
            color: 'rgba(255, 255, 255, 0.8)'
          }
        }
      }}
    >
      {paths.map((segment, index) => {
        const path = `/${paths.slice(1, index + 1).join('/')}` || '/Home';
        const isLast = index === paths.length - 1;
        
        return isLast ? (
          <Typography key={path} color="white">
            {pathMap[path] || segment}
          </Typography>
        ) : (
          <Link
            key={path}
            underline="hover"
            color="inherit"
            href={path}
          >
            {pathMap[path] || segment}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
'use client'; // Important for using client-side components in Next.js 13+

import React from 'react';
import { styled } from '@mui/material/styles';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Paper, Typography } from '@mui/material';

// Date localization setup
const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Interface for medication period data structure
interface MedicationPeriod {
  id: string;
  medicationName: string;
  startDate: Date;
  endDate: Date;
  dosage: string;
  frequency: string;
  color?: string;
}

interface MedicationCalendarProps {
  medicationPeriods: MedicationPeriod[]; // Array of medication periods to display
}

// Styled container for the calendar
const StyledCalendarContainer = styled(Paper)(({ theme }) => ({
  height: '60vh',
  padding: '1%',
}));

const MedicationCalendar: React.FC<MedicationCalendarProps> = ({ medicationPeriods }) => {
  // Generate events with colors for each medication period
  const events = medicationPeriods.map((period) => ({
    id: period.id,
    title: `${period.medicationName} (${period.dosage})`,
    start: new Date(period.startDate),
    end: new Date(period.endDate),
    allDay: true,
    medication: period,
    color: period.color ?? '#3174ad',
  }));

  // Custom styling for calendar events
  const eventStyleGetter = (event: any) => {
    const backgroundColor = event.color;
    const style = {
      backgroundColor,
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style,
    };
  };

  return (
    <StyledCalendarContainer >
      
      <Typography variant="h6" gutterBottom>
        Medication Schedule
      </Typography>

      {/* Main calendar component */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100% - 40px)' }}
        defaultView="month"
        views={['month', 'week', 'day', 'agenda']}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => {
          alert(
            `Medication: ${event.medication.medicationName}\n` +
              `Dosage: ${event.medication.dosage}\n` +
              `Frequency: ${event.medication.frequency}\n` +
              `Period: ${format(event.start, 'MMM d, yyyy')} - ${format(event.end, 'MMM d, yyyy')}`
          );
        }}
      />
    </StyledCalendarContainer>
  );
};

export default MedicationCalendar;
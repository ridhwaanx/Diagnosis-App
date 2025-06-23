import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';

// Feature items data array
const items = [
  {
    icon: <SettingsSuggestRoundedIcon sx={{ color: 'white' }} />,
    title: 'Adaptable performance',
    description:
      'Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.',
  },
  {
    icon: <ConstructionRoundedIcon sx={{ color: 'white' }} />,
    title: 'Built to last',
    description:
      'Experience unmatched durability that goes above and beyond with lasting investment.',
  },
  {
    icon: <ThumbUpAltRoundedIcon sx={{ color: 'white' }} />,
    title: 'Great user experience',
    description:
      'Integrate our product into your routine with an intuitive and easy-to-use interface.',
  },
  {
    icon: <AutoFixHighRoundedIcon sx={{ color: 'white' }} />,
    title: 'Innovative functionality',
    description:
      'Stay ahead with features that set new standards, addressing your evolving needs better than the rest.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      {/* Logo and heading section - hidden on mobile */}
      <Box sx={{ display: { xs: 'none', md: 'flex', alignItems: 'center', gap: 7, marginBottom: 35 } }}>
        <Box sx={{ height: 100, display: 'flex'}}>
            <Box sx={{
                height: 120,
                width: 120,
                backgroundImage: "url('/images/logo.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat' }}/>
            </Box>
            {/* Tagline text */}
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                    Your Health, Simplified.
            </Typography>
        </Box>

      {/* Feature items list */}
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium', color: 'white' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}

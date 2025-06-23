import React from 'react';
import { Card, CardContent, Typography, CardMedia, Box } from '@mui/material';
import {QuarterProgress} from '@/components/QuarterProgress';
import Link from 'next/link';


interface CardComponentProps {
  title: string;
  subtitle?: string;
  width?: number;
  content?: React.ReactNode;
  imageUrl?: string;
  healthProp?: boolean;
  href?: string; // New href prop
  onClick?: () => void; // Optional click handler
  sx?: Props;
}

const CardComponent: React.FC<CardComponentProps> = ({ 
  title, 
  subtitle, 
  width, 
  content, 
  imageUrl,
  healthProp = false, 
  href,
  onClick,
  sx = ''
}) => {
  // Card content component
  const cardContent = (
    <>
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: 2 }}>
            {subtitle}
          </Typography>
        )}
        {content}
      </CardContent>
      {imageUrl && (
        <CardMedia 
          image={imageUrl} 
          sx={{ height: 100, width: 100, marginRight: 2 }}
        />
      )}
      {healthProp && (
        <Box sx={{ m: 2 }}>
          <QuarterProgress />
        </Box>
      )}
    </>
  );

  // Card with click behavior
  const card = (
    <Card 
      sx={{
        display: 'flex',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 2, 
        border: '1px solid #f3f3f3', 
        width: width, 
        height: 130,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
          borderColor: '#ddd',
          cursor: 'pointer',
          backgroundColor: 'white'
        },
        ...sx
      }}
      onClick={onClick}
    >
      {cardContent}
    </Card>
  );

  // Wrap with Link if href is provided
  return href ? (
    <Link href={href} passHref legacyBehavior>
      {card}
    </Link>
  ) : (
    card
  );
};

export default CardComponent;
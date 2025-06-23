import type { NextPage } from 'next';
import { Box } from '@mui/material';
import SignInCard from '@/components/SignInCard.tsx';
import Content from '@/components/Content.tsx';

const SignIn: NextPage = () => {
  return (
    <Box sx={{
      height: '92.55vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      gap: 20
       }}>
      <Content/>
      <SignInCard/>
    </Box>
  );
};

export default SignIn;
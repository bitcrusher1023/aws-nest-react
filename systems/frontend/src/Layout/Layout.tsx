import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import type { PropsWithChildren } from 'react';

import PSNIcon from './PSNIcon';
import SonyIcon from './sony_logo.svg';

function Heading() {
  return (
    <Box
      sx={{
        backgroundColor: 'common.black',
        display: 'flex',
        height: '3.6rem',
        justifyContent: 'end',
        p: 1,
      }}
    >
      <Box
        component={'img'}
        src={SonyIcon}
        sx={{
          width: '7.5rem',
        }}
      />
    </Box>
  );
}

function NavBar() {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'background.default',
      }}
    >
      <Toolbar>
        <Box sx={{ mr: 1 }}>
          <PSNIcon />
        </Box>
        <Typography sx={{ color: 'text.secondary' }} variant={'h2'}>
          Game Library
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <>
      <Heading />
      <NavBar />
      <Paper>{children}</Paper>
    </>
  );
}

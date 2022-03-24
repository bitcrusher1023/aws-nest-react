import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useState } from 'react';

import AddGameLibraryForm from './AddGameLibrary.form';

function FormDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button color={'primary'} onClick={handleClickOpen} variant="contained">
        Add game to library
      </Button>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Add game to your library</DialogTitle>
        <DialogContent>
          <AddGameLibraryForm />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function GameLibraryPage() {
  return (
    <Paper sx={{ pl: 8, pr: 8, pt: 2 }}>
      <Grid container>
        <Grid item md={8} xs={10}>
          <Box>List of game here</Box>
        </Grid>
        <Grid item md={4} xs={2}>
          <Stack>
            <FormDialog />
            <Box>Filter here if have time</Box>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

import type {} from '@mui/lab/themeAugmentation';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider as MuiThemeProvider } from '@mui/system';
import type { PropsWithChildren } from 'react';

const theme = createTheme({
  palette: {
    background: {
      paper: '#f5f7fa',
    },
    primary: {
      main: '#FFF',
    },
    secondary: {
      main: '#0068bd',
    },
  },
});

export default function ThemeProvider({
  children,
}: PropsWithChildren<unknown>) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

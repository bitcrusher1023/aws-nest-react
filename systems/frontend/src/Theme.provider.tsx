import type {} from '@mui/lab/themeAugmentation';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import {
  experimental_sx as sx,
  ThemeProvider as MuiThemeProvider,
} from '@mui/system';
import type { PropsWithChildren } from 'react';

export const appTheme = responsiveFontSizes(
  createTheme({
    components: {
      MuiButton: {
        variants: [
          {
            props: { color: 'primary' },
            style: sx({
              ':hover': {
                backgroundColor: 'grey.400',
              },
              backgroundColor: 'background.default',
              color: 'text.primary',
            }),
          },
          {
            props: { color: 'secondary' },
            style: sx({
              ':hover': {
                backgroundColor: 'grey.400',
              },
              backgroundColor: 'grey.300',
              color: 'text.secondary',
            }),
          },
        ],
      },
      MuiButtonGroup: {
        styleOverrides: {
          grouped: sx({
            '&:not(:last-child)': {
              borderColor: 'grey.100',
            },
          }),
        },
      },
    },
    palette: {
      background: {
        paper: '#f5f7fa',
      },
    },
    typography: {
      htmlFontSize: 10,
    },
  }),
);

export default function ThemeProvider({
  children,
}: PropsWithChildren<unknown>) {
  return <MuiThemeProvider theme={appTheme}>{children}</MuiThemeProvider>;
}

import { LocalizationProvider } from '@mui/lab';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import type { PropsWithChildren } from 'react';

import ApolloClientProvider from './ApolloClient.provider';
import ThemeProvider from './Theme.provider';

export default function GlobalContextProvider({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <ThemeProvider>
      <ApolloClientProvider>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          {children}
        </LocalizationProvider>
      </ApolloClientProvider>
    </ThemeProvider>
  );
}

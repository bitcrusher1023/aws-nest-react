import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import type { PropsWithChildren } from 'react';

import getEnv from './get-env';

const cache = new InMemoryCache();

export default function ApolloClientProvider({
  children,
}: PropsWithChildren<unknown>) {
  const uri = `${getEnv('REACT_APP_BACKEND_HOST')}/graphql`;
  const client = new ApolloClient({
    cache,
    link: createUploadLink({
      uri: uri,
    }),
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

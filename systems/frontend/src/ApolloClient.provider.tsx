import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import type { PropsWithChildren } from 'react';

const cache = new InMemoryCache();

export default function ApolloClientProvider({
  children,
}: PropsWithChildren<unknown>) {
  const client = new ApolloClient({
    cache,
    link: createUploadLink({}),
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

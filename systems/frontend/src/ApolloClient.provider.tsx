import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import type { PropsWithChildren } from 'react';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        gameList: {
          keyArgs: false,

          merge(existing = {}, incoming, { args: { offset } }: any) {
            const existingEdges = existing.edges?.slice(0) ?? [];
            const { __typename, edges, pageInfo, totalCount } = incoming;
            edges.forEach((edge: any, index: any) => {
              existingEdges[offset + index] = edge;
            });
            return {
              __typename,
              edges: existingEdges,
              pageInfo,
              totalCount,
            };
          },

          read(existing = {}, { args: { limit, offset } }: any) {
            return {
              __typename: existing.__typename,
              edges: existing.edges?.slice(offset, offset + limit) ?? [],
              pageInfo: existing.pageInfo,
              totalCount: existing.totalCount,
            };
          },
        },
      },
    },
  },
});

export default function ApolloClientProvider({
  children,
}: PropsWithChildren<unknown>) {
  const client = new ApolloClient({
    cache,
    link: createUploadLink({}),
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

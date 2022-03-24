import { ApolloError, gql, useQuery } from '@apollo/client';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { appTheme } from '../Theme.provider';
import userId from './user';

const GET_GAME_LIST = gql`
  query queryGameList(
    $userId: ID
    $offset: Int
    $limit: Int
    $platform: String
  ) {
    gameList(
      userId: $userId
      offset: $offset
      limit: $limit
      platform: $platform
    ) {
      edges {
        node {
          id
          boxArtImageUrl
          platform
          name
          publisher
        }
      }
      pageInfo {
        hasNextPage
      }
      totalCount
    }
  }
`;

export interface Game {
  boxArtImageUrl: string;
  id: string;
  name: string;
  platform: string;
  publisher: string;
}

interface Data {
  gameList: { edges: { node: Game }[]; totalCount: number };
}

interface TContextValue {
  currentPage?: number;
  data?: Data;
  error?: ApolloError;
  loading?: boolean;
  platformFilter?: string;
  refetch?: () => void;
  setFilter?: (_: unknown, platform: string) => void;
  setPage?: (_: unknown, page: number) => void;
  totalPage?: number;
  variables?: {
    offset: number;
  };
}

const GameListContext = createContext<TContextValue>({});

// https://www.apollographql.com/docs/react/pagination/offset-based
export default function GameListProvider({
  children,
}: PropsWithChildren<unknown>) {
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [currentOffSet, setOffset] = useState(0);
  const { data, error, fetchMore, loading, refetch, variables } = useQuery<
    Data,
    {
      limit: number;
      offset: number;
      platform?: string;
      userId: string;
    }
  >(GET_GAME_LIST, {
    variables: { limit: 8, offset: currentOffSet, userId },
  });
  const setFilter = useCallback(
    async (_: unknown, platform) => {
      await refetch({
        offset: 0,
        platform: platform === 'ALL' ? null : platform,
      });
      setPlatformFilter(platform);
      setOffset(0);
    },
    [refetch],
  );
  const setPage = useCallback(
    async (_, page: number) => {
      const { limit } = variables!;
      const newOffset = (page - 1) * limit;
      await fetchMore({
        variables: {
          offset: newOffset,
        },
      });
      setOffset(newOffset);
    },
    [fetchMore, variables],
  );
  const { currentPage, totalPage } = useMemo(() => {
    const { limit } = variables!;
    const total = data?.gameList?.totalCount ?? 0;
    const currentPage = currentOffSet / limit + 1;
    const totalPage =
      total % limit === 0 ? total / limit : Math.floor(total / limit) + 1;
    return { currentPage, totalPage };
  }, [currentOffSet, data?.gameList?.totalCount, variables]);
  return (
    <GameListContext.Provider
      value={{
        currentPage,
        data: data,
        error,
        loading,
        platformFilter,
        refetch,
        setFilter,
        setPage,
        totalPage,
        variables,
      }}
    >
      {children}
      <Backdrop
        open={loading}
        sx={{
          color: '#fff',
          zIndex: (theme: typeof appTheme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </GameListContext.Provider>
  );
}

export function useGameList() {
  return useContext(GameListContext);
}

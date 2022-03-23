import { gql, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import ApolloClientProvider from './ApolloClient.context';

const ADD_GAME_TO_LIST = gql`
  mutation addGameToLibrary($data: AddGameToLibraryArgs!) {
    addGameToLibrary(data: $data) {
      id
    }
  }
`;
function CreateGameForm() {
  const [createGameMutation, { called, data, loading }] =
    useMutation(ADD_GAME_TO_LIST);
  const createGame = useCallback(async () => {
    await createGameMutation({
      variables: {
        data: {
          boxArtImageUrl:
            'https://gonintendo.com/uploads/file_upload/upload/78551/medium_futari-deefbc81nyanko-daisensou-box-art.png',
          genre: 'FIGHTING',
          name: 'GOD OF WAR',
          numberOfPlayers: 4,
          platform: 'PS4',
          publisher: 'SONY INTERACTIVE ENTERTAINMENT',
          releaseDate: '2022-03-22',
          userId: '1ec57d7a-67be-42d0-8a97-07e743e6efbc',
        },
      },
    });
  }, [createGameMutation]);
  if (loading) return <div>Loading....</div>;
  if (called)
    return <div data-testid={'game-id'}>{data.addGameToLibrary.id}</div>;
  return (
    <button data-testid={'add-new-game'} onClick={createGame}>
      Click to add record
    </button>
  );
}

function App() {
  return (
    <ApolloClientProvider>
      <CreateGameForm />
    </ApolloClientProvider>
  );
}

export default App;

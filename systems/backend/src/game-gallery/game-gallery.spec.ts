import { describe, expect, it } from '@jest/globals';
import {
  ApolloDriver,
  ApolloDriverConfig,
  getApolloServer,
} from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { randomUUID } from 'crypto';
import gql from 'graphql-tag';

import { createRequestAgent } from '../test-helpers/create-request-agent';
import { expectResponseCode } from '../test-helpers/expect-response-code';
import { withNestServerContext } from '../test-helpers/nest-app-context';
import { GameGalleryModule } from './game-gallery.module';

const appContext = withNestServerContext({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
      sortSchema: true,
    }),
    GameGalleryModule,
  ],
});

describe('Game gallery Resolver', () => {
  it('mutation addGameToLibrary', async () => {
    const app = appContext.app;
    const server = getApolloServer(app);
    const ADD_GAME_TO_LIST = gql`
      mutation addGameToLibrary($data: AddGameToLibraryArgs!) {
        addGameToLibrary(data: $data) {
          id
        }
      }
    `;
    const resp = await server.executeOperation({
      query: ADD_GAME_TO_LIST,
      variables: {
        data: {
          boxArtImageUrl: 'https://www.google.com',
          genre: 'FIGHTING',
          name: 'GOD OF WAR',
          numberOfPlayers: 4,
          platform: 'PS4',
          publisher: 'SONY INTERACTIVE ENTERTAINMENT',
          releaseDate: '2022-03-22',
        },
      },
    });
    expect(resp.errors).toBeUndefined();
  });
  it('query gameList', async () => {
    const app = appContext.app;

    const server = getApolloServer(app);
    const userId = randomUUID();
    await createRequestAgent(app.getHttpServer())
      .post('/test/seeder/game/')
      .send({
        items: Array.from({ length: 2 }).map(() => ({
          boxArtImageUrl: 'https://www.google.com',
          genre: 'FIGHTING',
          name: 'GOD OF WAR',
          numberOfPlayers: 4,
          platform: 'PS4',
          publisher: 'SONY INTERACTIVE ENTERTAINMENT',
          releaseDate: '2022-03-22',
          userId: userId,
        })),
      })
      .expect(expectResponseCode({ expectedStatusCode: 201 }));
    const GET_GAME_LIST = gql`
      query queryGameList($userId: ID) {
        gameList(userId: $userId) {
          id
        }
      }
    `;
    const resp = await server.executeOperation({
      query: GET_GAME_LIST,
      variables: {
        userId: userId,
      },
    });
    expect(resp.errors).toBeUndefined();
    expect(resp?.data?.['gameList']).toHaveLength(2);
  });

  it('query game', async () => {
    const app = appContext.app;

    const server = getApolloServer(app);
    const userId = randomUUID();
    const {
      body: { data: game },
    } = await createRequestAgent(app.getHttpServer())
      .post('/test/seeder/game/')
      .send({
        boxArtImageUrl: 'https://www.google.com',
        genre: 'FIGHTING',
        name: 'GOD OF WAR',
        numberOfPlayers: 4,
        platform: 'PS4',
        publisher: 'SONY INTERACTIVE ENTERTAINMENT',
        releaseDate: '2022-03-22',
        userId: userId,
      })
      .expect(expectResponseCode({ expectedStatusCode: 201 }));
    const GET_GAME = gql`
      query queryGame {
        game(id:"${game.id}") {
          id
        }
      }
    `;
    const resp = await server.executeOperation({
      query: GET_GAME,
    });
    expect(resp.errors).toBeUndefined();
    expect(resp?.data?.['game'].id).toStrictEqual(game.id);
  });
});

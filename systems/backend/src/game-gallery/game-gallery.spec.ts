import { describe, expect, it } from '@jest/globals';
import { getApolloServer } from '@nestjs/apollo';
import { randomUUID } from 'crypto';
import gql from 'graphql-tag';

import { createRequestAgent } from '../test-helpers/create-request-agent';
import { expectResponseCode } from '../test-helpers/expect-response-code';
import { withNestServerContext } from '../test-helpers/nest-app-context';

const appContext = withNestServerContext({
  imports: [],
});

describe('Game gallery Resolver', () => {
  it('upload game box art', async () => {
    const app = appContext.app;
    const server = getApolloServer(app);
    const PREPARE_UPLOAD_GAME_BOX_ART = gql`
      mutation prepareUploadGameBoxArt($fileName: String!) {
        prepareUploadGameBoxArt(fileName: $fileName) {
          id
          resultPublicUrl
          uploadUrl
        }
      }
    `;
    const resp = await server.executeOperation({
      query: PREPARE_UPLOAD_GAME_BOX_ART,
      variables: {
        fileName: 'test.png',
      },
    });
    expect(resp.errors).toBeUndefined();
    const { resultPublicUrl, uploadUrl } = {
      resultPublicUrl: new URL(
        resp.data?.['prepareUploadGameBoxArt']?.resultPublicUrl,
      ),
      uploadUrl: new URL(resp.data?.['prepareUploadGameBoxArt']?.uploadUrl),
    };

    expect(`${resultPublicUrl.protocol}//${resultPublicUrl.host}`).toEqual(
      'http://localhost:4566',
    );
    expect(`${uploadUrl.protocol}//${resultPublicUrl.host}`).toEqual(
      'http://localhost:4566',
    );
  });
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
          userId: randomUUID(),
        },
      },
    });
    expect(resp.errors).toBeUndefined();
  });

  it('should 200 status with error code when missing param on addGameToLibrary mutation', async () => {
    const app = appContext.app;
    const ADD_GAME_TO_LIST = `
      mutation addGameToLibrary($data: AddGameToLibraryArgs!) {
        addGameToLibrary(data: $data) {
          id
        }
      }
    `;
    const { body } = await createRequestAgent(app.getHttpServer())
      .post('/graphql')
      .send({
        query: ADD_GAME_TO_LIST,
        variables: {
          data: {
            boxArtImageUrl: 'https://www.google.com',
            genre: 'FIGHTING',
            name: 'GOD OF WAR',
            numberOfPlayers: 4,
            platform: 'PS4',
            publisher: 'SONY INTERACTIVE ENTERTAINMENT',
            releaseDate: null,
            userId: randomUUID(),
          },
        },
      })
      .expect(expectResponseCode({ expectedStatusCode: 200 }));

    expect(body.errors).toBeDefined();
    expect(body.errors).toStrictEqual([
      {
        extensions: expect.objectContaining({
          code: 'BAD_USER_INPUT',
        }),
        locations: [
          {
            column: 33,
            line: 2,
          },
        ],
        message:
          'Variable "$data" got invalid value null at "data.releaseDate"; Expected non-nullable type "Date!" not to be null.',
      },
    ]);
  });

  it('query gameList by platform', async () => {
    const app = appContext.app;

    const server = getApolloServer(app);
    const userId = randomUUID();
    await createRequestAgent(app.getHttpServer())
      .post('/test/seeder/game/')
      .send({
        items: Array.from({ length: 4 }).map(() => ({
          boxArtImageUrl: 'https://www.google.com',
          genre: 'FIGHTING',
          name: 'GOD OF WAR',
          numberOfPlayers: 4,
          platform: 'PS5',
          publisher: 'SONY INTERACTIVE ENTERTAINMENT',
          releaseDate: '2022-03-22',
          userId: userId,
        })),
      })
      .expect(expectResponseCode({ expectedStatusCode: 201 }));
    await createRequestAgent(app.getHttpServer())
      .post('/test/seeder/game/')
      .send({
        items: Array.from({ length: 4 }).map(() => ({
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
      query queryGameList($userId: ID, $platform: String) {
        gameList(userId: $userId, offset: 0, limit: 10, platform: $platform) {
          edges {
            node {
              id
            }
          }
          pageInfo {
            hasNextPage
          }
          totalCount
        }
      }
    `;
    const resp = await server.executeOperation({
      query: GET_GAME_LIST,
      variables: {
        platform: 'PS4',
        userId: userId,
      },
    });
    expect(resp.errors).toBeUndefined();
    const result = resp?.data?.['gameList'];
    expect(result.edges).toHaveLength(4);
    expect(result.pageInfo.hasNextPage).toBeFalsy();
    expect(result.totalCount).toEqual(4);
  });

  it('query gameList', async () => {
    const app = appContext.app;

    const server = getApolloServer(app);
    const userId = randomUUID();
    await createRequestAgent(app.getHttpServer())
      .post('/test/seeder/game/')
      .send({
        items: Array.from({ length: 128 }).map(() => ({
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
        gameList(userId: $userId, offset: 0, limit: 10) {
          edges {
            node {
              id
            }
          }
          pageInfo {
            hasNextPage
          }
          totalCount
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
    const result = resp?.data?.['gameList'];
    expect(result.edges).toHaveLength(10);
    expect(result.pageInfo.hasNextPage).toBeTruthy();
    expect(result.totalCount).toEqual(128);
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

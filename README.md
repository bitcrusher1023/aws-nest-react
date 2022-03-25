# Code Challenge

![Working screenshot](./docs/working-screenshot.png)

The easy way to review would be following [Development Section](#development)
and read the [Code Review Section](#code-review)

## Code Review

[Endpoint exposed](./systems/backend/schema.graphql)

[Frontend code related to feature](./systems/frontend/src/GameLibraryPage)

[Backend code related to feature](./systems/backend/src/game-gallery)

[Architecture decision record](./docs/adr)
P.S. some of ADR document I circle back after finish coding, so it may out of order.

## Development

```sh
npm install
npx lerna bootstrap
npx lerna exec --stream \
--scope '{backend,frontend}' -- bash scripts/dev-setup.sh
npx lerna exec --stream \
--scope '{backend,frontend}' -- bash scripts/dev-server.sh

Open http://localhost:5333 for dev
```

## Missing features / Improvement points

- CSP have \*

Anti pattern on security because it allowed more than I want

- More test

Current only graphql endpoint
and add game form have been tested

- Consistent form field implementation

When I integrate react-hook-form
i not always use `useController`,
some input I will use `Controller` HOC that make reader feel very confusing

- Share more code between backend and frontend

Especially some
enum value and type definition

- Spinner when call API

When call API on frontend ,
I haven't include loading screen

- More Form error handling ?

Not all input field on add game form
have implement validation rules

- Record not found page

Currently, when no record is found /
page not found it wouldn't have any clue

- Deployment

I have half done setup on [here](./systems/infrastructure) which
can auto set up the infrastructure component I need,
but I not have enough time to continue make use of created component.

# Monorepo template

Template repo with [lerna](https://github.com/lerna/lerna),
[GitHub Action](https://docs.github.com/en/actions),
[NestJS](https://nestjs.com/),
[Redis](https://redis.io/),
[TypeORM](https://typeorm.io/#/)

Setup

```sh
docker compose up -d
npm install
npx lerna bootstrap
npx lerna run --stream start:dev
```

Bump version

```sh
npx lerna version --no-push --conventional-commits
```

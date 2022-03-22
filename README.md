# Monorepo template

Template repo with [lerna](https://github.com/lerna/lerna),
[GitHub Action](https://docs.github.com/en/actions),
[NestJS](https://nestjs.com/),
[Redis](https://redis.io/),
[TypeORM](https://typeorm.io/#/)

Development

```sh
docker compose up -d
npm install
npx lerna bootstrap
npx lerna exec --stream \
--scope '{backend,frontend}' -- bash scripts/setup.sh 
npx lerna exec --stream \
--scope '{backend,frontend}' -- bash scripts/server.sh 
```

Bump version

```sh
npx lerna version --no-push --conventional-commits
```

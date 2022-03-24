# Code Challenge

Template repo with [lerna](https://github.com/lerna/lerna),
[GitHub Action](https://docs.github.com/en/actions),
[NestJS](https://nestjs.com/),
[TypeORM](https://typeorm.io/#/)

Development

```sh
npm install
npx lerna bootstrap
npx lerna exec --stream \
--scope '{backend,frontend}' -- bash scripts/dev-setup.sh
npx lerna exec --stream \
--scope '{backend,frontend}' -- bash scripts/dev-server.sh

Open http://localhost:5333 for dev
```

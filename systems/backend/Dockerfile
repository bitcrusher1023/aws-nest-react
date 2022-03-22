# Builder Stage
FROM node:17.2.0-alpine3.13 AS builder

WORKDIR /usr/src/demo

COPY ./ .

RUN npm ci --ignore-scripts && \
    npm run build

# Run stage
FROM node:17.2.0-alpine3.13

WORKDIR /usr/src/demo

RUN apk add dumb-init

COPY --from=builder /usr/src/demo/ ./

USER node
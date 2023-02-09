# Development
FROM node:18-alpine As development

RUN apk update && apk add openssl

ENV NODE_ENV development

USER node
WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

RUN yarn run migrate


# Build for production

FROM node:18-alpine As build

ENV NODE_ENV build

USER node
WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install --frozen-lockfile --production
RUN yarn cache clean
RUN yarn prisma migrate deploy

COPY --chown=node:node . .
RUN yarn run prisma:generate
RUN yarn build


# Production

FROM node:18-alpine as production

ENV NODE_ENV production

USER node
WORKDIR /usr/src/app

COPY --from=builder --chown=node:node /usr/src/app/package*.json ./
COPY --from=builder --chown=node:node /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /usr/src/app/dist/ ./dist/

CMD [ "node", "dist/main.js" ]
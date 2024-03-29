FROM node:12-alpine AS web
RUN mkdir -p /web
WORKDIR /web
COPY packages/web/package.json /web
RUN npm i
COPY packages/web /web
RUN npm run build

FROM node:12-alpine
RUN mkdir -p /server
WORKDIR /server
COPY packages/server/package.json /server
RUN apk add python alpine-sdk
RUN npm i
COPY packages/server /server
RUN npm run build
RUN npm prune
COPY --from=web /web/dist /server/public
EXPOSE 8080
CMD [ "npm", "start" ]
FROM node:22-alpine AS builder
ENV DEPLOY_TARGET=NODE
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22-alpine
ENV DEPLOY_TARGET=NODE
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV ORIGIN="http://127.0.0.1:3000"
ENV NODE_ENV=production
CMD [ "node", "build" ]


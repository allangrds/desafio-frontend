##############################
# Base stage
##############################
FROM node:22.21.0-alpine AS base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install

##############################
# Build production stage
##############################
FROM base AS build-prod
WORKDIR /app
COPY . .
RUN npm run build

##############################
# Run production stage
##############################
FROM node:22.21.0-alpine AS run-prod
WORKDIR /app
COPY --from=build-prod /app ./
EXPOSE 3000
CMD ["npm", "start"]
# Production Dockerfile for CPS Department Portal
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build client
COPY client/package*.json ./client/
RUN cd client && npm install

COPY . .
RUN cd client && npm run build

# Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist

EXPOSE 5000

CMD ["npm", "start"]

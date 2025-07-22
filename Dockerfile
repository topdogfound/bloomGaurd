# Stage 1: Build
FROM node:20.11-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY . .

RUN npm ci
RUN npm run build

# Stage 2: Production image
FROM node:20.11-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm ci --only=production

# Expose port 3000 (default NestJS port)
EXPOSE 3000

CMD ["node", "dist/main.js"]

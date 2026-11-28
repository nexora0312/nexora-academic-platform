FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ARG FRONTEND_URL=http://localhost:3000
ENV FRONTEND_URL=${FRONTEND_URL}
RUN npm run prisma:generate --workspace backend
RUN npm run build --workspace backend

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
COPY --from=builder /app/backend/.next/standalone ./
COPY --from=builder /app/backend/.next/static ./backend/.next/static
EXPOSE 3001
CMD ["node", "/app/backend/server.js"]

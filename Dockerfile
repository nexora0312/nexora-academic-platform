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
ARG APP_NAME=frontend
ARG NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
ARG FRONTEND_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV FRONTEND_URL=${FRONTEND_URL}
RUN npm run prisma:generate --workspace backend
RUN npm run build --workspace ${APP_NAME}
RUN if [ -d "/app/${APP_NAME}/public" ]; then mkdir -p "/app/${APP_NAME}/.next/standalone/${APP_NAME}/public" && cp -R "/app/${APP_NAME}/public/." "/app/${APP_NAME}/.next/standalone/${APP_NAME}/public/"; fi

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG APP_NAME=frontend
ENV APP_NAME=${APP_NAME}
COPY --from=builder /app/${APP_NAME}/.next/standalone ./
COPY --from=builder /app/${APP_NAME}/.next/static ./${APP_NAME}/.next/static
EXPOSE 3000 3001
CMD ["sh", "-c", "node /app/${APP_NAME}/server.js"]

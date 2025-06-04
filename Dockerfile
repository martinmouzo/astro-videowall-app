FROM node:alpine AS base
WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Copy .npmrc for authentication
 COPY .npmrc .npmrc

# Install production dependencies
FROM base AS prod-deps
RUN npm ci --omit=dev

# Install all dependencies for building
FROM base AS build-deps
RUN npm ci

# Build the application
FROM build-deps AS build
COPY . .
RUN npm run build

# Runtime stage with a non-root user
FROM node:alpine AS runtime
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["node", "./dist/server/entry.mjs"]
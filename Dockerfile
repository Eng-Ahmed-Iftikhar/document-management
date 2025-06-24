# Stage 1: Builder
FROM node:18 AS builder

WORKDIR /app

# Copy necessary files for dependency install
COPY package*.json nx.json tsconfig.base.json ./
RUN npm install -f

# Copy full source
COPY . .

# Build only if PRODUCTION=true
ARG PRODUCTION=false
RUN if [ "$PRODUCTION" = "true" ]; then \
    npm run build; \
    fi

EXPOSE 3000 8080


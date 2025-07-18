# Multi-stage build for minimal image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies (fixed npm command)
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install serve globally for serving static files
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]

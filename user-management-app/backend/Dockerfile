FROM node:18-alpine

# CRITICAL: Install curl for health checks
RUN apk add --no-cache curl

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install
# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Healthcheck with curl
HEALTHCHECK --interval=10s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"]

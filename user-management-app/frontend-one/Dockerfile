# Use a lightweight Node.js base image
FROM node:18-alpine

WORKDIR /app

# Copy package.json first to leverage Docker caching
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose the port the server runs on
EXPOSE 8080

# The command to start the server
CMD ["npm", "start"]
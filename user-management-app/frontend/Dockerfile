# Use a Node.js base image
FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy all the application files
# This includes index.html, server.js, and the public/ and src/ directories
COPY . .

# Expose the port the server is running on
EXPOSE 8080

# Start the Node.js server
CMD ["npm", "start"]
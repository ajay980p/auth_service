# Use an official Node.js runtime as the base image
FROM node:18-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (assuming they are in the root directory)
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine as production

ENV NODE_ENV=production

WORKDIR /app

# Copy package.json and package-lock.json again for production
COPY package*.json ./

# Install only production dependencies
RUN npm ci --ignore-scripts --only=production

# Copy the built app from the builder stage (ensure the path is correct)
COPY --from=builder /app/dist ./

# Expose the application port
EXPOSE 5000

# Run the application
CMD ["node", "api/index.js"]
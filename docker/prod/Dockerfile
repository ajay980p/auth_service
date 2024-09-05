# Use an official Node.js runtime as the base image
FROM node:18-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build




FROM node:18-alpine as production

ENV NODE_ENV=production

WORKDIR /app


COPY package*.json ./


RUN npm ci --ignore-scripts


COPY --from=builder  /app/dist ./

EXPOSE 5000

CMD ["node", "api/index.js"]
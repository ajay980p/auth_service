# Use the official Node.js image as our base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install app dependencies with --ignore-scripts flag
RUN npm ci --ignore-scripts

# If you need to run any specific scripts after installation, do it explicitly
# For example:
# RUN npm rebuild
# RUN npm run prepare

# Copy the rest of our app's source code into the container
COPY . .

# Expose the port the app will run on
EXPOSE 5501

# The command to run our app
CMD ["npm", "run", "dev"]
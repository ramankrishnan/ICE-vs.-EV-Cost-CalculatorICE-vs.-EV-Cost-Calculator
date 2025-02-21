# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install the project dependencies
RUN npm install --production

# Copy the rest of the application source code
COPY . .

# Expose the port your app runs on (assuming port 3000)
EXPOSE 80

# Command to run the application
CMD ["npm", "start"]

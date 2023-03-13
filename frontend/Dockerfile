# Use the official Node.js 18-alpine image as the base image
FROM node:18-alpine

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install --only=prod

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build

# Expose port 3000 (or any other port that your application uses)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]

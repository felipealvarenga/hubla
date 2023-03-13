# Use the official Node.js 18 image as the base image
FROM node:18-alpine

# Install dockerize
RUN apk add --no-cache openssl \
    && wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-alpine-linux-amd64-v0.6.1.tar.gz

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

# Set the DATABASE_HOST environment variable
ENV DATABASE_HOST=host.docker.internal

# Expose port 3333 (or any other port that your application uses)
EXPOSE 3333

# Run migrations and start application
CMD dockerize -wait tcp://db:5432 -timeout 60s npm run typeorm migration:run && npm run start:prod
# CMD ["npm", "run", "start:prod"]

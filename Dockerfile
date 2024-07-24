# Use the official Node.js image as a base
FROM node:20

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./


# Copy the application source code
COPY . .
RUN npm install
# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:dev"]

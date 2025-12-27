# Use official Node.js image as the base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
# Using --legacy-peer-deps because of the React 19 beta/RC versions in the project
# Removing package-lock.json to ensure platform compatibility (Mac -> Linux)
RUN rm -f package-lock.json && npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage using Nginx to serve the static files
FROM nginx:alpine

# Copy the build output from the builder stage to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed (optional, using default for now)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Configure Nginx to listen on port 8080
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# Use official Node.js image (Debian based for better compatibility)
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json only (ignoring lockfile to avoid platform issues)
COPY package.json ./

# Ensure dev dependencies (like Vite) are installed
ENV NODE_ENV=development

# Install dependencies
RUN npm install

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

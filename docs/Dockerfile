# Build stage
FROM node:20-alpine as builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 8080

# Set production environment
ENV NODE_ENV=production

# Start application
CMD ["npm", "start"]

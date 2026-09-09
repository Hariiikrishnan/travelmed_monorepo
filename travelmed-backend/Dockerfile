FROM node:20-alpine

WORKDIR /app

# Install native dependencies for bcrypt or prisma if needed
RUN apk add --no-cache openssl python3 make g++

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
# Generate Prisma Client
RUN npx prisma generate

COPY . .

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Use the standard node command to start the production server
CMD ["node", "src/server.js"]

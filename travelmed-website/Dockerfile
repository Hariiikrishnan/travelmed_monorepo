FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy full application
COPY . .

ARG NEXT_PUBLIC_API_URL=https://api.travelmed.org
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ENV NODE_ENV=production
RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/package*.json ./

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENV PORT=3000
CMD ["npm", "start"]

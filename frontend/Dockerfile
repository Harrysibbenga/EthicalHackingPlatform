# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the app
COPY . .

# Set Enviroment variables
ARG NUXT_PUBLIC_FIREBASE_API_KEY
ARG NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NUXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NUXT_PUBLIC_FIREBASE_APP_ID
ARG NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID

ENV NUXT_PUBLIC_FIREBASE_API_KEY=${NUXT_PUBLIC_FIREBASE_API_KEY}
ENV NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
ENV NUXT_PUBLIC_FIREBASE_PROJECT_ID=${NUXT_PUBLIC_FIREBASE_PROJECT_ID}
ENV NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
ENV NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
ENV NUXT_PUBLIC_FIREBASE_APP_ID=${NUXT_PUBLIC_FIREBASE_APP_ID}
ENV NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID}

# Expose frontend port
EXPOSE 3000

# Start Nuxt frontend
CMD ["npm", "run", "dev"]
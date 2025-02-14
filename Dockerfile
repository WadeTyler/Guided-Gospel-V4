FROM node:18-alpine

# Copy files and dependencies
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

EXPOSE 8000

# Build and Start
CMD npm run start
# Stage 1: Build React application
FROM node:23.0.0 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the React application
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Remove the default NGINX config file
RUN rm /etc/nginx/conf.d/default.conf
# Copy custom NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]

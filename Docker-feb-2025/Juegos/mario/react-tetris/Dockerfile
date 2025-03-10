FROM node:18.13.0-alpine3.17 AS builder
WORKDIR /app
COPY src ./
RUN npm install
RUN NODE_ENABLED=0 npm run build 


FROM nginx:stable-alpine3.17  
RUN apk --no-cache add ca-certificates
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist ./

FROM node:18.13.0-alpine3.17
WORKDIR /app
COPY src ./
RUN npm install
EXPOSE 3000
#RUN npm run start
CMD [ "npm" ,"run" , "start" ]
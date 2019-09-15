FROM node

# Create app directory
WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm ci

COPY . ./

EXPOSE 8080

CMD [ "npm", "start" ]

FROM node:22.14.0-slim

WORKDIR /usr/src/api

COPY ./build ./

RUN npm install
RUN npm run db.generate

EXPOSE 3000

CMD ["npm", "start"]


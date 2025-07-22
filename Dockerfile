FROM node:18-alpine3.19

RUN npm install --global serve

WORKDIR /home

EXPOSE 3001

CMD ["serve", "-l", "3001"] 
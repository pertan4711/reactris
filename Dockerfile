FROM node:18-alpine
WORKDIR /src
COPY . .
RUN yarn install
CMD ["yarn", "start"]
EXPOSE 3000

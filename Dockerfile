FROM node:18-alpine
WORKDIR /src
COPY . .
RUN yarn install
CMD ["node", "index.tsx"]
EXPOSE 3000

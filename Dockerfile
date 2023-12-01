FROM node:18.12.1

WORKDIR /app/web-tracking
ENV TZ=Asia/Bangkok
COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD ["node", "index.js"]
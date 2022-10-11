FROM node:lts

WORKDIR /app

COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]

RUN npm install && npm install typescript -g

COPY . .

RUN tsc

CMD ["node", "./dist/index.js"]
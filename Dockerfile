FROM --platform=linux/amd64 node:21.6.2-alpine3.19

RUN apk add --no-cache curl

RUN adduser --disabled-password --home /home/puppet_pdf puppet_pdf

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY src ./src

EXPOSE 3000

HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1

USER puppet_pdf

RUN npx puppeteer browsers install chrome

CMD ["node", "./src/main.js"]

FROM node:21-alpine

ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN apk upgrade && \
    apk add --update --no-cache \
    curl \
    gcompat \
    chromium \
    udev \
    ttf-freefont \
    && adduser --disabled-password --home /home/puppet_pdf puppet_pdf

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY src ./src

USER puppet_pdf

# RUN npx puppeteer browsers install chrome

HEALTHCHECK CMD curl --fail http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "./src/main.js"]

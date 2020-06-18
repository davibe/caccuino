# FROM debian:latest
# RUN apt-get update
# RUN apt-get install -y --no-install-recommends \
#    chromium nodejs npm git-core \
#    && \
#    npm i npm@latest -g \
#    && rm -rf /var/lib/apt/lists/*

# This results in ~200Mb smaller image size
# ref. https://github.com/buildkite/docker-puppeteer/blob/master/Dockerfile
FROM node:12.18.0-buster-slim@sha256:97da8d5023fd0380ed923d13f83041dd60b0744e4d140f6276c93096e85d0899
RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y --no-install-recommends google-chrome-stable git-core \
     && rm -rf /var/lib/apt/lists/*

ADD . /caccuino
WORKDIR /caccuino
RUN npm link && npm run prepublish && rm -rf .cache && rm -rf node_modules && npm install --only=prod

RUN mkdir /home
WORKDIR /home
ENV PORT 3000
CMD caccuino

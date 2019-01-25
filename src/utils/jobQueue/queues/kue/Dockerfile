FROM mhart/alpine-node:10

ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

RUN npm install kue
RUN npm install config
RUN npm install winston
RUN npm install morgan
RUN npm install app-root-path

# Copy certain folders and files
COPY ./config /config
COPY ./src /src

EXPOSE 3050
CMD ["node", "./src/utils/jobQueue/queues/kue/dashboard.js"]

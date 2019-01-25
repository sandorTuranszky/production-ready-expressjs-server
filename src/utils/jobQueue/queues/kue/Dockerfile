FROM mhart/alpine-node:10

ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

RUN npm install kue

# Bundle app source
COPY . .

CMD ["npm", "./src/utils/jobQueue/queues/kue/dashboard.js"]

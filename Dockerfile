FROM mhart/alpine-node:10

ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install -g prisma
RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 7000
CMD ["npm", "run", "start"]

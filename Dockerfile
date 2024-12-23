FROM node:lts-alpine
WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent

COPY . .

EXPOSE 5173

RUN chown -R node /usr/src/app
USER node
CMD ["npm", "run", "dev"]

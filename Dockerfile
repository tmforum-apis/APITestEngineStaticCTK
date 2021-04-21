FROM node:lts
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# To handle 'not get uid/gid'
RUN npm config set unsafe-perm true
ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN
RUN npm update -g
RUN npm install pm2 -g
RUN npm --production=false install
COPY . .
RUN npx patch-package
RUN npm run test
COPY ./dockerscript.sh /
RUN chmod 755 /dockerscript.sh 
CMD [ "pm2-runtime", "./src/index.js", "--", "-s"]

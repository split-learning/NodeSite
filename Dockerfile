# base image
FROM node:9.6.1

# set working directory
RUN mkdir /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
RUN npm install --silent

EXPOSE 3000
EXPOSE 80

# start app
CMD ["PORT=80;","npm", "start"]
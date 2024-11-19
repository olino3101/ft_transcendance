FROM debian:buster

#install node js
RUN curl -sL https://deb.nodesource.com/setup_18.x | -E bash - \
    && apt-get install -y nodejs

#init three js
RUN npm init -y \
    && npm install three \
    && npm install --save-dev vite

WORKDIR /threejs

COPY ./js/main.js /threejs
COPY ./js/jsFiles /threejs

// using vite
EXPOSE 3000
CMD ["npm", "run", "dev"]

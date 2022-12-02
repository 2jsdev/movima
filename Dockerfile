FROM node:alpine

WORKDIR /usr/src/movima

RUN apt-get update && apt-get install -y netcat

ENV path /usr/src/movima/node_modules/.bin:$PATH

COPY . /usr/src/movima

RUN npm i -g dotenv-cli pgtools
RUN npm i

RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
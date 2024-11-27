FROM node:18.16.0
COPY ./dist/spa /code
WORKDIR /code
RUN npm install -g @quasar/cli
EXPOSE 9002
CMD ["quasar", "serve", "--history", "-p 9002"]

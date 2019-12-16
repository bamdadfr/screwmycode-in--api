FROM node:slim
WORKDIR /app
COPY package*.json ./
RUN apt update
RUN apt upgrade -y
RUN apt intall python -y
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
RUN yarn install
RUN chmod a+rx /usr/local/bin/youtube-dl
RUN yarn add global nodemon
COPY . .
EXPOSE 5000 
CMD ["yarn", "start"]

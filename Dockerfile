FROM node:slim
WORKDIR /app
COPY package*.json ./
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y locales python
RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
RUN yarn install
RUN chmod a+rx /usr/local/bin/youtube-dl
RUN yarn add global nodemon
COPY . .
EXPOSE 5000 
CMD ["yarn", "start"]

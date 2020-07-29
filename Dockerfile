FROM oraclelinux:7-slim

RUN  yum -y install oracle-release-el7 oracle-nodejs-release-el7 && \
     yum-config-manager --disable ol7_developer_EPEL && \
     yum -y install oracle-instantclient19.3-basiclite nodejs && \
     yum -y install vim && \
     rm -rf /var/cache/yum

#   for tunneling   
# RUN yum -y install openssh-server





WORKDIR /dcportal
ADD package.json /dcportal/
ADD server.js /dcportal/


RUN npm install

COPY . .



EXPOSE 5004


CMD [ "npm", "start" ]


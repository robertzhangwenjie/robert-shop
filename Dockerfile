FROM nginx:1.18-alpine

LABEL maintainer="Robert <robertzhangwenjie@gmail.com>"

COPY dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "/bin/sh","-c","nginx -g 'daemon off;'"]


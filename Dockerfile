
FROM nginx:1.18-alpine

LABEL maintainer="Robert <robertzhangwenjie@gmail.com>"
COPY dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/robert-shop.conf
EXPOSE 80

# 根据运行环境对模板进行渲染
CMD [ "/bin/sh","-c","nginx -g 'daemon off;'"]


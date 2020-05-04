FROM node:10.16 as node

LABEL maintainer="Robert <robertzhangwenjie@gmail.com>"
COPY ./ /robert-shop
WORKDIR /robert-shop
RUN npm install && npm run build

FROM nginx:1.18-alpine

LABEL maintainer="Robert <robertzhangwenjie@gmail.com>"
COPY --from=node  /robert-shop/dist/ /usr/share/nginx/html
COPY --from=node /robert-shop/nginx.conf /etc/nginx/conf.d/robert-shop.conf
EXPOSE 80

# 根据运行环境对模板进行渲染
CMD [ "/bin/sh","-c","nginx -g 'daemon off;'"]


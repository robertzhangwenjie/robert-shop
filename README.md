# robert-shop

### 项目介绍
[![Build Status](http://drone.robertzwj.com/api/badges/robertzhangwenjie/robert-shop/status.svg)](http://drone.robertzwj.com/robertzhangwenjie/robert-shop)
robert-shop是个人开发的一个小型后台管理系统，采用vue + elementUI开发，后台项目为robert-shop-api，需要同时部署两个项目，并提供了docker和k8s一键部署。

### 本地开发

```
npm install
npm run serve
```
### 生产部署
```
npm run build
```
### Docker部署
```
sh docker_build.sh
```
- docker_build.sh

  ```shell
  # 安装依赖并构建
   npm install
   npm run build
  
  # 获取当前commitId
  commitId=`git rev-parse --short HEAD`
  
  # 定义应用名称，会将其渲染到k8s模板中
  appName="robert-shop"
  
  # 获取镜像名称，镜像名称根据自身情况进行修改
  imageName="zhangwenjie/${appName}:${commitId}"
  
  # 构建镜像
  docker build -t ${imageName} .
  
  # 推送镜像到仓库,用户名和密码需要自己设置
  docker login -u ${REGISTRY_USERNAME} -p ${REGISTRY_PASSWORD}
  docker push ${imageName}
  
  # 将应用名称和配置名称写入到k8s配置文件，以便k8s部署时可以直接获取
  echo "应用名称和版本名称:"
  printf "appName=${appName}\nimageName=${imageName}\n" | tee k8s/k8s.conf
  ```

  

- Dockerfile

  ```dockerfile
  FROM nginx:1.18-alpine
  
  LABEL maintainer="Robert <robertzhangwenjie@gmail.com>"
  
  COPY dist/ /usr/share/nginx/html
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  
  EXPOSE 80
  
  CMD [ "/bin/sh","-c","nginx -g 'daemon off;'"]
  ```

  

### k8s部署

```
sh k8s_build.sh
```

```shell
# 调用dockerfile构建脚本
source ./docker_build.sh

# 获取k8s.conf文件字符串
config=`cat k8s/k8s.conf`
echo -e "\n配置文件:\n${config}"

# 替换k8s模板中的变量并生成k8s配置文件
tpls=`ls k8s/tpl/*.tpl`
echo -e "\n替换的模板文件:\n${tpls}"

# 将模板文件字符串化后拼装成一条cat 文件的命令，然后使用bash去执行，自动替换其中的变量
# 也可以使用envsubst，但是需要使用export把所有变量配置为环境变量
for fullTplName in ${tpls};do
  tplString=`cat ${fullTplName}`
  tplName=${fullTplName##*/}
  mainfestName=${tplName%%.*}
  printf "$config\ncat << EOF\n${tplString}\nEOF" | bash > k8s/${mainfestName}.yaml
  # 打印生成的k8s配置文件
  echo "${mainfestName}.yaml"
done

# 启动服务
kubectl apply -f ./k8s
```



- 默认基于deployment、ingress-nginx、service部署，部署前请先部署ingress-nginx-controller

- k8s部署时会将应用名称和镜像名称设置为环境变量，然后对k8s的模板进行渲染后自动生成yml文件，并自动部署，模板文件如下，可以根据自身情况进行修改

  - ingress.tpl

    ```yaml
    kapiVersion: extensions/v1beta1
    kind: Ingress
    metadata:
      name: ingress-${appName}
      namespace: default
    spec:
      rules:
      - host: robert.shop.yunxiao.com
        http:
          paths:
          - path:
            backend:
              serviceName: ${appName}
              servicePort: 80
    ```

  - deployment.tpl

    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      labels:
        app: ${appName}
      name: ${appName}
      namespace: default
    spec:
      ports:
      - name: web
        port: 80
        targetPort: 80
      selector:
        app: ${appName}
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: ${appName}
      namespace: default
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: ${appName}
      template:
        metadata:
          labels:
            app: ${appName}
        spec:
          containers:
          - name: ${appName}
            image: ${imageName}
            ports:
            - name: http
              containerPort: 80
    
    ```

    

### 配置文件

- nginx.conf

  ```nginx
  server {
    listen 80;
    server_name robert.shop.yunxiao.com;
  
    access_log /var/log/nginx/robert_shop_access.log main;
    error_log /var/log/nginx/robert_shop_error.log error;
  
    # 路径需要为绝对路径，相对路径是/etc/nginx目录
    location / {
      root /usr/share/nginx/html;
      index index.html index.htm;
    }
  
  
    location /api/private/v1 {
      proxy_set_header Host $host;
      proxy_redirect off;
      proxy_pass http://robert.shop.yunxiao.com:8080;
    }
  
    location ~ .*\.(js|css|ico|png|jpg|eot|svg|ttf|woff|html) {
      root /usr/share/nginx/html;
    }
  
    error_page 500 502 503 504 /50x.html;
  
    location = /50x.html {
      root /usr/share/nginx/html;
    }
  }
  ```

- 
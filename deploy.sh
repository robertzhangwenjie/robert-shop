###
 # @Author: robert zhang
 # @Date: 2020-06-28 20:15:02
 # @LastEditTime: 2020-06-28 20:37:04
 # @LastEditors: robert zhang
 # @Description: 部署脚本
 # @
### 

#!/bin/bash

echo "Starting deploy."

# 如果服务正在运行先停止
docker ps -a | grep ${projectName} > /dev/null &&  \
echo "Stopping service" && \
sudo docker stop ${projectName} && \
echo "Removing service" && \
sudo docker rm ${projectName}

# 拉取新镜像并运行
sudo docker rmi ${imageName}:${version}
sudo docker run -itd --name=${projectName} ${imageName}:${version}
echo "部署成功"


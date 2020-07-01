###
 # @Author: robert zhang
 # @Date: 2020-06-28 20:15:02
 # @LastEditTime: 2020-07-01 20:21:27
 # @LastEditors: robert zhang
 # @Description: 部署脚本
 # @
### 

#!/bin/bash

set -x

echo "Starting deploy."

# 如果服务正在运行先停止

# 查看容器是否在运行

sudo docker ps -a | grep ${projectName} > /dev/null

if [ $? -eq 0 ];then
  echo "Stopping service."
  sudo docker stop ${projectName}

  echo "Removing service."
  sudo docker rm ${projectName}
fi


# 判断镜像是否存在
sudo docker image ls | grep ${imageName}:${version}

# 如果镜像存在则先删除
if [ $? -eq 0 ];then
  echo "Removing service"
  sudo docker rmi ${imageName}:${version}
fi

# 拉取并运行
sudo docker run -itd --name=${projectName} ${imageName}:${version}

# 运行容器成功后，判断
if [ $? -eq 0 ];then 
  result=`sudo docker inspect ${projectName} --format='{{.State.Running}}'`
  [ $result == true ] && echo "部署成功" && exit 0  
fi

echo '部署失败'  && sudo docker logs  ${projectName} && exit 1

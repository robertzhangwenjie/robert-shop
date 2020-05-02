###
 # @Author: robert zhang
 # @Date: 2020-05-02 18:03:31
 # @LastEditTime: 2020-05-02 20:34:18
 # @LastEditors: robert zhang
 # @Description: 构建镜像
 # @
 ###

# 安装依赖并构建
#  npm install
#  npm run build

# 获取当前commitId
commitId=`git rev-parse --short HEAD`

# 获取当前应用名称
appName="robert-shop"

# 获取镜像名称
imageName="${appName}:${commitId}"

# 构建镜像
# docker build -t ${imgaeName} .

# 推送镜像到仓库
# docker login -u ${REGISTRY_USERNAME} -p ${REGISTRY_PASSWORD}
# docker push ${imageName}

# 将应用名称和配置名称写入到配置文件，以便k8s部署时可以直接获取
echo "应用名称和版本名称:"
printf "appName=${appName}\ncommitId=${commitId}\n" | tee k8s/k8s.conf


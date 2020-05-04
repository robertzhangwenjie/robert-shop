###
 # @Author: robert zhang
 # @Date: 2020-05-02 18:26:39
 # @LastEditTime: 2020-05-04 15:20:32
 # @LastEditors: robert zhang
 # @Description: k8s构建文件
 # @
 ###


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



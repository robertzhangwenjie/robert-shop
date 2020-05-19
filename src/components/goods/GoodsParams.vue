<!--
 * @Author: robert zhang
 * @Date: 2020-05-18 20:48:48
 * @LastEditTime: 2020-05-19 09:45:54
 * @LastEditors: robert zhang
 * @Description: 商品参数页面
 * @
--> 

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 头部警告区 -->
      <el-alert type="warning" title="注意: 只允许为第三级设置相关参数" show-icon :closable="false"></el-alert>

      <!-- 选中商品分类区 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选中商品分类:&nbsp;</span>
          <el-cascader
            :options="cateList"
            v-model="selectedKeys"
            placeholder="请选择"
            clearable
            :props="props"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisable">添加参数</el-button>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisable">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'GoodsParams',
  data() {
    return {
      // 商品分类
      cateList: [],
      // 级联选择器显示配置
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 级联选择框双向绑定数组
      selectedKeys: [],
      // 当前激活的tab页名称
      activeName: 'many'
    }
  },
  computed: {
    // 按钮是否禁用
    isBtnDisable() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    selectedKeyId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类
    getCateList() {
      this.$http
        .get('categories')
        .then(res => {
          if (res.data.meta.status === 200) {
            this.cateList = res.data.data
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求超时')
        })
    },
    // 处理选项变更时
    handleChange(value) {
      if (value.length !== 3) {
        this.selectedKeys = []
        return null
      }
      this.getCateAttrs()
    },
    // 处理tab切换事件
    handleTabClick() {
      this.getCateAttrs()
    },
    // 获取参数列表
    getCateAttrs() {
      // 只有选中了商品后才能发起请求
      if (this.selectedKeyId) {
        this.$http.get(`categories/${this.selectedKeyId}/attributes`, {
          params: { sel: this.activeName }
        }).then(
          res => {
            if (res.data.meta.status === 200) {
              console.log(res.data.data)
            } else {
              this.$message.error(res.data.meta.msg)
            }
          }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cat_opt {
  margin: 20px 0;
}
</style>

<!--
 * @Author: robert zhang
 * @Date: 2020-04-22 22:48:22
 * @LastEditTime: 2020-04-23 13:41:48
 * @LastEditors: robert zhang
 * @Description: 用户列表页
 * @
 -->
 
<template>
  <div class="user-container">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 内容显示区 -->
    <div class="user-content">
      <el-card shadow="always">
        <div slot="header" class="clearfix">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input placeholder="请输入搜索内容">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary">添加用户</el-button>
            </el-col>
          </el-row>
        </div>
        <!-- 主体内容区 -->
        <el-table :data="queryData.users" stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <!-- 自定义状态显示模板列 -->
            <template slot-scope="tableData">
              <el-switch v-model="tableData.row.mg_state" active-color="#13ce66"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="tableData">
              <!-- 修改按钮 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="修改"
                placement="top"
                :enterable="false"
              >
                <el-button type="primary" icon="el-icon-edit" size="small"></el-button>
              </el-tooltip>
              <!-- 删除按钮 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="delUser(tableData.row.id)"
                ></el-button>
              </el-tooltip>

              <!-- 设置按钮 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="设置"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="small"
                  @click="delUser(tableData.row.id)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页导航 -->
        <el-pagination
          @size-change="handerSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="pageSizes"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryData.total"
        ></el-pagination>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSizes: [10, 15, 20],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      queryData: {}
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.$http
        .get('users', {
          params: this.queryInfo
        })
        .then(({ data: res }) => {
          if (res.meta.status === 200) {
            this.queryData = res.data
          } else {
            this.$message.error(res.meta.msg)
          }
        })
    },
    handerSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.pagenum = newCurrentPage
      this.getUserList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

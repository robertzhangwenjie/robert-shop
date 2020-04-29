<!--
 * @Author: robert zhang
 * @Date: 2020-04-25 22:43:53
 * @LastEditTime: 2020-04-26 10:05:14
 * @LastEditors: robert zhang
 * @Description: 权限管理页面
 * @
 -->

 <template>
  <div class="right-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <el-card class="box-card">
      <el-table :data="rightsList" style="width: 100%" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag :type="RightsLevel[scope.row.level].type">{{RightsLevel[scope.row.level].name}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
 
<script>
import { RightsLevel } from '@/commons/enum'

export default {
  name: 'Rights',
  data() {
    return {
      RightsLevel,
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    getRightsList() {
      this.$http
        .get('rights/list')
        .then(res => {
          if (res.data.meta.status === 200) {
            this.rights = res.data.data
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

 <style>
</style>

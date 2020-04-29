<!--
 * @Author: robert zhang
 * @Date: 2020-04-22 22:48:22
 * @LastEditTime: 2020-04-29 14:00:43
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
              <el-input
                placeholder="请输入搜索内容"
                v-model="queryInfo.query"
                @keyup.enter.native="getUserList"
                @clear="getUserList"
                clearable
              >
                <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
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
              <el-switch
                v-model="tableData.row.mg_state"
                @change="updateUserState(tableData.row)"
                active-color="#13ce66"
              ></el-switch>
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
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="showEditUserForm(tableData.row)"
                ></el-button>
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
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="small"
                  @click="allocateRole(tableData.row)"
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
      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        class="adduser-box"
        @close="resetFields('userForm')"
      >
        <!-- 内容表单 -->
        <el-form
          :model="userForm"
          :rules="userFormRules"
          ref="userForm"
          label-width="100px"
          @keyup.enter.native="addUser"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" type="email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="userForm.mobile" type="number"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%"
        class="adduser-box"
        @close="resetFields('editUserForm')"
      >
        <!-- 内容表单 -->
        <el-form
          :model="editUserForm"
          :rules="userFormRules"
          ref="editUserForm"
          label-width="100px"
          @keyup.enter.native="editUser"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUserForm.username" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email" type="email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUser">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="角色分配"
      @close="closeRoleAllocateDialog"
      :visible.sync="allocateRoleDialogVisible"
      width="50%"
    >
      <div class="role-info">
        <p>当前用户: {{userInfo.username}}</p>
        <p>当前角色: {{userInfo.role_name}}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer">
        <el-button @click="allocateRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import validator from '@/commons/validate'

export default {
  name: 'Users',
  data() {
    return {
      pageSizes: [10, 15, 20],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      queryData: {},
      addDialogVisible: false,
      editDialogVisible: false,
      allocateRoleDialogVisible: false,
      roleList: [], // 角色列表
      userInfo: {},
      selectedId: '',
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      userFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 18, message: '用户名长度为5-18位', trigger: 'blur' },
          { validator: this.validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 18, message: '用户名长度在5-18位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: this.validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    showEditUserForm(user) {
      this.editUserForm.username = user.username
      this.editUserForm.mobile = user.mobile
      this.editUserForm.email = user.email
      this.editUserForm.id = user.id
      this.editDialogVisible = true
    },
    getRoleList() {
      this.$http
        .get('roles')
        .then(res => {
          if (res.data.meta.status === 200) {
            this.roleList = res.data.data
          } else {
            this.$message.error('获取角色列表失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('网络异常')
        })
    },
    // 关闭角色分配弹出框时时初始化
    closeRoleAllocateDialog() {
      this.roleList = []
      this.getUserList()
    },
    // 分配角色
    allocateRole(user) {
      this.getRoleList()
      this.userInfo = user
      console.log(this.userInfo)
      this.allocateRoleDialogVisible = true
    },
    updateRole() {
      if (!this.selectedId) {
        this.$message.warning('请选择变更的角色！')
        return
      }
      this.$http
        .put(`users/${this.userInfo.id}/role`, { rid: this.selectedId })
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message.success('更改角色成功')
          } else {
            this.$message.error('更改角色失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('网络超时')
        })
      this.allocateRoleDialogVisible = false
    },
    // 根据id删除用户
    delUser(userId) {
      this.$confirm('此操作将永久删除该用户，是否继续删除？', '提示', {
        type: 'warning'
      })
        .then(action => {
          console.log(action)
          this.$http.delete('users/' + userId).then(res => {
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
            } else {
              this.$message.error(res.data.meta.msg)
            }
            this.getUserList()
          })
        })
        .catch(action => {
          console.log(action)
        })
    },
    updateUser() {
      this.$refs.editUserForm.validate((value, err) => {
        if (value) {
          this.editDialogVisible = false
          this.$http
            .put('users/' + this.editUserForm.id, {
              email: this.editUserForm.email,
              mobile: this.editUserForm.mobile
            })
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg)
              } else {
                this.$message.error(res.data.meta.msg)
              }
              this.getUserList()
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    resetFields(formName) {
      // 重置弹出框数据
      this.$refs[formName].resetFields()
    },
    addUser() {
      // 隐藏弹出框
      this.$refs.userForm.validate((value, err) => {
        if (value) {
          this.addDialogVisible = false
          this.$http
            .post('users', this.userForm)
            .then(res => {
              if (res.data.meta.status === 201) {
                this.$message.success(res.data.meta.msg)
                this.getUserList()
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    validateUsername(rule, value, callback) {
      if (validator.isValidUsername(value)) {
        callback()
      } else {
        callback(new Error('用户名只能为数字和字母'))
      }
    },
    validateMobile(rule, value, callback) {
      if (validator.isValidPhone(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号'))
      }
    },
    updateUserState(user) {
      this.$http
        .put('users/' + user.id + '/state/' + (user.mg_state ? '1' : '0'))
        .then(({ data: res }) => {
          if (!res.meta.status === 200) {
            // 操作失败则重置
            user.mg_state = !user.mg_state
            this.$message.error(res.meta.msg)
          }
        })
        .catch(err => {
          user.mg_state = !user.mg_state
          console.log(err)
        })
    },
    getUserList() {
      // 去除前后空格
      const query = this.queryInfo.query.trim()
      this.queryInfo.query = query
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
.adduser-box {
  .el-form-item {
    margin-right: 40px;
  }
}
</style>

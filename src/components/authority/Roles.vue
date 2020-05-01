<!--
 * @Author: robert zhang
 * @Date: 2020-04-26 10:54:34
 * @LastEditTime: 2020-04-29 09:59:00
 * @LastEditors: robert zhang
 * @Description: 角色列表
 * @
 -->

 <template>
  <div class="roles-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary" class="header" @click="addRoleDialogVisible = true">添加角色</el-button>
      <el-table :data="roleList" style="width: 100%" border stripe>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row
              :class="['bdbottom','bdleft',index===0?'bdtop':'','center']"
              v-for="(item,index) in props.row.children"
              :key="item.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二/三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(subItem,index) in item.children"
                  :key="subItem.id"
                  :class="['bdright','bdleft',index ===0?'':'bdtop','center']"
                >
                  <!-- 二级菜单 -->
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      @close="deleteRight(props.row,subItem.id)"
                      closable
                    >{{subItem.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级菜单 -->
                  <el-col :span="16">
                    <el-row class="bdleft">
                      <el-col>
                        <el-tag
                          v-for="lastItem in subItem.children"
                          @close="deleteRight(props.row,lastItem.id)"
                          :key="lastItem.id"
                          type="warning"
                          closable
                        >{{lastItem.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ props.row.children }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="290px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRole(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
              size="mini"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="assignRights(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色弹出框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="resetFields('roleForm')"
    >
      <el-form :model="roleForm" :rules="roleFormRule" ref="roleForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="resetFields('editRoleForm')"
    >
      <el-form :model="editRoleForm" :rules="roleFormRule" ref="editRoleForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹出框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignRightsDialogVisible"
      @close="initRightsTree"
      width="50%"
    >
      <el-tree
        :data="rightList"
        show-checkbox
        node-key="id"
        :default-expanded-keys="defaultRights"
        :default-checked-keys="defaultRights"
        :props="defaultProps"
        @check="adjustRights"
        ref="rightTree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
 
<script>
export default {
  name: 'Roles',
  data() {
    return {
      roleList: [],
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      assignRightsDialogVisible: false,
      rightList: [],
      updatedRights: {
        roleId: '',
        rids: []
      },
      defaultRights: [], // 角色拥有的树形权限
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      roleFormRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { min: 4, max: 10, message: '名称在4-10位之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    resetFields(formRef) {
      this.$refs[formRef].resetFields()
      this.getRoles()
    },
    // 关闭弹出框时初始化数据
    initRightsTree() {
      this.defaultRights = []
      this.updatedRights = {
        roleId: '',
        rids: []
      }
    },
    getNodeRights(node, keyList = []) {
      // 当前节点不包含子节点则返回该节点的id
      if (!node.children) {
        return keyList.push(node.id)
      }
      for (const subNode of node.children) {
        this.getNodeRights(subNode, keyList)
      }
      return keyList
    },
    assignRights(role) {
      // 获取所有的权限列表
      this.$http
        .get('rights/tree')
        .then(res => {
          if (res.data.meta.status === 200) {
            this.updatedRights.roleId = role.id
            this.rightList = res.data.data
            this.getNodeRights(role, this.defaultRights)
            this.assignRightsDialogVisible = true
          } else {
            this.$message.error('获取角色列表失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('网络异常')
        })
    },
    updateRights() {
      this.$http
        .post(`roles/${this.updatedRights.roleId}/rights`, {
          rids: this.$refs.rightTree.getCheckedKeys().concat(this.$refs.rightTree.getHalfCheckedKeys()).toString()
        })
        .then(res => {
          this.assignRightsDialogVisible = false

          if (res.data.meta.status === 200) {
            this.$message.success('分配成功')
          } else {
            this.$message.error('分配失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('网络异常')
        })
    },
    adjustRights(node, status) {
      this.updatedRights.roleId = node.id
      this.updatedRights.rids = status.checkedKeys.concat(
        status.halfCheckedKeys
      )
    },
    deleteRight(role, rightId) {
      this.$confirm('是否删除该角色拥有的权限？', '提示', {
        type: 'warning'
      }).then(action => {
        this.$http
          .delete('roles/' + role.id + '/rights/' + rightId)
          .then(res => {
            if (res.data.meta.status === 200) {
              role.children = res.data.data
              this.$message.success(res.data.meta.msg)
            } else {
              this.$message.error('删除失败')
            }
          })
          .catch(err => {
            console.log(err)
            this.$message.err('网络异常')
          })
      })
    },
    editRole(role) {
      this.editRoleForm = role
      this.editRoleDialogVisible = true
    },
    updateRole() {
      this.$refs.editRoleForm.validate(value => {
        this.$http
          .put('roles/' + this.editRoleForm.id, {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          })
          .then(res => {
            if (res.data.meta.status === 200) {
              this.$message.success('修改成功')
            } else {
              this.$message.error('修改失败')
            }
            this.editRoleDialogVisible = false
          })
          .catch(err => {
            console.log(err)
            this.$message.error('网络异常')
          })
      })
    },
    getRoles() {
      this.$http
        .get('roles')
        .then(res => {
          if (res.data.meta.status === 200) {
            this.roleList = res.data.data
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    addRole() {
      this.$refs.roleForm.validate((value, err) => {
        if (value) {
          this.$http
            .post('roles', this.roleForm)
            .then(res => {
              if (res.data.meta.status === 201) {
                this.$message.success('添加成功')
              } else {
                this.$message.error('添加失败')
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.error('网络错误')
            })
        } else {
          console.log(err)
        }
      })
    },
    deleteRole(roleId) {
      this.$confirm('请确认是否永久删除该角色！', '提示', {
        type: 'warning',
        showClose: true
      }).then(() => {
        this.$http
          .delete('roles/' + roleId)
          .then(res => {
            if (res.data.meta.status === 200) {
              this.$message.success('删除成功')
            } else {
              this.$message.error('删除失败')
            }
            this.getRoles()
          })
          .catch(err => {
            console.log(err)
            this.$message.error('网络异常')
          })
      })
    }
  }
}
</script>
 
 <style lang="scss" scoped>
.box-card {
  .header {
    margin-bottom: 20px;
  }
  .el-tag {
    margin: 5px;
  }

  .center {
    display: flex;
    justify-items: center;
    align-items: center;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdright {
    border-right: 1px solid #eee;
  }

  .bdleft {
    border-left: 1px solid #eee;
  }
}
</style>

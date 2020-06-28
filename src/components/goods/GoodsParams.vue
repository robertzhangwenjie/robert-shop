<!--
 * @Author: robert zhang
 * @Date: 2020-05-18 20:48:48
 * @LastEditTime: 2020-06-28 09:21:05
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
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisable"
            @click="addParamDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editParam(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delParam(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisable"
            @click="addParamDialogVisible = true"
          >添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag
                    v-for="(item,i) in scope.row.attr_vals"
                    :key="i"
                    closable
                    @close="handleClose(i,scope.row)"
                  >{{item}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editParam(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delParam(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加'+ addParamDiagTitle"
      :visible.sync="addParamDialogVisible"
      width="30%"
      :close="handleCloseAddParamDiag"
    >
      <el-form :model="paramForm" ref="paramForm" :rules="paramFormRules" label-width="80px">
        <el-form-item :label="addParamDiagTitle" prop="attr_name">
          <el-input v-model="paramForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'添加'+ editParamDiagTitle"
      :visible.sync="editParamDialogVisible"
      width="30%"
      :close="handleCloseEditParamDiag"
    >
      <el-form
        :model="editParamForm"
        ref="editParamForm"
        :rules="paramFormRules"
        label-width="80px"
      >
        <el-form-item :label="editParamDiagTitle" prop="attr_name">
          <el-input v-model="editParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeParam">确 定</el-button>
      </span>
    </el-dialog>
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
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],
      // 添加参数对话框是否显示
      addParamDialogVisible: false,
      // 参数表单对象
      paramForm: {
        attr_name: ''
      },
      // 参数表单校验规则
      paramFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      // 编辑参数对话框
      editParamDialogVisible: false,
      // 编辑参数表单对象
      editParamForm: {
        attr_id: '',
        attr_name: '',
        attr_sel: ''
      }
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
    },
    addParamDiagTitle() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
    // 编辑参数对话框标题
    editParamDiagTitle() {
      if (this.activeName === 'many') {
        return '动态属性'
      } else {
        return '静态属性'
      }
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
        this.manyTableData = []
        this.onlyTableData = []
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
        this.$http
          .get(`categories/${this.selectedKeyId}/attributes`, {
            params: { sel: this.activeName }
          })
          .then(res => {
            if (res.data.meta.status === 200) {
              // 将返回的vals转换为数组
              for (const item of res.data.data) {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                // 控制文本框是否隐藏
                item.inputVisible = false
                item.inputValue = ''
              }
              console.log(res.data.data)

              if (this.activeName === 'many') {
                this.manyTableData = res.data.data
              } else {
                this.onlyTableData = res.data.data
              }
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
      }
    },
    // 编辑参数
    editParam(paramObj) {
      console.log(paramObj)
      this.editParamForm.attr_name = paramObj.attr_name
      this.editParamForm.attr_id = paramObj.attr_id
      this.editParamDialogVisible = true
    },
    // 添加参数
    addParam() {
      this.$refs.paramForm.validate((valid, err) => {
        if (valid) {
          this.$http
            .post(`categories/${this.selectedKeyId}/attributes`, {
              attr_name: this.paramForm.attr_name,
              attr_sel: this.activeName
            })
            .then(res => {
              if (res.data.meta.status === 201) {
                this.$message.success('添加成功')
                this.getCateAttrs()
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch(err => {
              this.message.error(err)
            })
        }
        this.addParamDialogVisible = false
      })
    },
    // 监听对话框关闭事件
    handleCloseAddParamDiag() {
      this.addParamDialogVisible = false
      this.paramForm = ''
      this.$refs.paramForm.restFileds()
    },
    // 监听关闭编辑参数对话框
    handleCloseEditParamDiag() {
      this.editParamForm = ''
      this.$refs.editParamForm.resetFields()
      this.editParamDialogVisible = false
    },
    // 提交修改请求
    changeParam() {
      this.$refs.editParamForm.validate(valid => {
        if (valid) {
          this.$http
            .put(
              `categories/${this.selectedKeyId}/attributes/${this.editParamForm.attr_id}`,
              {
                attr_name: this.editParamForm.attr_name,
                attr_sel: this.activeName
              }
            )
            .then(res => {
              if (res.data.meta.status === 200) {
                this.editParamDialogVisible = false
                this.$message.success('修改成功')
                this.getCateAttrs()
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.error('网络异常')
            })
        } else {
        }
      })
    },
    // 删除参数
    delParam(paramObj) {
      this.$confirm('是否永久删除此参数？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$http
            .delete(
              `categories/${paramObj.cat_id}/attributes/${paramObj.attr_id}`
            )
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              } else {
                this.$message.error(res.data.meta.msg)
              }
              this.getCateAttrs()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 更新参数
    saveParam(row) {
      // 更新属性
      this.$http
        .put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        })
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 处理tag关闭,通过index来删除attr_vals数组中的对应的索引项
    handleClose(index, row) {
      // 删除对应的索引项
      row.attr_vals.splice(index, 1)
      this.saveParam(row)
    },
    // 点击新建tag时显示input框
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 文本框失去焦点或按下enter后触发添加tag
    handleInputConfirm(row) {
      if (row.inputValue.trim().length !== 0) {
        row.attr_vals.push(row.inputValue)
        this.saveParam(row)
      }
      // 失去焦点或者按下enter时，隐藏input然后显示tag
      row.inputVisible = false
      // 清空input框的数据
      row.inputValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.cat_opt {
  margin: 20px 0;
}

.el-tag {
  margin: 5px;
}

.el-tab-pane {
  .el-button {
    margin-bottom: 14px;
  }
}

.button-new-tag {
  margin-left: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
}
</style>

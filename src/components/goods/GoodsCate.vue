<!--
 * @Author: robert zhang
 * @Date: 2020-05-05 10:17:46
 * @LastEditTime: 2020-05-14 23:06:22
 * @LastEditors: robert zhang
 * @Description: 商品分类管理页面
 * @
 -->

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-col class="header">
          <el-button type="primary" @click="showAddCateDialog()">添加分类</el-button>
        </el-col>
        <el-col>
          <!-- 带树形的表格 -->
          <zk-table
            :data="cateData.result"
            :columns="columns"
            show-index
            index-text="#"
            :selection-type="false"
            :expand-type="false"
            border
          >
            <!-- 自定义状态模板 -->
            <template slot="isok" slot-scope="scope">
              <i style="color: green" class="el-icon-success" v-if="!scope.row.cat_deleted"></i>
              <i style="color: red" class="el-icon-error" v-if="scope.row.cat_deleted"></i>
            </template>
            <!-- 自定义级别显示模板 -->
            <template slot="level" slot-scope="scope">
              <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
              <el-tag v-if="scope.row.cat_level===1" type="success">二级</el-tag>
              <el-tag v-if="scope.row.cat_level===2" type="warning">三级</el-tag>
            </template>
            <!-- 自定义操作模板 -->
            <template slot="operator" slot-scope="scope">
              <el-button
                @click="editCate(scope.row)"
                type="primary"
                size="mini"
                icon="el-icon-edit"
              >编辑</el-button>
              <el-button
                @click="delCate(scope.row.cat_id)"
                type="danger"
                size="mini"
                icon="el-icon-delete"
              >删除</el-button>
            </template>
          </zk-table>
        </el-col>
      </el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cateData.total"
      ></el-pagination>
    </el-card>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" @close="closeEditCateDialog">
      <el-form :model="editForm" :rules="cateFormRule" ref="editForm">
        <el-form-item label="分类名称" label-width="80px" prop="name">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="40%" @close="resetCateFrom">
      <el-form :model="cateForm" ref="cateForm" :rules="cateFormRule" label-width="auto">
        <el-form-item label="分类名称:" prop="name">
          <el-input v-model="cateForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类父类:" prop="cat_ids">
          <el-cascader
            ref="cateSelect"
            v-model="cateForm.cat_ids"
            placeholder="请选择"
            style="width: 100%"
            :options="parentCateList"
            :props="props"
            :show-all-levels="false"
            clearable
            filterable
            @change="selectKeysChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'GoodsCate',
  data() {
    return {
      // 查询信息对象
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      cateData: {},
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '级别',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operator'
        }
      ],
      // 控制添加分类对话框是否显示
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      // 编辑分类表单
      editForm: {
        name: '',
        cat_id: ''
      },
      // 添加分类表单对象
      cateForm: {
        name: '',
        cat_ids: [],
        cat_pid: 0,
        cat_level: 0
      },
      // 1/2级分类
      parentCateList: [],
      // 级联选项显示属性
      props: {
        label: 'cat_name',
        value: 'cat_id',
        checkStrictly: true
      },
      // 当前级联选中的keys
      cateFormRule: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList() {
      this.$http
        .get('categories', { params: this.queryInfo })
        .then(res => {
          if (res.data.meta.status === 200) {
            this.cateData = res.data.data
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求超时')
        })
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getCateList()
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getCateList()
    },
    showAddCateDialog() {
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    getParentCateList() {
      this.$http
        .get('categories', { params: { type: 2 } })
        .then(res => {
          if (res.data.meta.status === 200) {
            this.parentCateList = res.data.data
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求超时')
        })
    },
    // 选项改变时触发
    selectKeysChanged() {
      this.cateForm.cat_pid = this.cateForm.cat_ids[0]
      if (this.cateForm.cat_ids.length >= 1) {
        this.cateForm.cat_level = this.$refs.cateSelect.getCheckedNodes()[0].level
      }
    },
    // 重置添加表单
    resetCateFrom() {
      console.log('清除表单')
      this.$refs.cateForm.resetFields()
      this.cateForm.cat_pid = []
      this.cateForm.cat_ids = []
    },
    // 点击编辑分类
    editCate(cate) {
      this.editForm.name = cate.cat_name
      this.editForm.cat_id = cate.cat_id
      this.editCateDialogVisible = true
    },
    // 更新分类
    updateCate() {
      this.$refs.editForm.validate(value => {
        if (value) {
          this.$http
            .put(`categories/${this.editForm.cat_id}`, {
              cat_name: this.editForm.name
            })
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message.success('更新分类成功')
              } else {
                this.$message.error(res.data.meta.msg)
              }
              this.editCateDialogVisible = false
            })
            .catch(err => {
              console.log(err)
              this.$message.error('网络异常')
            })
        }
      })
    },
    // 关闭编辑分类
    closeEditCateDialog() {
      this.editForm = {}
      this.$refs.editForm.resetFields()
    },
    // 删除分类
    delCate(cateId) {
      this.$confirm('是否删除该分类?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete(`categories/${cateId}`).then(res => {
            if (res.data.meta.status === 200) {
              this.getCateList()

              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data.meta.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加分类
    addCate() {
      this.$refs.cateForm.validate(valid => {
        if (valid) {
          this.$http
            .post('categories', {
              cat_pid: this.cateForm.cat_pid,
              cat_name: this.cateForm.name,
              cat_level: this.cateForm.cat_level
            })
            .then(res => {
              if (res.data.meta.status === 201) {
                this.addCateDialogVisible = false
                this.$message.success('添加成功')
                this.getCateList()
              } else {
                this.$message.error('添加失败')
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.error('网络异常')
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style  lang="scss" scoped>
.el-row {
  .header {
    margin-bottom: 20px;
  }
}
</style>

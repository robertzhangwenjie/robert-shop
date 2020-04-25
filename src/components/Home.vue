<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="header-left">
        <img src="@/assets/logo.png" alt="系统图标" />
        <span>文杰后台管理系统</span>
      </div>
      <div class="header-right">
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 左边菜单区域 -->
      <el-aside :width="isCollapse?'64px':'15%'">
        <!-- 折叠菜单 -->
        <div class="collapse-toggle" @click="toggleCollapseMenu" v-text="isCollapse?'＞':'＜'"></div>
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          background-color="#303442"
          text-color="#fff"
          unique-opened
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu :index="menu.id + ''" v-for="menu in menuList" :key="menu.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 一级菜单图标 -->
              <i :class="iconsObj[menu.id]" aria-hidden="true"></i>
              <!-- 一级菜单标题 -->
              <span slot="title">{{menu.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <!-- 二级菜单选项 -->
            <el-menu-item
              v-for="subMenu in menu.children"
              :index="'/'+subMenu.path + ''"
              :key="subMenu.id"
              @click.native="saveDefaultActive('/'+subMenu.path + '')"
            >
              <template slot="title">
                <!-- 二级菜单图标 -->
                <i class="el-icon-menu"></i>
                <!-- 二级菜单标题 -->
                <span slot="title">{{subMenu.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 主区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- Footer -->
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-tools',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      },
      isCollapse: false,
      defaultActive: '' // 默认激活的index
    }
  },
  created() {
    this.getMenuList()
    this.defaultActive = sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清除token并退出
      sessionStorage.clear()
      this.$router.push({ name: 'login' })
    },
    getMenuList() {
      this.$http
        .get('menus')
        .then(res => {
          if (res.data.meta.status === 200) {
            this.menuList = res.data.data
          } else {
            this.$message({
              type: 'error',
              message: res.data.meta.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '处理超时',
            showClose: true
          })
        })
    },
    toggleCollapseMenu() {
      this.isCollapse = !this.isCollapse
    },
    saveDefaultActive(activePath) {
      this.defaultActive = activePath
      sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  width: 100%;
}

.el-header {
  padding: 0 10px;
  background-color: #363b3d;
  justify-content: space-between;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 20px;
  .header-left {
    display: flex;
    align-items: center;
    height: 100%;
    img {
      height: 100%;
    }
  }
}

.el-aside {
  background-color: #303442;
  .el-menu {
    border: #e6e6e6;
  }
  .collapse-toggle {
    background-color: #484e60;
    text-align: center;
    font-size: 14px;
    line-height: 24px;
    cursor: pointer;
    letter-spacing: 0.2em;
    color: #e9ebf0;
  }
}
.el-main {
  background-color: #e9ebf0;
}
</style>

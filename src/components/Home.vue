<template>
  <div class="home-container">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      // 清除token并退出
      sessionStorage.removeItem('token')
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

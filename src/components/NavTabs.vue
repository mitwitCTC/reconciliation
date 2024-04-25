<template>
    <el-menu
    :default-active="activeIndex"
    :router="true"
    class="el-menu-demo my-3"
    @select="handleSelect"
    mode="horizontal"
  >
  <el-menu-item index="/reconciliation">
      <RouterLink :to="{ path: '/reconciliation' }">臨停對帳</RouterLink>
    </el-menu-item>
    <el-menu-item index="/monthlyRental">
      <RouterLink :to="{ path: '/monthlyRental' }">月租對帳</RouterLink>
    </el-menu-item>
    <el-menu-item index="/user">
      <RouterLink :to="{ path: '/user' }">使用者管理</RouterLink>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '/reconciliation'
    };
  },
  methods: {
    handleSelect(path) {
      this.activeIndex = path;
    }
  }
};
</script>

<style scoped>

</style>

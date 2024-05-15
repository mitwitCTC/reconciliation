<template>
  <el-menu
    :default-active="routerStore.activeIndex"
    :router="true"
    class="el-menu-demo my-3"
    @change="getPath"
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
import { useRouter } from 'vue-router'
import { useRouterStore } from '@/stores/router.js'

export default {
  data() {
    return {
      routerStore: useRouterStore()
    }
  },
  methods: {
    getPath() {
      const router = useRouter()
      // 監聽路由變化，並更新 Pinia 中的路由狀態
      router.afterEach((to) => {
        this.routerStore.setActiveIndex(to.path)
      })
      this.routerStore.getActiveIndex()
    }
  },

  created() {
    this.getPath()
  },
  watch: {
    useRouter
  }
}
</script>

<style scoped></style>

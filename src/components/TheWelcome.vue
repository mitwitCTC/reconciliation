<script>
import NavTabs from '@/components/NavTabs.vue'

export default {
  components: {
    NavTabs
  },
  data() {
    return {
      groupId: ''
    }
  },
  methods: {
    logout() {
      sessionStorage.removeItem('isAuthenticated')
      alert('登出成功')
      this.$router.push('/login')
    },
    // 取集團代號
    getgroup() {
      this.groupId = atob(this.$route.params.group)
    }
  },
  mounted() {
    this.getgroup()
  }
}
</script>

<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-3">
        <NavTabs />
      </div>
      <div class="col-9">
        <div class="d-flex align-items-center custom-container">
          <h2 class="mb-0">力揚集團</h2>
          <el-button class="header-button" @click="logout()">登出</el-button>
        </div>
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style>

</style>

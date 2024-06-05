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
      sessionStorage.removeItem('activeMenu')
      sessionStorage.removeItem('account')
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
  <div class="common-layout">
    <el-container>
      <el-header class="d-flex justify-content-between align-items-center">
        <h2>力揚帳務</h2>
        <div class="d-flex align-items-center logout" @click="logout()">
          <el-icon><SwitchButton /></el-icon>
          登出
        </div>
      </el-header>
      <el-container>
        <el-aside><NavTabs /></el-aside>
        <el-main><RouterView /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
.el-header {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  padding: 10px 0;
  display: flex;
}

.el-header h2 {
  cursor: default;
}

.logout {
  cursor: pointer;
  font-weight: bold;
  margin-right: 95px;
  &:hover {
    color: #f86c6c;
  }
}

.el-aside {
  margin-top: 5px;
  height: 90vh;
  overflow-y: auto;
  max-width: 10%;
}

.el-main {
  max-width: 90%;
}

@media (max-width: 1024px) {
  .el-aside {
    max-width: 20%;
  }

  .el-main {
    max-width: 80%;
  }
}
</style>

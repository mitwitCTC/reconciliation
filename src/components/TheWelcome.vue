<script>
import NavTabs from '@/components/NavTabs.vue'

export default {
  components: {
    NavTabs,
  },
  data() {
    return {
      groupId: '',
      isAsideCollapsed: false
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
    },
    toggleAside() {
      this.isAsideCollapsed = !this.isAsideCollapsed
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
        <div class="d-flex align-items-center">
          <div class="aside-toggle" @click="toggleAside" :class="{ 'collapsed': isAsideCollapsed }">
            <el-icon size="20px" color="#004080" v-if="isAsideCollapsed"><Expand /></el-icon>
            <el-icon size="20px" color="#004080" v-else><Fold /></el-icon>
          </div>
          <h2>力揚帳務</h2>
        </div>
        <div class="d-flex align-items-center logout" @click="logout()">
          <el-icon><SwitchButton /></el-icon>
          登出
        </div>
      </el-header>
      <el-container>
        <el-aside :width="isAsideCollapsed ? '0' : '200px'" class="aside-container">
          <NavTabs />
        </el-aside>
        <el-main>
          <RouterView />
          <div v-if="!isAsideCollapsed" class="overlay" @click="toggleAside"></div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
.el-header {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
}

.el-header h2 {
  cursor: default;
}

.logout {
  cursor: pointer;
  font-weight: bold;
  margin-right: 95px;
  display: flex;
  align-items: center;
  &:hover {
    color: #f86c6c;
  }
}

.el-aside {
  height: 90vh;
  overflow-y: auto;
  transition: width 0.5s;
  /* 移除 scrollbar 樣式 */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.el-aside::-webkit-scrollbar {
  /* 移除 scrollbar 樣式 */
  display: none; /* Chrome, Safari, Opera */
}

.aside-container {
  position: relative;
}

.aside-toggle {
  cursor: pointer;
  padding: 0 5px;
  margin-right: 10px;
}

.el-main {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2;
}
</style>

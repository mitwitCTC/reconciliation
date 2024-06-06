<template>
  <el-menu
    :default-active="activeMenu"
    :default-openeds="defaultOpeneds"
    active-text-color="#ffd04b"
    background-color="#004080"
    text-color="#fff"
    @select="handleSelect"
  >
    <template v-for="menuItem in navData" :key="menuItem.id">
      <el-sub-menu v-if="menuItem.children" :index="menuItem.path">
        <template #title>
          <el-icon><component :is="menuItem.icon" /></el-icon>
          <span>{{ menuItem.label }}</span>
        </template>
        <template v-for="subItem in menuItem.children" :key="subItem.id">
          <el-menu-item v-if="!subItem.children" :index="subItem.path">
            {{ subItem.label }}
          </el-menu-item>
          <el-sub-menu v-else :index="subItem.path">
            <template #title>{{ subItem.label }}</template>
            <el-menu-item
              v-for="subSubItem in subItem.children"
              :key="subSubItem.id"
              :index="subSubItem.path"
            >
              {{ subSubItem.label }}
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-sub-menu>
      <el-menu-item v-else :index="menuItem.path">
        <el-icon><component :is="menuItem.icon" /></el-icon>
        <span>{{ menuItem.label }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { markRaw } from 'vue'
import { Setting } from '@element-plus/icons-vue'

export default {
  data() {
    return {
      navData: [],
      activeMenu: '',
      // 預設全部展開菜單
      defaultOpeneds: []
    }
  },
  created() {
    this.generateNavData()
    this.restoreActiveMenu()
  },
  methods: {
    generateNavData() {
      const router = useRouter()
      const routes = router.options.routes || []
      const route = useRoute()
      const group = route.params.group

      // 排除 login ，生成導航樹資料
      const generateTreeData = (routes, basePath = '', openedPaths = []) => {
        return routes
          .map((route) => {
            if (route.name === 'login') {
              return null
            }

            const itemPath = `${basePath}/${route.path}`.replace(/\/+/g, '/')
            openedPaths.push(`/${group}${itemPath}`)

            const item = {
              id: route.name,
              label: route.meta?.title || route.name,
              path: `/${group}${itemPath}`,
              icon: markRaw(Setting),
              children: route.children
                ? generateTreeData(route.children, itemPath, openedPaths)
                : []
            }

            // 過濾掉沒有子路由的 children 屬性
            if (item.children.length === 0) {
              delete item.children
            }

            return item
          })
          .filter((item) => item !== null)
      }

      const openedPaths = []
      this.navData = generateTreeData(
        routes.find((route) => route.name === 'home').children,
        '',
        openedPaths
      )
      this.defaultOpeneds = openedPaths
      this.activeMenu = this.navData.length > 0 ? this.navData[0].children[0].path : ''
    },
    handleSelect(index) {
      this.activeMenu = index
      sessionStorage.setItem('activeMenu', index)
      this.$router.push(index)
    },
    restoreActiveMenu() {
      const savedActiveMenu = sessionStorage.getItem('activeMenu')
      if (savedActiveMenu) {
        this.activeMenu = savedActiveMenu
      }
    }
  }
}
</script>

<style scoped></style>

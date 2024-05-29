<template>
  <el-tree
    :data="navData"
    :expand-on-click-node="false"
    :highlight-current="true"
    @node-click="handleNodeClick"
    default-expand-all
  />
</template>

<script>
import { useRouter, useRoute  } from 'vue-router'

export default {
  data() {
    return {
      navData: [],
      currentPath: ''
    }
  },
  mounted() {
    this.generateNavData()
    this.$watch(
      () => this.$route.path,
      (newPath) => {
        this.currentPath = newPath
      }
    )
  },
  methods: {
    generateNavData() {
      const router = useRouter()
      const routes = router.options.routes || []
      const route = useRoute()
      const group = route.params.group

      // 排除 login ，生成導航樹資料
      const generateTreeData = (routes, basePath = '') => {
        return routes.map(route => {
          if (route.name === 'login') {
            return null
          }

          const itemPath = `${basePath}/${route.path}`.replace(/\/+/g, '/')
          const item = {
            id: route.name,
            label: route.meta?.title || route.name,
            path: `/${group}${itemPath}`,
            children: route.children ? generateTreeData(route.children, itemPath) : []
          }

          // 過濾掉沒有子路由的 children 屬性
          if (item.children.length === 0) {
            delete item.children
          }

          return item
        }).filter(item => item !== null)
      }

      this.navData = generateTreeData(routes.find(route => route.name === 'home').children)
    },
    handleNodeClick(data) {
      if (data.path) {
        this.$router.push(data.path)
      }
    }
  }
}
</script>

<style scoped></style>

import { defineStore } from 'pinia'

export const useRouterStore = defineStore({
  id: 'router',
  state: () => {
    return {
      activeIndex: '/reconciliation' // 初始值設置為'/reconciliation'
    }
  },
  actions: {
    setActiveIndex(index) {
      this.activeIndex = index
      sessionStorage.setItem("path", this.activeIndex)
    },
    getActiveIndex() {
      this.activeIndex = sessionStorage.getItem("path")
    },
  },
})
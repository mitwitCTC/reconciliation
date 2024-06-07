export default {
  data() {
    return {
      dialogWidth: ''
    }
  },
  methods: {
    updateDialogWidth() {
      const width = window.innerWidth
      if (width > 1200) {
        this.dialogWidth = '40%'
      } else if (width > 767) {
        this.dialogWidth = '50%'
      } else {
        this.dialogWidth = '90%'
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.updateDialogWidth)
    this.updateDialogWidth() // 初始化寬度
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateDialogWidth)
  }
}

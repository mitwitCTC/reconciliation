export default {
    data() {
        return {
            pageTitle: ''
        }
    },
    methods: {
        getPageTitle() {
            this.pageTitle = this.$route.name
        },
    },
    mounted() {
        this.getPageTitle()
    }
  }
  
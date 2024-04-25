<script>
import NavTabs from '@/components/NavTabs.vue'

export default {
  components: {
    NavTabs
  }
}
</script>

<template>
  <div class="container">
    <NavTabs></NavTabs>
    <RouterView />
  </div>
</template>

<style>

</style>

<script>
import NavTabs from '@/components/NavTabs.vue'

export default {
  components: {
    NavTabs
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
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style>

</style>

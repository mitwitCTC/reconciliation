<script>
// import { RouterView } from 'vue-router'
export const API = 'http://122.116.23.30:3335'
</script>

<template>
  <div class="md">
    <RouterView />
  </div>
  <div class="sm text-center">
    <p>不支援手機，請使用平板或電腦</p>
  </div>
</template>

<style scoped>
.sm {
  display: none;
}
@media screen and (max-width:767px) { 
  .md {
    display: none;
  }
  .sm {
    display: block;
  }
}
</style>

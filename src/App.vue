<script>
// import { RouterView } from 'vue-router'
export const API = 'http://122.116.23.30:3335'
</script>

<template>
  <RouterView />
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

<script>
// import router from '@/router'
// import { RouterLink, RouterView } from 'vue-router'

export default {
  data() {
    return {
      account: '',
      password: ''
    }
  },
  methods: {
    login() {
      if (this.account != '' && this.password != '') {
        console.log(this.account, this.password);
        this.$router.push('/reconciliation')
      } else {
        alert("帳號或密碼不得為空！");
      }
    }
  }
}
</script>

<template>
  <div class="container-fluid">
    <h1 class="my-3 text-center">對帳系統</h1>
    <form>
      <div class="mb-3">
        <label for="account" class="form-label">請輸入帳號</label>
        <input type="text" class="form-control" id="account" v-model="account" />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">請輸入密碼</label>
        <input type="password" class="form-control" id="password" v-model="password" />
      </div>
      <button type="submit" class="btn btn-success" @click.prevent="login">登入</button>
    </form>
  </div>
</template>

<style></style>

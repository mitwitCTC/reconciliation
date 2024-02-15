<template>
  <div class="container">
    <h1 class="my-3 text-center">對帳系統</h1>
    <form class="row g-3">
      <div class="col-md-4">
        <div class="form-floating">
          <input
            type="date"
            class="form-control"
            id="date"
            placeholder="請選擇對帳日期"
            v-model="searchData.date"
          />
          <label for="date">請選擇對帳日期</label>
        </div>
      </div>

      <div class="col-md-4">
        <div class="form-floating">
          <select class="form-select" id="floatingSelectPayment" v-model="searchData.payment">
            <option disabled>請選擇金流來源</option>
            <option v-for="item in payments" :key="item" :value="item">{{ item }}</option>
          </select>
          <label for="floatingSelectPayment">請選擇金流來源</label>
        </div>
      </div>

      <div class="col-md-4">
        <div class="form-floating">
          <select class="form-select" id="floatingSelectBank" v-model="searchData.bankAccount">
            <option disabled>請選擇銀行來源</option>
            <option v-for="item in bankAccounts" :key="item" :value="item">{{ item }}</option>
          </select>
          <label for="floatingSelectBank">請選擇銀行來源</label>
        </div>
      </div>

      <div class="col-12 text-end">
        <button class="btn btn-success" @click.prevent="show">顯示</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchData: {
        date: '',
        payment: '',
        bankAccount: ''
      },
      // 金流來源 payments
      payments: ['悠遊卡', '街口支付', 'LinePay'],
      //   銀行來源 bankAccounts
      bankAccounts: ['00912345678900', '00912345678901', '00912345678902']
    }
  },
  methods: {
    show() {
      if (
        this.searchData.date !== '' &&
        this.searchData.payment !== '' &&
        this.searchData.bankAccount !== ''
      ) {
        console.log(this.searchData)
      } else {
        alert('搜尋欄位不得為空！')
      }
    }
  }
}
</script>

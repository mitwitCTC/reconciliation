<template>
  <div class="container">
    <h1 class="my-3 text-center">對帳系統</h1>
    <form class="row align-items-center">
      <div class="col-md-3">
        <el-date-picker
          class="align-self-stretch"
          style="width: 100%"
          v-model="searchData.date"
          type="date"
          placeholder="請選擇入帳日期"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
        />
      </div>

      <div class="col-md-3">
        <el-select v-model="searchData.cashFlowSource" placeholder="請選擇金流來源">
          <el-option v-for="item in cashFlowSources" :key="item" :label="item" :value="item" />
        </el-select>
      </div>

      <div class="col-md-3">
        <el-select v-model="searchData.bankAccount" placeholder="請選擇銀行來源">
          <el-option
            v-for="item in bankAccounts"
            :key="item.account"
            :label="item.account"
            :value="item.account"
          />
        </el-select>
      </div>

      <div class="col-md-2 mobile-btns">
        <button class="btn btn-success" @click.prevent="show">顯示</button>
        <button class="btn btn-outline-success" @click.prevent="transfer">轉傳票</button>
      </div>
    </form>

    <p class="text-end">
      <br /><span class="bg-success text-white p-1">綠底標註</span>為符合的比對結果
    </p>

    <div class="row">
      <div class="col-md-6">
        <h2 class="text-center my-2">銀行帳</h2>
        <p v-if="countBankFlow > 0" class="text-end">
          共&nbsp;
          <strong>{{ countBankFlow }}</strong>
          &nbsp;筆
          <span>
            &nbsp;/&nbsp;總金額&nbsp;$
            <strong>{{
              totalBankFlow.toLocaleString('en', { minimumFractionDigits: 0 })
            }}</strong></span
          >
        </p>
        <el-table
          :data="bankFlow"
          :row-style="{ height: '50px' }"
          :row-class-name="customRowClassName"
          height="450"
        >
          <el-table-column align="center" prop="station" label="場站名稱" width="180" />
          <el-table-column align="center" prop="postingDate" label="入帳日" width="180" />
          <el-table-column
            align="center"
            prop="depositAmount"
            sortable
            :formatter="amountFormatter"
            label="入帳金額"
            width="110"
          />
          <el-table-column align="center" prop="note" label="註記" width="180" />
        </el-table>
      </div>
      <div class="col-md-6">
        <h2 class="text-center my-2">系統帳</h2>
        <p v-if="countSystemFlow > 0" class="text-end">
          共&nbsp;
          <strong>{{ countSystemFlow }}</strong>
          &nbsp;筆
          <span>
            &nbsp;/&nbsp;總金額&nbsp;$
            <strong>{{
              totalSystemFlow.toLocaleString('en', { minimumFractionDigits: 0 })
            }}</strong></span
          >
        </p>
        <el-table
          :data="systemFlow"
          :row-style="{ height: '50px' }"
          :row-class-name="customSystemRowClassName"
          height="450"
        >
          <el-table-column align="center" prop="station" label="場站名稱" width="180" />
          <el-table-column align="center" prop="postingDate" label="入帳日" width="210" />
          <el-table-column
            align="center"
            prop="depositAmount"
            sortable
            :formatter="amountFormatter"
            label="入帳金額"
            width="110"
          />
          <el-table-column
            align="center"
            prop="transactionAmount"
            sortable
            :formatter="amountFormatter"
            label="交易金額"
            width="110"
          />
          <el-table-column
            align="center"
            prop="fee"
            sortable
            :formatter="amountFormatter"
            label="手續費"
            width="110"
          />
          <el-table-column align="center" prop="transactionCode" label="交易代號" width="100" />
          <el-table-column align="center" label="明細" width="180">
            <template v-slot="scope">
              <el-button @click="openDetailDialog(scope)">查看明細</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        v-model="dialogTableVisible"
        :close-on-click-modal="false"
        align="center"
        title="交易明細"
        width="70vw"
      >
        <el-table :data="systemFlowDetails">
          <el-table-column align="center" property="transactionTime" label="交易時間" />
          <el-table-column align="center" label="金額">
            <template v-slot="scope">
              <el-input
                v-model="scope.row.amount"
                @keyup.enter="handleDetailAmountChange(scope.row)"
                :min="0"
                :step="5"
                type="number"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="調整">
            <template v-slot="scope">
              <el-button @click="handleDetailAmountChange(scope.row)">確認調整</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ElLoading } from 'element-plus'

// import { API } from '../App.vue'

export default {
  data() {
    return {
      disabledDate(time) {
        return time.getTime() > Date.now()
      },
      searchData: {
        date: '',
        cashFlowSource: '',
        bankAccount: ''
      },
      // 搜尋條件來源
      searchOrigin: [],
      // 金流來源 cashFlowSources bankMemo欄位
      cashFlowSources: [],
      //   銀行來源 bankAccounts
      bankAccounts: [],
      isComparing: false,
      bankFlow: [],
      countBankFlow: null,
      totalBankFlow: null,
      systemFlow: [],
      countSystemFlow: null,
      totalSystemFlow: null,
      dialogTableVisible: false,
      systemFlowDetails: [],
      dialogVisible: false,
      selectedId: null,
      stations: [],
      transferData: []
    }
  },
  methods: {
    getSearchOrigin() {
      this.searchOrigin = [
        {
          id: 1,
          companyId: 1,
          bankMemo: 'iPASS MONEY',
          voucherDesc: '一卡通',
          message: null,
          bankId: 1,
          name: '力揚彰銀臨停',
          bankCode: '009',
          account: '41150119912400'
        },
        {
          id: 2,
          companyId: 1,
          bankMemo: '國泰世華商連加',
          voucherDesc: '連加',
          message: null,
          bankId: 1,
          name: '力揚彰銀臨停一',
          bankCode: '009',
          account: '41150119912401'
        },
        {
          id: 3,
          companyId: 1,
          bankMemo: '悠遊卡公司',
          voucherDesc: '悠遊卡',
          message: '悠遊卡舊系統',
          bankId: 1,
          name: '力揚彰銀臨停',
          bankCode: '009',
          account: '41150119912406'
        }
      ]
      this.getCashFlowSources()
      this.getBankAccountSources()
    },
    // 金流來源選項
    getCashFlowSources() {
      this.cashFlowSources = this.searchOrigin.map((item) => {
        return item.bankMemo.trim()
      })
    },
    // 銀行來源選項
    getBankAccountSources() {
      this.bankAccounts = this.searchOrigin.map((item) => {
        return {
          name: item.name.trim(),
          account: `${item.bankCode}${item.account}`
        }
      })
    },
    show() {
      if (
        this.searchData.date !== '' &&
        this.searchData.cashFlowSource !== '' &&
        this.searchData.bankAccount !== ''
      ) {
        const loading = ElLoading.service({
          lock: true,
          text: '比對中...',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        setTimeout(() => {
          loading.close()
          this.countBankFlow = null
          this.totalBankFlow = null
          this.countSystemFlow = null
          this.totalSystemFlow = null
          this.compare()
        }, 2000)
      } else {
        alert('搜尋欄位不得為空！')
      }
    },
    getBankFlow() {
      this.bankFlow = [
        {
          id: 1,
          station: '',
          postingDate: '2024-01-01',
          depositAmount: 1000,
          note: '這是備註訊息'
        },
        {
          id: 2,
          station: '',
          postingDate: '2024-01-01',
          depositAmount: 1300,
          note: ''
        },
        {
          id: 3,
          station: '',
          postingDate: '2024-01-01',
          depositAmount: 1200,
          note: '這是備註訊息'
        },
        {
          id: 4,
          station: '',
          postingDate: '2024-01-01',
          depositAmount: 900,
          note: ''
        },
        {
          id: 5,
          station: '',
          postingDate: '2024-01-01',
          depositAmount: 500,
          note: ''
        }
      ]
      this.countBankFlow = this.bankFlow.length
      this.bankFlow.forEach((item) => {
        this.totalBankFlow += item.depositAmount
      })
    },
    getSystemFlow() {
      // const getSystemFlowAPI = `${API}/main/tradeSum`
      // console.log(getSystemFlowAPI)
      this.systemFlow = [
        {
          id: 64,
          postingDate: '2024-01-01',
          transactionAmount: 515,
          fee: 15,
          depositAmount: 500,
          transactionCode: 'y11111111',
          station: '富岡停一停車場'
        },
        {
          id: 98,
          postingDate: '2024-01-01',
          transactionAmount: 915,
          fee: 15,
          depositAmount: 900,
          transactionCode: 'y22222222',
          station: '南崁廣停一'
        },
        {
          id: 119,
          postingDate: '2024-01-01',
          transactionAmount: 1315,
          fee: 15,
          depositAmount: 1300,
          transactionCode: 'y33333333',
          station: '瑞芳消防分隊營業所'
        },
        {
          id: 191,
          postingDate: '2024-01-01',
          transactionAmount: 515,
          fee: 15,
          depositAmount: 500,
          transactionCode: 'y44444444',
          station: '桃園停三'
        },
        {
          id: 199,
          postingDate: '2024-01-01',
          transactionAmount: 515,
          fee: 15,
          depositAmount: 500,
          transactionCode: 'y55555555',
          station: '桃園停一'
        }
      ]
      // this.axios
      //   .post(getSystemFlowAPI, {
      //     consumeType: this.searchData.consumeType,
      //     date: this.searchData.date
      //   })
      //   .then((response) => {
      //     console.log('這是系統帳哦～', response)
      //   })
      this.countSystemFlow = this.systemFlow.length
      this.systemFlow.forEach((item) => {
        this.totalSystemFlow += item.depositAmount
      })
    },
    handlePostingDateChange(row) {
      console.log(row)
    },
    // 數字千分位格式
    amountFormatter(row, column, cellValue) {
      cellValue += ''
      if (!cellValue.includes('.')) cellValue += '.'
      return cellValue
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ','
        })
        .replace(/\.$/, '')
    },
    compare() {
      this.getBankFlow()
      this.getSystemFlow()
      this.bankFlow.forEach((bankItem) => {
        const matchingSystemFlow = this.systemFlow.find(
          (systemItem) => systemItem.depositAmount === bankItem.depositAmount
        )

        if (matchingSystemFlow) {
          bankItem.station = matchingSystemFlow.station
        }
      })
      console.log('比對完啦', this.bankFlow)
    },
    customRowClassName({ row }) {
      return row.station !== '' ? 'bg-success text-white' : ''
    },
    customSystemRowClassName({ row }) {
      const isMatched = this.bankFlow.some(
        (item) => item.station === row.station && item.postingDate === row.postingDate
      )
      return isMatched ? 'bg-success text-white' : ''
    },
    openDetailDialog(scope) {
      console.log(scope.row)
      this.dialogTableVisible = true
      this.systemFlowDetails = [
        {
          transactionTime: '12:30:43',
          amount: 80
        },
        {
          transactionTime: '14:11:34',
          amount: 120
        },
        {
          transactionTime: '16:51:11',
          amount: 160
        },
        {
          transactionTime: '18:40:51',
          amount: 160
        },
        {
          transactionTime: '18:53:20',
          amount: 80
        },
        {
          transactionTime: '19:11:45',
          amount: 200
        },
        {
          transactionTime: '19:41:38',
          amount: 160
        },
        {
          transactionTime: '20:28:54',
          amount: 40
        },
        {
          transactionTime: '21:53:28',
          amount: 200
        }
      ]
    },
    handleDetailAmountChange(row) {
      if ((row.outDate !== null) & (row.amount !== '')) {
        console.log('交易明細變更', row)
        alert('修改成功')
      } else {
        alert('修改欄位不得為空！')
      }
    },
    transfer() {
      this.transferData = this.bankFlow.filter((e) => e.station != '')
      if (this.transferData.length > 0) {
        this.bankFlow = this.bankFlow.filter((e) => e.station == '')
        alert('完成轉傳票')
        console.log('轉傳票', this.transferData)
      } else {
        alert('無可以轉傳票的資料！')
      }
    }
  },
  mounted() {
    this.getSearchOrigin()
  }
}
</script>

<style>
el-table {
  max-height: 50vh;
}

.el-loading-spinner .el-loading-text {
  font-size: large;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  color: #000000 !important;
  opacity: 0.6;
}

.mobile-btns {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}
</style>

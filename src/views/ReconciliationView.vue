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
          placeholder="請選擇對帳日期"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        />
      </div>

      <div class="col-md-3">
        <el-select v-model="searchData.payment" placeholder="請選擇金流來源">
          <el-option v-for="item in payments" :key="item" :label="item" :value="item" />
        </el-select>
      </div>

      <div class="col-md-3">
        <el-select v-model="searchData.bankAccount" placeholder="請選擇銀行來源">
          <el-option v-for="item in bankAccounts" :key="item" :label="item" :value="item" />
        </el-select>
      </div>

      <div class="col-md-2 mobile-btns">
        <button class="btn btn-success" @click.prevent="show">顯示</button>
        <button class="btn btn-outline-success" @click.prevent="transfer">轉傳票</button>
      </div>
    </form>

    <div class="d-flex justify-content-between">
      <p class="text-danger">
        銀行帳未核銷日期：1/2、1/5 <br />
        <span>未核筆數 {{ bankFlow.length }} 筆 / 總筆數 10 筆</span>
      </p>
      <p class="text-end">
        <br /><span class="bg-success text-white p-1">綠底標註</span>為符合的比對結果
      </p>
    </div>

    <div class="row">
      <div class="col-md-6">
        <h2 class="text-center my-2">銀行帳</h2>
        <el-table
          :data="bankFlow"
          :row-style="{ height: '50px' }"
          :row-class-name="customRowClassName"
          height="450"
        >
          <el-table-column align="center" prop="stationName" label="場站名稱" width="180" />
          <el-table-column align="center" prop="postingDate" label="入帳日" width="180" />
          <el-table-column
            align="center"
            prop="amount"
            sortable
            :formatter="amountFormatter"
            label="金額"
            width="80"
          />
          <el-table-column align="center" prop="note" label="備註" width="180" />
        </el-table>
      </div>
      <div class="col-md-6">
        <h2 class="text-center my-2">系統帳</h2>
        <el-table
          :data="systemFlow"
          :row-style="{ height: '50px' }"
          :row-class-name="customSystemRowClassName"
          height="450"
        >
          <el-table-column align="center" prop="stationName" label="場站名稱" width="180" />
          <el-table-column align="center" prop="postingDate" label="交易日" width="120" />
          <el-table-column
            align="center"
            prop="amount"
            sortable
            :formatter="amountFormatter"
            label="金額"
            width="80"
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
                @keyup.enter="handleAmountChange(scope.row)"
                :min="0"
                :step="5"
                type="number"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="調整">
            <template v-slot="scope">
              <el-button @click="handleAmountChange(scope.row)">確認調整</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ElLoading } from 'element-plus'

export default {
  data() {
    return {
      searchData: {
        date: '',
        payment: '',
        bankAccount: ''
      },
      // 金流來源 payments
      payments: [],
      //   銀行來源 bankAccounts
      bankAccounts: [],
      isComparing: false,
      bankFlow: [],
      systemFlow: [],
      dialogTableVisible: false,
      systemFlowDetails: [],
      dialogVisible: false,
      selectedId: null,
      stations: [],
      transferData: []
    }
  },
  methods: {
    getStations() {
      this.stations = [
        { id: 64, name: '力揚林口廣停二' },
        { id: 98, name: '力揚基隆麥金' },
        { id: 119, name: '力揚八里舊城' },
        { id: 191, name: '力揚第一運動場西門' },
        { id: 199, name: '力揚信義區公所' }
      ]
    },
    getPayments() {
      this.payments = ['悠遊卡', '街口支付', 'LinePay']
    },
    getbankAccounts() {
      this.bankAccounts = ['00912345678900', '00912345678901', '00912345678902']
    },
    show() {
      if (
        this.searchData.date !== '' &&
        this.searchData.payment !== '' &&
        this.searchData.bankAccount !== ''
      ) {
        const loading = ElLoading.service({
          lock: true,
          text: '比對中...',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        setTimeout(() => {
          loading.close()
          this.compare()
          // console.log(this.bankFlow, this.systemFlow)
        }, 2000)
      } else {
        alert('搜尋欄位不得為空！')
      }
    },
    getBankFlow() {
      this.bankFlow = [
        {
          id: 1,
          stationName: '',
          postingDate: '2024-01-01',
          amount: 1000,
          note: '這是備註訊息'
        },
        {
          id: 2,
          stationName: '',
          postingDate: '2024-01-01',
          amount: 1300,
          note: ''
        },
        {
          id: 3,
          stationName: '',
          postingDate: '2024-01-01',
          amount: 1200,
          note: '這是備註訊息'
        },
        {
          id: 4,
          stationName: '',
          postingDate: '2024-01-01',
          amount: 900,
          note: ''
        },
        {
          id: 5,
          stationName: '',
          postingDate: '2024-01-01',
          amount: 500,
          note: ''
        }
      ]
    },
    getSystemFlow() {
      this.getStations()
      this.systemFlow = [
        {
          id: 64,
          postingDate: '2024-01-01',
          amount: 970,
          transactionCode: 'y11111111'
        },
        {
          id: 98,
          postingDate: '2024-01-01',
          amount: 1230,
          transactionCode: 'y22222222'
        },
        {
          id: 119,
          postingDate: '2024-01-01',
          amount: 1200,
          transactionCode: 'y33333333'
        },
        {
          id: 191,
          postingDate: '2024-01-01',
          amount: 900,
          transactionCode: 'y44444444'
        },
        {
          id: 199,
          postingDate: '2024-01-01',
          amount: 500,
          transactionCode: 'y55555555'
        }
      ]
      this.systemFlow.forEach((systemItem) => {
        const matchingStation = this.stations.find(
          (stationItem) => systemItem.id === stationItem.id
        )

        if (matchingStation) {
          systemItem.stationName = matchingStation.name
        }
      })
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
          (systemItem) => systemItem.amount === bankItem.amount
        )

        if (matchingSystemFlow) {
          bankItem.stationName = matchingSystemFlow.stationName
        }
      })
      console.log('比對完啦', this.bankFlow)
    },
    customRowClassName({ row }) {
      return row.stationName !== '' ? 'bg-success text-white' : ''
    },
    customSystemRowClassName({ row }) {
      const isMatched = this.bankFlow.some(
        (item) => item.stationName === row.stationName && item.postingDate === row.postingDate
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
    handleAmountChange(row) {
      console.log('金額變更', row)
      alert('修改成功')
    },
    transfer() {
      this.transferData = this.bankFlow.filter((e) => e.stationName != '')
      if (this.transferData.length > 0) {
        this.bankFlow = this.bankFlow.filter((e) => e.stationName == '')
        alert("完成轉傳票")
        console.log('轉傳票', this.transferData)
      } else {
        alert('無可以轉傳票的資料！')
      }
    }
  },
  mounted() {
    this.getPayments()
    this.getbankAccounts()
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

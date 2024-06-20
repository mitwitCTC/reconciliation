<template>
  <div>
    <h2 class="mb-3 text-center">{{ pageTitle }}</h2>
    <form class="row align-items-end justify-content-center">
      <div class="col-lg-4 col-md-12">
        <el-date-picker
          class="align-self-stretch"
          style="width: 100%"
          v-model="searchData.date"
          type="date"
          placeholder="請選擇入帳日期"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          :clearable="false"
        />
      </div>
      <div class="col-lg-4 col-md-12 mt-2">
        <el-select v-model="searchData.parkId" placeholder="請選擇場站">
          <el-option disabled value="null">請選擇場站</el-option>
          <el-option v-for="item in carParks" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>

      <div class="col-lg-2 col-md-12 mobile-btns">
        <button class="btn btn-sm btn-success" @click.prevent="show">顯示</button>
        <button class="btn btn-sm btn-outline-success" @click.prevent="transfer">轉傳票</button>
      </div>
    </form>

    <div class="row">
      <div class="col-md-6">
        <h2 class="text-center my-2">繳費端資料</h2>
        <p v-if="countAps > 0" class="text-end">
          共&nbsp;
          <strong>{{ countAps }}</strong>
          &nbsp;筆
          <span>
            &nbsp;/&nbsp;總金額&nbsp;$
            <strong>
              {{ totalAps.toLocaleString('en', { minimumFractionDigits: 0 }) }}
            </strong>
          </span>
        </p>

        <el-table :data="apsData" :row-style="{ height: '50px' }" height="450">
          <el-table-column align="center" prop="parkName" label="場站名稱" />
          <el-table-column align="center" prop="TRANS_DATE" label="結算日期" />
          <el-table-column
            align="center"
            prop="TRANS_CASH"
            sortable
            :formatter="amountFormatter"
            label="實際交易金額"
          />
          <el-table-column align="center" prop="TRANS_TYPE" label="交易類別" />
          <el-table-column align="center" prop="voucherDep" label="部門代號" />
          <el-table-column align="center" label="明細" width="120" fixed="right">
            <template v-slot="scope">
              <el-button @click="openDetailDialog(scope)">查看明細</el-button>
            </template>
          </el-table-column>
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
            <strong>
              {{ totalSystemFlow.toLocaleString('en', { minimumFractionDigits: 0 }) }}
            </strong>
          </span>
          <span>
            &nbsp;帳差&nbsp;$
            <strong :class="dynamicDiscrepancyClass">
              {{ discrepancy ? discrepancy.toLocaleString('en', { minimumFractionDigits: 0 }) : 0 }}
            </strong>
          </span>
        </p>

        <el-table
          :data="systemFlow"
          :row-style="{ height: '50px' }"
          height="450"
        >
          <el-table-column align="center" prop="parkName" label="場站名稱" />
          <el-table-column align="center" prop="trx_date" label="入帳日" />
          <el-table-column
            align="center"
            prop="s_amount"
            sortable
            :formatter="amountFormatter"
            label="入帳金額"
            width="110"
          />
          <el-table-column
            align="center"
            prop="trade_amount"
            sortable
            :formatter="amountFormatter"
            label="交易金額"
            width="110"
          />
          <el-table-column
            align="center"
            prop="tn_amount"
            sortable
            :formatter="amountFormatter"
            label="手續費"
            width="110"
          />
          <el-table-column align="center" prop="voucherDep" label="部門代號" width="100" />
        </el-table>
      </div>
      <!-- 繳費端明細 dialog -->
      <el-dialog
        v-model="dialogTableVisible"
        :close-on-click-modal="false"
        align="center"
        width="70vw"
      >
        <template #header>
          <div>繳費明細 - {{ checkDetail.TRANS_TYPE }}</div>
        </template>
        <el-table :data="apsDetails" height="500">
          <el-table-column align="center" prop="parkName" label="場站" />
          <el-table-column align="center" property="TRANS_DATE" label="交易日" width="210">
            <template v-slot="scope">
              <div class="d-flex justify-content-between">
                <el-date-picker
                  class="align-self-stretch"
                  v-model="scope.row.TRANS_DATE"
                  type="date"
                  placeholder="請選擇交易日期"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                  :disabled-date="disabledDate"
                  :clearable="false"
                />
                <el-button @click="handleDetailChange(scope.row)">確認</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            property="TRANS_CASH"
            label="實際交易金額"
            sortable
            :formatter="amountFormatter"
          />
          <el-table-column align="center" prop="voucherDep" label="部門代號" />

          <el-table-column align="center" label="刪除">
            <template v-slot="scope">
              <el-button type="danger" @click="openDeleteDetailDialog(scope.row)">刪除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-button type="success" class="mt-2" @click="openSystemDiolog()">新增繳費資料</el-button> -->
        <!-- 刪除交易明細 dialog -->
        <el-dialog
          v-model="deleteDetailDialogVisible"
          :close-on-click-modal="false"
          title="刪除交易明細"
          width="500"
          center
          align-center
        >
          <div class="d-flex flex-column">
            <div class="row mb-2 justify-content-center">
              <div class="col-3 text-end">場站：</div>
              <div class="col-4 text-start fw-bold">{{ deleteDetailData.parkName }}</div>
            </div>
            <div class="row mb-2 justify-content-center">
              <div class="col-3 text-end">交易日期：</div>
              <div class="col-4 text-start fw-bold">{{ deleteDetailData.TRANS_DATE }}</div>
            </div>
            <div class="row mb-2 justify-content-center">
              <div class="col-3 text-end">實際交易金額：</div>
              <div class="col-4 text-start fw-bold">{{ deleteDetailData.TRANS_CASH }}</div>
            </div>
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="deleteDetailDialogVisible = false">取消</el-button>
              <el-button type="danger" @click="deleteDetail">確認刪除</el-button>
            </div>
          </template>
        </el-dialog>
        <!-- 刪除交易明細 dialog -->
      </el-dialog>
      <!-- 交易明細 dialog -->
    </div>
  </div>
</template>

<script>
import { ElLoading } from 'element-plus'

import { API } from '@/App.vue'
export default {
  data() {
    return {
      disabledDate(time) {
        return time.getTime() > Date.now()
      },
      searchData: {
        date: '',
        parkId: ''
      },
      carParks: [],
      //  繳費端資料
      apsData: [],
      countAps: null,
      totalAps: null,
      apsDetails: [],
      //   系統端資料
      systemFlow: [],
      countSystemFlow: null,
      totalSystemFlow: null,

      discrepancy: null,
      dialogTableVisible: false,
      modifyApsDetailData: {
        id: '',
        date: ''
      },
      deleteDetailDialogVisible: false,
      deleteDetailData: null,
      transferData: []
    }
  },
  methods: {
    showLoading(text = '載入中...') {
      return ElLoading.service({
        lock: true,
        text: text,
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    getCarParkData() {
      const getCarParkDataApi = `${API}/main/searchCarPark`
      this.axios.get(getCarParkDataApi).then((response) => {
        if (response.data.returnCode == 0) {
          this.carParks = response.data.data
        }
      })
    },
    show() {
      if (this.searchData.date !== '' && this.searchData.parkId !== '') {
        this.compare()
      } else {
        alert('搜尋欄位不得為空')
      }
    },
    compare() {
      const loading = this.showLoading('載入中...')
      Promise.all([this.getApsStatement(), this.getSystemFlow()]).then(() => {
        this.discrepancy = this.totalSystemFlow - this.totalAps
        loading.close()
      })
    },
    async getApsStatement() {
      this.apsData = [
        {
          TRANS_DATE: '2024-05-30',
          parkId: 64,
          TRANS_TYPE: '悠遊卡',
          TRANS_CASH: '750',
          parkName: '台中正心立體',
          voucherDep: '00018024'
        },
        {
          TRANS_DATE: '2024-05-30',
          parkId: 64,
          TRANS_TYPE: 'cash',
          TRANS_CASH: '4025',
          parkName: '台中正心立體',
          voucherDep: '00018024'
        },
        {
          TRANS_DATE: '2024-05-30',
          parkId: 64,
          TRANS_TYPE: 'linepay',
          TRANS_CASH: '2315',
          parkName: '台中正心立體',
          voucherDep: '00018024'
        },
        {
          TRANS_DATE: '2024-05-30',
          parkId: 64,
          TRANS_TYPE: 'jkopay',
          TRANS_CASH: '340',
          parkName: '台中正心立體',
          voucherDep: '00018024'
        },
        {
          TRANS_DATE: '2024-05-30',
          parkId: 64,
          TRANS_TYPE: 'easycard',
          TRANS_CASH: '15',
          parkName: '台中正心立體',
          voucherDep: '00018024'
        },
        {
          TRANS_DATE: '2024-05-30',
          parkId: 64,
          TRANS_TYPE: '日結帳',
          TRANS_CASH: '0',
          parkName: '台中正心立體',
          voucherDep: '00018024'
        }
      ]
      this.apsData = this.apsData.map((item) => ({
        ...item,
        TRANS_CASH: Number(item.TRANS_CASH) // 將字串轉換為數值
      }))
      this.countAps = 6
      this.totalAps = 7620
    },
    async getSystemFlow() {
      this.systemFlow = [
        {
          trx_date: '2024-05-30',
          parkId: 64,
          parkName: '台中正心立體',
          trade_amount: '750',
          tn_amount: 0,
          s_amount: 750,
          bankMemo: '悠遊卡公司',
          voucherDep: '00018024',
          voucherNum: '1123.30',
          handlingCharge: null
        },
        {
          trx_date: '2024-05-30',
          parkId: 64,
          parkName: '台中正心立體',
          trade_amount: '105',
          tn_amount: 2,
          s_amount: 103,
          bankMemo: 'iPASS MONEY',
          voucherDep: '00018024',
          voucherNum: '1123.60',
          handlingCharge: null
        },
        {
          trx_date: '2024-05-30',
          parkId: 64,
          parkName: '台中正心立體',
          trade_amount: '2370',
          tn_amount: 55,
          s_amount: 2315,
          bankMemo: '國泰世華商連加',
          voucherDep: '00018024',
          voucherNum: '1123.60',
          handlingCharge: '0.022'
        }
      ]
      this.systemFlow = this.systemFlow.map((item) => ({
        ...item,
        trade_amount: Number(item.trade_amount) // 將字串轉換為數值
      }))
      this.countSystemFlow = 3
      this.totalSystemFlow = 6983
    },
    openDetailDialog(scope) {
      const loading = this.showLoading('載入中...')
      this.checkDetail = scope.row
      this.getDetail()
        .then(() => {
          this.dialogTableVisible = true
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    async getDetail() {
      this.apsDetails = [
        {
          id: 3059,
          TRANS_DATE: '2024-05-29',
          parkId: 64,
          TRANS_TYPE: '悠遊卡',
          TRANS_CASH: 15,
          parkName: '台中正心立體',
          voucherDep: '00018024'
        },
        {
          id: 3060,
          TRANS_DATE: '2024-05-29',
          parkId: 64,
          TRANS_TYPE: '悠遊卡',
          TRANS_CASH: 120,
          parkName: '台中正心立體',
          voucherDep: '00018024'
        },
        {
          id: 3067,
          TRANS_DATE: '2024-05-29',
          parkId: 64,
          TRANS_TYPE: '悠遊卡',
          TRANS_CASH: 60,
          parkName: '台中正心立體',
          voucherDep: '00018024'
        },
        {
          id: 3074,
          TRANS_DATE: '2024-05-29',
          parkId: 64,
          TRANS_TYPE: '悠遊卡',
          TRANS_CASH: 30,
          parkName: '台中正心立體',
          voucherDep: '00018024'
        }
      ]
    },
    handleDetailChange(row) {
      this.modifyApsDetailData.id = row.id
      this.modifyApsDetailData.date = row.TRANS_DATE
      console.log(this.modifyApsDetailData)
    },
    openDeleteDetailDialog(scope) {
      this.deleteDetailDialogVisible = true
      this.deleteDetailData = scope
    },
    deleteDetail() {
      alert('刪除成功', this.deleteDetailData)
      console.log('刪除成功', this.deleteDetailData.id)
      this.getDetail()
      this.deleteDetailDialogVisible = false
    }
  },
  mounted() {
    this.getCarParkData()
  },
  computed: {
    // 帳差文字顏色
    dynamicDiscrepancyClass() {
      return this.discrepancy < 0 ? 'text-danger' : 'text-success'
    }
  }
}
</script>

<style>
.mobile-btns {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}
</style>

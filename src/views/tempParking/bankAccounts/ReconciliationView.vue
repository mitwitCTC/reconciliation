<template>
  <div>
    <h2 class="mb-3 text-center">{{ pageTitle }}</h2>
    <form class="row align-items-end">
      <div class="col-lg-3 col-md-12">
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

      <div class="col-lg-2 col-md-12">
        <el-select v-model="searchData.bankMemo" placeholder="金流來源">
          <el-option disabled value="null">金流來源</el-option>
          <el-option v-for="item in cashFlowSources" :key="item" :label="item" :value="item" />
        </el-select>
      </div>

      <div class="col-lg-2 col-md-12">
        <el-select v-model="searchData.bankCode" placeholder="銀行代碼">
          <el-option disabled value="null">銀行代碼</el-option>
          <el-option v-for="item in bankCodeSources" :key="item" :label="item" :value="item" />
        </el-select>
      </div>

      <div class="col-lg-3 col-md-12">
        <el-select v-model="searchData.account" placeholder="銀行來源">
          <el-option disabled value="null">銀行來源</el-option>
          <el-option
            v-for="item in bankAccounts"
            :key="item.account"
            :label="item.account"
            :value="item.account"
          />
        </el-select>
      </div>

      <div class="col-lg-2 col-md-12 mobile-btns">
        <button class="btn btn-sm btn-success" @click.prevent="show">顯示</button>
        <button class="btn btn-sm btn-outline-success" @click.prevent="transfer">轉傳票</button>
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
            <strong>{{ totalBankFlow.toLocaleString('en', { minimumFractionDigits: 0 }) }}</strong>
          </span>
        </p>
        <el-table
          :data="bankFlow"
          :row-style="{ height: '50px' }"
          :row-class-name="customRowClassName"
          height="450"
        >
          <el-table-column align="center" prop="parkName" label="場站名稱" />
          <el-table-column align="center" prop="accountDate" label="入帳日" />
          <el-table-column
            align="center"
            prop="amount"
            sortable
            :formatter="amountFormatter"
            label="入帳金額"
            width="110"
          />
          <el-table-column align="center" prop="bankmark" label="備註" />
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
          :row-class-name="customSystemRowClassName"
          height="450"
        >
          <el-table-column align="center" prop="parkName" label="場站名稱" width="180" />
          <el-table-column align="center" prop="adjust_date" label="入帳日" width="210">
            <template v-slot="scope">
              <div class="d-flex justify-content-between">
                <el-date-picker
                  class="align-self-stretch"
                  style="width: 100%"
                  v-model="scope.row.adjust_date"
                  type="date"
                  placeholder="請選擇入帳日期"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                  :disabled-date="disabledDate"
                  :clearable="false"
                />
                <el-button @click="handleSystemFlowChange(scope.row)">確認</el-button>
              </div>
            </template>
          </el-table-column>
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
          <el-table-column align="center" prop="transactionCode" label="交易代號" width="100" />
          <el-table-column align="center" prop="department" label="部門" width="100" />
          <el-table-column align="center" label="明細" width="120" fixed="right">
            <template v-slot="scope">
              <el-button @click="openDetailDialog(scope)">查看明細</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="success" class="mt-4" style="width: 100%" @click="openSystemDiolog()">
          新增系統帳資料
        </el-button>
      </div>
      <!-- 新增系統帳 dialog -->
      <el-dialog
        v-model="dialogSystemVisible"
        title="新增系統帳資料"
        center
        title-class="dialog-title"
      >
        <el-form
          style="max-width: 500px; text-align: center; margin: 0 auto"
          label-width="120px"
          label-position="right"
          ref="searchCashFlowDataForm"
          :model="searchCashFlowData"
          :rules="searchCashFlowDataRules"
        >
          <el-form-item label="銀行帳號" prop="bankId">
            <el-select
              v-model="searchCashFlowData.bankId"
              placeholder="請選擇銀行帳號"
              size="large"
              @change="getSearchCashFlowData"
            >
              <el-option
                v-for="item in searchInfo.bank"
                :key="item.id"
                :label="item.bankCode + item.account"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="場站" prop="parkId">
            <el-select
              v-model="searchCashFlowData.parkId"
              placeholder="請先選擇銀行帳號"
              size="large"
            >
              <el-option
                v-for="item in carParkOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="金流來源" prop="cashflowClassId">
            <el-select
              v-model="searchCashFlowData.cashflowClassId"
              placeholder="請先選擇銀行帳號"
              size="large"
              @change="searchCashFlowId"
            >
              <el-option
                v-for="item in cashflowClassOptions"
                :key="item.id"
                :label="item.casedescribe"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-form
          style="max-width: 500px; text-align: center; margin: 0 auto"
          label-width="120px"
          label-position="right"
          ref="addSystemForm"
          :model="addSystemData"
          :rules="systemFormRules"
        >
          <el-form-item label="支付交易代號" label-position="right" prop="trx_seq">
            <el-input
              v-model="addSystemData.trx_seq"
              placeholder="請輸入支付交易代號"
              type="text"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="交易日" label-position="right" prop="trx_date">
            <el-date-picker
              v-model="addSystemData.trx_date"
              type="date"
              placeholder="請選擇交易日"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              :disabled-date="disabledDate"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item label="入帳日" label-position="right" prop="scheduled_date">
            <el-date-picker
              v-model="addSystemData.scheduled_date"
              type="date"
              placeholder="請選擇入帳日"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              :disabled-date="disabledDate"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item label="交易金額" label-position="right" prop="trade_amount">
            <el-input
              v-model="addSystemData.trade_amount"
              placeholder="請輸入交易金額"
              type="number"
              min="1"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="手續費" label-position="right" prop="tn_amount">
            <el-input
              v-model="addSystemData.tn_amount"
              placeholder="請輸入手續費"
              type="number"
              min="1"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="入帳金額" label-position="right" prop="s_amount">
            <el-input
              v-model="addSystemData.s_amount"
              placeholder="請輸入入帳金額"
              type="number"
              min="1"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="addSystem">確認</el-button>
            <el-button @click="cancelAddSystem">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 新增系統帳 dialog -->
      <!-- 交易明細 dialog -->
      <el-dialog
        v-model="dialogTableVisible"
        :close-on-click-modal="false"
        align="center"
        width="70vw"
      >
        <template #header>
          <div>
            交易明細 - {{ checkDetail.parkName }}
          </div>
        </template>
        <el-table :data="systemFlowDetails" height="500">
          <el-table-column align="center" property="outDate" label="入帳日期" width="210">
            <template v-slot="scope">
              <div class="d-flex justify-content-between">
                <el-date-picker
                  class="align-self-stretch"
                  v-model="scope.row.adjust_date"
                  type="date"
                  placeholder="請選擇入帳日期"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                  :disabled-date="disabledDate"
                  :clearable="false"
                />
                <el-button @click="handleDetailAmountChange(scope.row)">確認</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            property="s_amount"
            label="入帳金額"
            sortable
            :formatter="amountFormatter"
          />
          <el-table-column
            align="center"
            property="trade_amount"
            label="交易金額"
            sortable
            :formatter="amountFormatter"
          />
          <el-table-column
            align="center"
            property="tn_amount"
            label="手續費"
            sortable
            :formatter="amountFormatter"
          />
          <el-table-column align="center" label="刪除">
            <template v-slot="scope">
              <el-button type="danger" @click="openDeleteDetailDialog(scope.row)">刪除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="success" class="mt-2" @click="openSystemDiolog()">新增交易明細</el-button>
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
              <div class="col-3 text-end">入帳日期：</div>
              <div class="col-4 text-start fw-bold">{{ deleteDetailData.adjust_date }}</div>
            </div>
            <div class="row mb-2 justify-content-center">
              <div class="col-3 text-end">入帳金額：</div>
              <div class="col-4 text-start fw-bold">{{ deleteDetailData.s_amount }}</div>
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
        bankMemo: '',
        account: ''
      },
      // 搜尋條件來源
      searchOrigin: [],
      // 金流來源 cashFlowSources bankMemo欄位
      cashFlowSources: [],
      // 銀行代號來源 bankCode
      bankCodeSources: [],
      //   銀行來源 bankAccounts
      bankAccounts: [],
      isComparing: false,
      bankFlow: [],
      countBankFlow: null,
      totalBankFlow: null,
      systemFlow: [],
      countSystemFlow: null,
      totalSystemFlow: null,
      discrepancy: null,
      dialogSystemVisible: false,
      searchInfo: {
        bank: [],
        park: [],
        cashflowClass: []
      },
      carParkOptions: [],
      cashflowClassOptions: [],
      searchCashFlowData: {
        bankId: '',
        parkId: '',
        cashflowClassId: ''
      },
      addSystemData: {
        trx_seq: '', // 支付交易代號
        trx_date: '', // 交易日
        scheduled_date: '', // 入帳日
        trade_amount: '', // 交易金額
        tn_amount: '', // 手續費
        s_amount: '', // 實付金額 (入帳金額)
        cashFlowId: ''
      },
      modifySystemData: {
        type: 1,
        adjust_date: '',
        date: '',
        bankCode: '',
        account: '',
        voucherDep: '',
        bankMemo: ''
      },
      modifySystemDetailData: {
        type: 2,
        adjust_date: '',
        id: ''
      },
      searchCashFlowDataRules: {
        bankId: [{ required: true, message: '請選擇銀行', trigger: 'change' }],
        parkId: [{ required: true, message: '請選擇場站', trigger: 'change' }],
        cashflowClassId: [{ required: true, message: '請選擇金流分類', trigger: 'change' }]
      },
      systemFormRules: {
        trx_date: [{ required: true, message: '請選擇交易日', trigger: 'blur' }],
        scheduled_date: [{ required: true, message: '請選擇入帳日', trigger: 'blur' }],
        trade_amount: [{ required: true, message: '請輸入交易金額', trigger: 'blur' }],
        tn_amount: [{ required: true, message: '請輸入手續費金額', trigger: 'blur' }],
        s_amount: [{ required: true, message: '請輸入實際入帳金額', trigger: 'blur' }]
      },
      dialogTableVisible: false,
      systemFlowDetails: [],
      dialogVisible: false,
      checkDetail: null,
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
    getSearchOrigin() {
      const getSearchOriginApi = `${API}/main/querycCondition`
      this.axios.get(getSearchOriginApi).then((response) => {
        if (response.data.returnCode == 0) {
          this.searchOrigin = response.data.data
          this.getCashFlowSources()
          this.getBankAccountSources()
        }
      })
    },
    // 金流來源選項
    getCashFlowSources() {
      this.cashFlowSources = [...new Set(this.searchOrigin.map((item) => item.bankMemo))]
    },
    // 銀行來源選項
    getBankAccountSources() {
      this.bankCodeSources = [...new Set(this.searchOrigin.map((item) => item.bankCode))]
      const uniqueBankAccounts = {}
      this.bankAccounts = this.searchOrigin.reduce((acc, item) => {
        const account = item.account
        const name = item.name.trim()
        const key = `${name}-${account}`
        if (!uniqueBankAccounts[key]) {
          uniqueBankAccounts[key] = true
          acc.push({ name, account })
        }
        return acc
      }, [])
      this.searchData.bankCode = this.bankCodeSources[0]
    },
    show() {
      if (
        this.searchData.date !== '' &&
        this.searchData.bankMemo !== '' &&
        this.searchData.bankCode !== '' &&
        this.searchData.account !== ''
      ) {
        this.compare()
      } else {
        alert('搜尋欄位不得為空！')
      }
    },
    async getBankFlow() {
      const getBankFlowApi = `${API}/main/bankStatement`
      return this.axios.post(getBankFlowApi, this.searchData).then((response) => {
        if (response.data.returnCode == 0) {
          this.bankFlow = response.data.data.transaction
          this.countBankFlow = response.data.data.totalCount
          this.totalBankFlow = response.data.data.totalAmount
          this.bankFlow = response.data.data.transaction.map((item) => ({
            ...item,
            amount: Number(item.amount) // 將字串轉換為數值
          }))
        }
      })
    },
    async getSystemFlow() {
      const getSystemFlowAPI = `${API}/main/systemStatement`
      return this.axios.post(getSystemFlowAPI, this.searchData).then((response) => {
        if (response.data.returnCode == 0) {
          this.systemFlow = response.data.data.paymentTrade
          this.countSystemFlow = response.data.data.totalCount
          this.totalSystemFlow = response.data.data.totalAmount
          this.systemFlow = response.data.data.paymentTrade.map((item) => ({
            ...item,
            trade_amount: Number(item.trade_amount) // 將字串轉換為數值
          }))
        }
      })
    },
    // 修改系統帳入帳日
    handleSystemFlowChange(row) {
      this.modifySystemData.date = this.searchData.date
      this.modifySystemData.adjust_date = row.adjust_date
      this.modifySystemData.bankCode = this.searchData.bankCode
      this.modifySystemData.account = this.searchData.account
      this.modifySystemData.bankMemo = this.searchData.bankMemo
      this.modifySystemData.voucherDep = row.voucherDep
      const systemFlowChangeApi = `${API}/main/updateDate`
      this.axios
      .post(systemFlowChangeApi, this.modifySystemData)
      .then((response) => {
        if (response.data.data.id.length > 0) {
          alert('修改成功')
          this.getSystemFlow()
        }
      })
    },
    openSystemDiolog() {
      this.dialogSystemVisible = true
      if (this.searchData.date !== '') {
        this.addSystemData.scheduled_date = this.searchData.date
      }
      this.getSearchInfo()
    },
    // 取得銀行、場站、金流所有列表
    getSearchInfo() {
      const getSearchInfoApi = `${API}/main/searchInfo`
      this.axios.get(getSearchInfoApi).then((response) => {
        if (response.data.returnCode == 0) {
          this.searchInfo = response.data.data
        }
      })
    },
    // 根據選擇的 bank 的 companyId 來篩選 carPark、cashflowClass
    getSearchCashFlowData() {
      const selectedBank = this.searchInfo.bank.find(
        (item) => item.id === this.searchCashFlowData.bankId
      )

      if (!selectedBank) {
        return
      }

      const companyId = selectedBank.companyId

      this.carParkOptions = this.searchInfo.carPark.filter((item) => item.companyId === companyId)

      this.cashflowClassOptions = this.searchInfo.cashflowClass.filter(
        (item) => item.companyId === companyId
      )

      // 重置 parkId 和 cashflowClassId
      this.searchCashFlowData.parkId = null
      this.searchCashFlowData.cashflowClassId = null
    },
    // 查詢金流的代號
    searchCashFlowId() {
      this.$refs.searchCashFlowDataForm.validate((valid) => {
        if (valid) {
          const searchCashFlowApi = `${API}/main/searchCashFlowId`
          this.axios.post(searchCashFlowApi, this.searchCashFlowData).then((response) => {
            this.addSystemData.cashFlowId = response.data.data[0].id
          })
        }
      })
    },
    addSystem() {
      this.searchCashFlowId()
      this.$refs.addSystemForm.validate((valid) => {
        if (valid) {
          const addSystemApi = `${API}/main/manuallyInsert`
          this.axios
          .post(addSystemApi, this.addSystemData)
          .then((response) => {
            if (response.data.return == 0) {
              alert('新增成功')
              this.searchCashFlowData = {}
              this.addSystemData = {}
              this.$refs.addSystemForm.clearValidate()
              this.$refs.searchCashFlowDataForm.clearValidate()
              this.dialogSystemVisible = false
              this.compare()
              if (this.dialogTableVisible) {
                this.getDetail()
              }
            }
          })
        }
      })
    },
    cancelAddSystem() {
      this.addSystemData = {}
      this.searchCashFlowData = {}
      this.dialogSystemVisible = false
      this.$refs.addSystemForm.clearValidate()
      this.$refs.searchCashFlowDataForm.clearValidate()
    },
    compare() {
      const loading = this.showLoading('比對中...')
      Promise.all([this.getBankFlow(), this.getSystemFlow()])
        .then(() => {
          this.discrepancy = this.totalSystemFlow - this.totalBankFlow
          loading.close()
          const matchedAmounts = new Set()

          this.bankFlow.forEach((bankItem) => {
            const matchingSystemFlow = this.systemFlow.find(
              (systemItem) =>
                !matchedAmounts.has(systemItem.s_amount) &&
                systemItem.s_amount === parseInt(bankItem.amount)
            )
            if (matchingSystemFlow) {
              bankItem.parkName = matchingSystemFlow.parkName
              bankItem.parkId = matchingSystemFlow.parkId
              matchedAmounts.add(matchingSystemFlow.s_amount)
            }
          })
        })
        .catch((error) => {
          console.error('error', error)
        })
    },
    customRowClassName({ row }) {
      return row.parkId !== null ? 'bg-success text-white' : ''
    },
    customSystemRowClassName({ row }) {
      const isMatched = this.bankFlow.some(
        (item) => item.parkName === row.parkName && item.adjust_date === row.accountDate
      )
      return isMatched ? 'bg-success text-white' : ''
    },
    openDetailDialog(scope) {
      const loading = this.showLoading('載入中...')
      this.checkDetail = scope.row
      this.searchData.voucherDep = this.checkDetail.voucherDep
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
      const getsystemFlowDetailsApi = `${API}/main/systemDetail`
      return this.axios.post(getsystemFlowDetailsApi, this.searchData).then((response) => {
        if (response.data.returnCode == 0) {
          this.systemFlowDetails = response.data.data
          this.systemFlowDetails = response.data.data.map((item) => ({
            ...item,
            trade_amount: Number(item.trade_amount) // 將字串轉換為數值
          }))
        }
      })
    },
    // 修改系統帳明細入帳日
    handleDetailAmountChange(row) {
      if ((row.outDate !== null) & (row.amount !== '')) {
        this.modifySystemDetailData.adjust_date = row.adjust_date
        this.modifySystemDetailData.id = row.id
        const detailAmountChangeApi = `${API}/main/updateDate`
        this.axios
        .post(detailAmountChangeApi, this.modifySystemDetailData)
        .then((response) => {
          if (response.data.data.id != "") {
            alert('修改成功')
            this.getDetail()
            this.getSystemFlow()
          }
        })
      } else {
        alert('修改欄位不得為空！')
      }
    },
    openDeleteDetailDialog(scope) {
      this.deleteDetailDialogVisible = true
      this.deleteDetailData = scope
    },
    deleteDetail() {
      const deleteDetailApi = `${API}/main/deleteDetail`
      this.axios
      .post(deleteDetailApi, {id: this.deleteDetailData.id})
      .then((response) => {
        if (response.data.returnCode == 0) {
          alert('刪除明細成功～')
          this.getDetail()
          this.getSystemFlow()
          this.deleteDetailDialogVisible = false
        }
        else {
          alert("刪除失敗！")
          this.deleteDetailDialogVisible = false
        }
      })
    },
    transfer() {
      this.transferData = this.bankFlow.filter((e) => e.parkId != null)
      if (this.transferData.length > 0) {
        this.bankFlow = this.bankFlow.filter((e) => e.parkId == null)
        alert('完成轉傳票')
        console.log('轉傳票', this.transferData)
        this.compare()
      } else {
        alert('無可以轉傳票的資料！')
      }
    }
  },
  mounted() {
    this.getSearchOrigin()
  },
  watch: {
    'searchCashFlowData.bankId'(newValue, oldValue) {
      if (newValue !== null && newValue !== oldValue) {
        this.getSearchCashFlowData()
      }
    }
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

.el-table__body tr.bg-success:hover > td,
.el-table__body tr.bg-success:hover {
  background-color: #6fc5ab !important;
  border-color: #6fc5ab !important;
  color: #000000 !important;
}

.mobile-btns {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.el-dialog__title {
  --el-dialog-title-font-size: 28px;
}
</style>

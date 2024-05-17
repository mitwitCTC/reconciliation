<template>
  <div>
    <h1 class="mb-3 text-center">對帳系統</h1>
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
          :clearable="false"
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
          <el-table-column align="center" prop="postingDate" label="入帳日" width="210">
            <template v-slot="scope">
              <div class="d-flex justify-content-between">
                <el-date-picker
                  class="align-self-stretch"
                  style="width: 100%"
                  v-model="scope.row.postingDate"
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
        :fullscreen="true"
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
              @select="getSearchCashFlowData"
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
              @select="searchCashFlow"
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
        title="交易明細"
        width="70vw"
      >
        <el-table :data="systemFlowDetails" height="500">
          <el-table-column align="center" property="outDate" label="入帳日期">
            <template v-slot="scope">
              <el-date-picker
                class="align-self-stretch"
                v-model="scope.row.outDate"
                type="date"
                placeholder="請選擇入帳日期"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
                :disabled-date="disabledDate"
                :clearable="false"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" property="transactionTime" label="交易時間" sortable />
          <el-table-column
            align="center"
            property="amount"
            label="金額"
            sortable
            :formatter="amountFormatter"
          />
          <!-- <template v-slot="scope">
              <el-input
                v-model="scope.row.amount"
                @keyup.enter="handleDetailAmountChange(scope.row)"
                :min="0"
                :step="5"
                type="number"
              />
            </template>
          </el-table-column> -->
          <el-table-column align="center" label="調整">
            <template v-slot="scope">
              <el-button @click="handleDetailAmountChange(scope.row)">確認調整</el-button>
            </template>
          </el-table-column>
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
              <div class="col-4 text-start fw-bold">{{ deleteDetailData.outDate }}</div>
            </div>
            <div class="row mb-2 justify-content-center">
              <div class="col-3 text-end">交易時間：</div>
              <div class="col-4 text-start fw-bold">{{ deleteDetailData.transactionTime }}</div>
            </div>
            <div class="row mb-2 justify-content-center">
              <div class="col-3 text-end">交易金額：</div>
              <div class="col-4 text-start fw-bold">{{ deleteDetailData.amount }}</div>
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
          station: '富岡停一停車場',
          department: '部門一'
        },
        {
          id: 98,
          postingDate: '2024-01-01',
          transactionAmount: 915,
          fee: 15,
          depositAmount: 900,
          transactionCode: 'y22222222',
          station: '南崁廣停一',
          department: '部門二'
        },
        {
          id: 119,
          postingDate: '2024-01-01',
          transactionAmount: 1315,
          fee: 15,
          depositAmount: 1300,
          transactionCode: 'y33333333',
          station: '瑞芳消防分隊營業所',
          department: '部門一'
        },
        {
          id: 191,
          postingDate: '2024-01-01',
          transactionAmount: 515,
          fee: 15,
          depositAmount: 500,
          transactionCode: 'y44444444',
          station: '桃園停三',
          department: '部門一'
        },
        {
          id: 199,
          postingDate: '2024-01-01',
          transactionAmount: 515,
          fee: 15,
          depositAmount: 500,
          transactionCode: 'y55555555',
          station: '桃園停一',
          department: '部門二'
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
    handleSystemFlowChange(row) {
      alert('修改成功')
      console.log(row)
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
      this.searchInfo = {
        bank: [
          {
            id: 1,
            name: '力揚彰銀臨停',
            bankCode: '009',
            account: '41150119912400',
            companyId: 1,
            voucherNum: '1112.21',
            isConnection: '0',
            message: null
          },
          {
            id: 2,
            name: '汎揚彰銀臨停',
            bankCode: '009',
            account: '41150128015700',
            companyId: 2,
            voucherNum: '1112.26',
            isConnection: '0',
            message: null
          },
          {
            id: 3,
            name: '花果山玉山臨停',
            bankCode: '',
            account: '',
            companyId: 3,
            voucherNum: null,
            isConnection: '0',
            message: null
          }
        ],
        carPark: [
          {
            id: 1,
            name: '信義國中',
            companyId: 1,
            voucherDep: '00013021',
            userId: null
          },
          {
            id: 2,
            name: '重陽',
            companyId: 1,
            voucherDep: '00018010',
            userId: null
          },
          {
            id: 3,
            name: '板橋第一',
            companyId: 1,
            voucherDep: '00015008',
            userId: null
          },
          {
            id: 95,
            name: '龜山龍華',
            companyId: 2,
            voucherDep: '00011052',
            userId: null
          },
          {
            id: 96,
            name: '創新二期',
            companyId: 2,
            voucherDep: '00011053',
            userId: null
          },
          {
            id: 97,
            name: '龜山建國一村',
            companyId: 2,
            voucherDep: '00011051',
            userId: null
          },
          {
            id: 101,
            name: '中壢天晟',
            companyId: 3,
            voucherDep: '00015024',
            userId: null
          },
          {
            id: 102,
            name: '楊梅天成',
            companyId: 3,
            voucherDep: '00015005',
            userId: null
          },
          {
            id: 103,
            name: '金色年代(延平)',
            companyId: 3,
            voucherDep: '00015031',
            userId: null
          },
          {
            id: 107,
            name: '力揚-龍潭分館停車場',
            companyId: 1,
            voucherDep: '00012035',
            userId: null
          },
          {
            id: 108,
            name: '力揚-埔心車站後站機車停車場',
            companyId: 1,
            voucherDep: '00018006',
            userId: null
          }
        ],
        cashflowClass: [
          {
            id: 1,
            casedescribe: 'linepayMoney',
            companyId: 1,
            connectionId: 4,
            terms: '',
            bankMemo: 'iPASS MONEY',
            voucherNum: '1123.60',
            voucherDesc: '一卡通',
            message: null
          },
          {
            id: 2,
            casedescribe: 'linepay',
            companyId: 1,
            connectionId: 7,
            terms: '',
            bankMemo: '國泰世華商連加',
            voucherNum: '1123.60',
            voucherDesc: '連加',
            message: null
          },
          {
            id: 3,
            casedescribe: '悠遊卡A',
            companyId: 1,
            connectionId: 0,
            terms: '',
            bankMemo: '悠遊卡公司',
            voucherNum: '1123.30',
            voucherDesc: '悠遊卡',
            message: '悠遊卡舊系統'
          },
          {
            id: 4,
            casedescribe: '悠遊卡B',
            companyId: 1,
            connectionId: 1,
            terms: '',
            bankMemo: '悠遊卡公司',
            voucherNum: '1123.30',
            voucherDesc: '悠遊卡',
            message: '悠遊卡新系統'
          },
          {
            id: 5,
            casedescribe: 'linepayMoney',
            companyId: 2,
            connectionId: 5,
            terms: '',
            bankMemo: 'iPASS MONEY',
            voucherNum: '1123.60',
            voucherDesc: '一卡通',
            message: null
          },
          {
            id: 6,
            casedescribe: 'linepay',
            companyId: 2,
            connectionId: 8,
            terms: '',
            bankMemo: '國泰世華商連加',
            voucherNum: '1123.60',
            voucherDesc: '連加',
            message: null
          },
          {
            id: 9,
            casedescribe: 'linepayMoney',
            companyId: 3,
            connectionId: 6,
            terms: '',
            bankMemo: 'iPASS MONEY',
            voucherNum: '1123.60',
            voucherDesc: '一卡通',
            message: null
          },
          {
            id: 10,
            casedescribe: 'linepay',
            companyId: 3,
            connectionId: 9,
            terms: '',
            bankMemo: '國泰世華商連加',
            voucherNum: '1123.60',
            voucherDesc: '連加',
            message: null
          }
        ]
      }
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
    searchCashFlow() {
      this.$refs.searchCashFlowDataForm.validate((valid) => {
        if (valid) {
          console.log('查詢金流的代號', this.searchCashFlowData)
        }
      })
    },
    addSystem() {
      this.$refs.searchCashFlowDataForm.validate((valid) => {
        if (valid) {
          this.$refs.addSystemForm.validate((valid) => {
            this.searchCashFlow()
            if (valid) {
              alert('新增成功')
              console.log('新增系統帳資料', this.addSystemData)
              this.addSystemData = {}
              this.searchCashFlowData = {}
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
      this.checkDetail = scope.row
      this.getDetail()
    },
    getDetail() {
      console.log('查看', this.checkDetail)
      this.systemFlowDetails = [
        {
          outDate: '2024-01-01',
          transactionTime: '12:30:43',
          amount: 80
        },
        {
          outDate: '2024-01-01',
          transactionTime: '14:11:34',
          amount: 120
        },
        {
          outDate: '2024-01-01',
          transactionTime: '16:51:11',
          amount: 160
        },
        {
          outDate: '2024-01-01',
          transactionTime: '18:40:51',
          amount: 160
        },
        {
          outDate: '2024-01-01',
          transactionTime: '18:53:20',
          amount: 80
        },
        {
          outDate: '2024-01-01',
          transactionTime: '19:11:45',
          amount: 200
        },
        {
          outDate: '2024-01-01',
          transactionTime: '19:41:38',
          amount: 160
        },
        {
          outDate: '2024-01-01',
          transactionTime: '20:28:54',
          amount: 40
        },
        {
          outDate: '2024-01-01',
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
    openDeleteDetailDialog(scope) {
      this.deleteDetailDialogVisible = true
      this.deleteDetailData = scope
    },
    deleteDetail() {
      alert('刪除明細成功～')
      this.getDetail()
      console.log('刪除了這一筆明細', this.deleteDetailData)
      this.deleteDetailDialogVisible = false
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
  },
  watch: {
    'searchCashFlowData.bankId'(newValue, oldValue) {
      if (newValue !== null && newValue !== oldValue) {
        this.getSearchCashFlowData()
      }
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

.mobile-btns {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.el-dialog__title {
  --el-dialog-title-font-size: 28px;
}
</style>
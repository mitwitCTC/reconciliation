<template>
  <div class="container">
    <div class="d-flex justify-content-center align-items-center">
      <h2 class="flex-grow-1 text-center">{{ pageTitle }}</h2>
      <el-button class="ms-auto" @click="openCompanyDialog()">新增</el-button>
    </div>

    <el-table :data="companies" height="600">
      <el-table-column align="center" prop="name" label="公司名稱" />
      <el-table-column align="center" prop="taxNumber" label="統編" />
      <el-table-column align="center" prop="receiptTitle" label="抬頭" />
      <el-table-column align="center" prop="monthlyBank" label="月租銀行" />
      <el-table-column align="center" prop="accountNumber" label="銀行專案代號" />
      <el-table-column align="center" label="修改" fixed="right">
        <template v-slot="scope">
          <el-button @click="openCompanyDialog(scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="刪除" fixed="right">
        <template v-slot="scope">
          <el-button type="danger" @click="openDeleteCompanyDialog(scope.row)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500" center>
      <el-form
        :model="currentCompany"
        label-width="auto"
        :rules="companiesFormRules"
        ref="eidtCompanyForm"
      >
        <el-form-item label="公司名稱" prop="name">
          <el-input v-model="currentCompany.name"></el-input>
        </el-form-item>
        <el-form-item label="統編" prop="taxNumber">
          <el-input v-model="currentCompany.taxNumber" type="number"></el-input>
        </el-form-item>
        <el-form-item label="抬頭" prop="receiptTitle">
          <el-input v-model="currentCompany.receiptTitle"></el-input>
        </el-form-item>
        <el-form-item label="月租銀行" prop="monthlyBank">
          <el-input v-model="currentCompany.monthlyBank"></el-input>
        </el-form-item>
        <el-form-item label="銀行專案代號" prop="accountNumber">
          <el-input v-model="currentCompany.accountNumber"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer d-flex justify-content-end">
        <el-button @click="cancelSaveCompany">取消</el-button>
        <el-button type="primary" @click="saveCompany">確定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-model="deleteCompanyDialogVisible"
      :close-on-click-modal="false"
      title="刪除公司基本資料"
      width="500"
      center
    >
      <div class="d-flex flex-column">
        <div class="row mb-2 justify-content-center">
          <div class="col-3 text-end">公司名稱</div>
          <div class="col-4 text-start fw-bold">{{ deleteCompanyData.name }}</div>
        </div>
        <div class="row mb-2 justify-content-center">
          <div class="col-3 text-end">統編</div>
          <div class="col-4 text-start fw-bold">{{ deleteCompanyData.taxNumber }}</div>
        </div>
        <div class="row mb-2 justify-content-center">
          <div class="col-3 text-end">抬頭</div>
          <div class="col-4 text-start fw-bold">{{ deleteCompanyData.receiptTitle }}</div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteCompanyDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteCompany">確認刪除</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { API } from '@/App.vue'

export default {
  data() {
    return {
      pageTitle: '',
      companies: [],
      dialogVisible: false,
      currentCompany: {
        name: '',
        taxNumber: '',
        receiptTitle: '',
        monthlyBank: '',
        accountNumber: ''
      },
      isEditing: false,
      companiesFormRules: {
        name: [{ required: true, message: '請輸入公司名稱', trigger: 'blur' }],
        taxNumber: [
          { required: true, min: 8, max: 8, message: '請輸入正確的統一編號格式', trigger: 'blur' }
        ],
        receiptTitle: [{ required: true, message: '請輸入公司抬頭', trigger: 'blur' }],
        monthlyBank: [{ required: true, message: '請輸入月租銀行', trigger: 'blur' }],
        accountNumber: [{ required: true, message: '請輸入銀行專案代號', trigger: 'blur' }]
      },
      deleteCompanyDialogVisible: false,
      deleteCompanyData: null
    }
  },
  computed: {
    dialogTitle() {
      return this.isEditing ? '修改公司資料' : '新增公司資料'
    }
  },
  mounted() {
    this.getPageTitle()
    this.getCompanyData()
  },
  methods: {
    getPageTitle() {
      this.pageTitle = this.$route.name
    },
    getCompanyData() {
      const getCompanyDataApi = `${API}/main/searchCompanyInfo`
      this.axios.get(getCompanyDataApi).then((response) => {
        this.companies = response.data.data
      })
    },
    openCompanyDialog(company) {
      if (company) {
        // 編輯模式
        this.currentCompany = { ...company }
        this.isEditing = true
      } else {
        // 新增模式
        this.currentCompany = {
          name: '',
          taxNumber: '',
          receiptTitle: '',
          monthlyBank: '',
          accountNumber: ''
        }
        this.isEditing = false
      }
      this.dialogVisible = true
    },
    saveCompany() {
      this.$refs.eidtCompanyForm.validate((valid) => {
        if (valid) {
          if (this.isEditing) {
            const editCompanyApi = `${API}/main/updateCompanyInfo`
            this.axios.post(editCompanyApi, this.currentCompany).then((response) => {
              if (response.data.returnCode == 0) {
                alert(response.data.message)
                this.getCompanyData()
              }
            })
          } else {
            const insertCompanyApi = `${API}/main/insertCompanyInfo`
            this.axios.post(insertCompanyApi, this.currentCompany).then((response) => {
              if (response.data.returnCode == 0) {
                alert(response.data.message)
                this.getCompanyData()
              }
            })
          }
          this.dialogVisible = false
        }
      })
    },
    cancelSaveCompany() {
      this.dialogVisible = false
      this.$refs.eidtCompanyForm.clearValidate()
    },
    openDeleteCompanyDialog(scope) {
      this.deleteCompanyDialogVisible = true
      this.deleteCompanyData = scope
    },
    deleteCompany() {
      const deleteCompanyApi = `${API}/main/deleteCompanyInfo`
      this.axios.post(deleteCompanyApi, { id: this.deleteCompanyData.id }).then((response) => {
        if (response.data.returnCode == 0) {
          alert(response.data.message)
          this.getCompanyData()
          this.deleteCompanyDialogVisible = false
        }
      })
    }
  }
}
</script>

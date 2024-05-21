<template>
  <div class="container">
    <div class="d-flex justify-content-center align-items-center">
      <h2 class="flex-grow-1 text-center">{{ pageTitle }}</h2>
      <el-button class="ms-auto" @click="openCarParkDialog()">新增</el-button>
    </div>

    <el-table :data="carParks" height="600">
      <el-table-column align="center" prop="name" label="場站名稱" />
      <el-table-column align="center" prop="taxNumber" label="統編" />
      <el-table-column align="center" prop="receiptTitle" label="抬頭" />
      <el-table-column align="center" prop="voucherDep" label="部門代號" />
      <el-table-column align="center" prop="userId" label="使用者代號" />
      <el-table-column align="center" label="修改" fixed="right">
        <template v-slot="scope">
          <el-button @click="openCarParkDialog(scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="刪除" fixed="right">
        <template v-slot="scope">
          <el-button type="danger" @click="openDeleteCarParkDialog(scope.row)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500" center>
      <el-form
        :model="currentCarPark"
        label-width="auto"
        :rules="carParkFormRules"
        ref="eidtCarParkForm"
      >
        <el-form-item label="公司名稱" prop="companyId">
          <el-select
            v-model="currentCarPark.companyId"
            placeholder="請選擇公司名稱"
            @change="handleCompanyChange"
          >
            <el-option
              v-for="company in companies"
              :key="company.id"
              :label="company.name"
              :value="company.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="場站名稱" prop="name">
          <el-input v-model="currentCarPark.name"></el-input>
        </el-form-item>
        <el-form-item label="部門代號" prop="voucherDep">
          <el-input v-model="currentCarPark.voucherDep"></el-input>
        </el-form-item>
        <el-form-item label="使用者代號" prop="userId">
          <el-input v-model="currentCarPark.userId"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer d-flex justify-content-end">
        <el-button @click="cancelSaveCarPark">取消</el-button>
        <el-button type="primary" @click="saveCarPark">確定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-model="deleteCarParkDialogVisible"
      :close-on-click-modal="false"
      title="刪除場站基本資料"
      width="500"
      center
    >
      <div class="d-flex flex-column">
        <div class="row mb-2 justify-content-center">
          <div class="col-3 text-end">場站名稱</div>
          <div class="col-4 text-start fw-bold">{{ deleteCarParkData.name }}</div>
        </div>
        <div class="row mb-2 justify-content-center">
          <div class="col-3 text-end">統編</div>
          <div class="col-4 text-start fw-bold">{{ deleteCarParkData.taxNumber }}</div>
        </div>
        <div class="row mb-2 justify-content-center">
          <div class="col-3 text-end">抬頭</div>
          <div class="col-4 text-start fw-bold">{{ deleteCarParkData.receiptTitle }}</div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteCarParkDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteCarPark">確認刪除</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageTitle: '',
      carParks: [],
      dialogVisible: false,
      currentCarPark: {
        name: '',
        companyId: '',
        taxNumber: '',
        receiptTitle: '',
        voucherDep: '',
        userId: ''
      },
      isEditing: false,
      companies: [],
      carParkFormRules: {
        companyId: [{ required: true, message: '請選擇公司名稱', trigger: 'change' }],
        name: [{ required: true, message: '請輸入場站名稱', trigger: 'blur' }],
        voucherDep: [{ required: true, message: '請輸入部門代號 (傳票部份代號)', trigger: 'blur' }],
        userId: [{ required: true, message: '請輸入使用者代碼', trigger: 'blur' }]
      },
      deleteCarParkDialogVisible: false,
      deleteCarParkData: null
    }
  },
  computed: {
    dialogTitle() {
      return this.isEditing ? '修改場站資料' : '新增場站資料'
    }
  },
  mounted() {
    this.getPageTitle()
    this.getCarParkData()
    this.getCompanies()
  },
  methods: {
    getPageTitle() {
      this.pageTitle = this.$route.name
    },
    getCarParkData() {
      this.carParks = [
        {
          id: 1,
          name: '信義國中',
          companyId: 1,
          taxNumber: null,
          receiptTitle: null,
          voucherDep: '00013021',
          userId: null,
          deleteTime: ''
        },
        {
          id: 2,
          name: '重陽',
          companyId: 1,
          taxNumber: null,
          receiptTitle: null,
          voucherDep: '00018010',
          userId: null,
          deleteTime: ''
        },
        {
          id: 3,
          name: '板橋第一',
          companyId: 1,
          taxNumber: null,
          receiptTitle: null,
          voucherDep: '00015008',
          userId: null,
          deleteTime: ''
        },
        {
          id: 4,
          name: '南崁公一',
          companyId: 1,
          taxNumber: null,
          receiptTitle: null,
          voucherDep: '00013006',
          userId: null,
          deleteTime: ''
        }
      ]
      console.log('取場站資料')
    },
    getCompanies() {
      this.companies = [
        {
          id: 1,
          name: '力揚',
          taxNumber: '11111111',
          receiptTitle: '力揚公司',
          monthlyBank: null,
          accountNumber: null,
          deleteTime: '0'
        },
        {
          id: 2,
          name: '汎揚',
          taxNumber: '22222222',
          receiptTitle: '汎揚公司',
          monthlyBank: null,
          accountNumber: null,
          deleteTime: '0'
        },
        {
          id: 3,
          name: '花果山',
          taxNumber: null,
          receiptTitle: null,
          monthlyBank: null,
          accountNumber: null,
          deleteTime: '0'
        }
      ]
    },
    handleCompanyChange(value) {
      // 找到選擇的公司
      const selectedCompany = this.companies.find((company) => company.id === value)
      // 更新 currentCarPark 中的資料
      this.currentCarPark.companyId = selectedCompany.id
      this.currentCarPark.taxNumber = selectedCompany.taxNumber
      this.currentCarPark.receiptTitle = selectedCompany.receiptTitle
    },
    openCarParkDialog(CarPark) {
      if (CarPark) {
        // 編輯模式
        this.isEditing = true
        this.currentCarPark = { ...CarPark }
        // 根據 companyId 匹配 taxNumber、receiptTitle
        const selectedCompany = this.companies.find(
          (company) => company.id === this.currentCarPark.companyId
        )
        this.currentCarPark.taxNumber = selectedCompany.taxNumber
        this.currentCarPark.receiptTitle = selectedCompany.receiptTitle
        console.log('要編輯的場站', this.currentCarPark)
      } else {
        // 新增模式
        this.isEditing = false
        this.currentCarPark = {
          name: '',
          taxNumber: '',
          receiptTitle: ''
        }
      }
      this.dialogVisible = true
    },
    saveCarPark() {
      this.$refs.eidtCarParkForm.validate((valid) => {
        if (valid) {
          if (this.isEditing) {
            console.log('編輯場站', this.currentCarPark)
            this.getCarParkData()
          } else {
            console.log('新增場站', this.currentCarPark)
            this.getCarParkData()
          }
          this.dialogVisible = false
        }
      })
    },
    cancelSaveCarPark() {
      this.dialogVisible = false
      this.$refs.eidtCarParkForm.clearValidate()
    },
    openDeleteCarParkDialog(scope) {
      this.deleteCarParkDialogVisible = true
      this.deleteCarParkData = scope
    },
    deleteCarPark() {
      this.getCarParkData()
      this.deleteCarParkDialogVisible = false
      console.log("刪除場站",this.deleteCarParkData.id)
    }
  }
}
</script>

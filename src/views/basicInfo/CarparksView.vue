<template>
  <div>
    <h2 class="text-center">{{ pageTitle }}</h2>

    <div class="search d-flex justify-content-end align-items-center col-12 col-md-3">
      <el-input v-model="searchQuery" placeholder="請輸入場站名稱" clearable>
        <template #prefix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
    </div>
    <el-table :data="filteredCarParks" height="400">
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
    <el-button type="success" class="mt-4" style="width: 100%" @click="openCarParkDialog()">
      新增場站基本資料
    </el-button>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth" center>
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
              :value="company.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="場站名稱" prop="name">
          <el-input v-model="currentCarPark.name"></el-input>
        </el-form-item>
        <el-form-item label="部門代號" prop="voucherDep">
          <el-input v-model="currentCarPark.voucherDep"></el-input>
        </el-form-item>
        <el-form-item label="使用者" prop="userId">
          <el-select 
            v-model="currentCarPark.userId" 
            placeholder="請選擇使用者">
            <el-option 
              v-for="user in users"
              :key="user.id"
              :label="user.userName"
              :value="user.id">
            </el-option>
          </el-select>
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
      :width="dialogWidth"
      center
    >
      <div class="d-flex flex-column">
        <div class="row mb-2 justify-content-center">
          <div class="col-6 text-end">場站名稱</div>
          <div class="col-6 text-start fw-bold">{{ deleteCarParkData.name }}</div>
        </div>
        <div class="row mb-2 justify-content-center">
          <div class="col-6 text-end">統編</div>
          <div class="col-6 text-start fw-bold">{{ deleteCarParkData.taxNumber }}</div>
        </div>
        <div class="row mb-2 justify-content-center">
          <div class="col-6 text-end">抬頭</div>
          <div class="col-6 text-start fw-bold">{{ deleteCarParkData.receiptTitle }}</div>
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
import { API } from '@/App.vue'

export default {
  data() {
    return {
      searchQuery: '',
      carParks: [],
      users: [],
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
    },
    filteredCarParks() {
      if (this.searchQuery.trim() === '') {
        return this.carParks
      }
      return this.carParks.filter((carPark) => {
        return carPark.name.includes(this.searchQuery)
      })
    }
  },
  mounted() {
    this.getCarParkData()
    this.getCompanyData()
    this.getUsers()
  },
  methods: {
    getCarParkData() {
      const getCarParkDataApi = `${API}/main/searchCarPark`
      this.axios.get(getCarParkDataApi).then((response) => {
        if (response.data.returnCode == 0) {
          this.carParks = response.data.data
        }
      })
    },
    getCompanyData() {
      const getCompanyDataApi = `${API}/main/searchCompanyInfo`
      this.axios.get(getCompanyDataApi).then((response) => {
        if (response.data.returnCode == 0) {
          this.companies = response.data.data
        }
      })
    },
    handleCompanyChange(value) {
      // 找到選擇的公司
      const selectedCompany = this.companies.find((company) => company.id === value)
      // 更新 currentCarPark 中的資料
      this.currentCarPark.companyId = selectedCompany.id
      this.currentCarPark.taxNumber = selectedCompany.taxNumber
      this.currentCarPark.receiptTitle = selectedCompany.receiptTitle
    },
    getUsers() {
      const getUsersAPI = `${API}/user/searchUser`
      this.axios
        .get(getUsersAPI)
        .then((response) => {
          this.users = response.data.data
        })
    },
    openCarParkDialog(CarPark) {
      if (CarPark) {
        // 編輯模式
        this.isEditing = true
        this.currentCarPark = { ...CarPark }
        delete this.currentCarPark.deleteTime
        // 根據 companyId 匹配 taxNumber、receiptTitle
        const selectedCompany = this.companies.find(
          (company) => company.id === this.currentCarPark.companyId
        )
        this.currentCarPark.taxNumber = selectedCompany.taxNumber
        this.currentCarPark.receiptTitle = selectedCompany.receiptTitle
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
            const editCarParkApi = `${API}/main/updateCarPark`
            this.axios.post(editCarParkApi, this.currentCarPark).then((response) => {
              if (response.data.returnCode == 0) {
                alert(response.data.message)
                this.getCarParkData()
              }
            })
          } else {
            const insertCarParkApi = `${API}/main/insertCarPark`
            this.axios.post(insertCarParkApi, this.currentCarPark).then((response) => {
              if (response.data.returnCode == 0) {
                alert(response.data.message)
                this.getCarParkData()
              }
            })
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
      const deleteCarParkApi = `${API}/main/deleteCarPark`
      this.axios.post(deleteCarParkApi, { id: this.deleteCarParkData.id }).then((response) => {
        if (response.data.returnCode == 0) {
          alert(response.data.message)
          this.getCarParkData()
          this.deleteCarParkDialogVisible = false
        }
      })
    }
  }
}
</script>
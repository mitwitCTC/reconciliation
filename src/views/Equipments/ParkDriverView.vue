<template>
  <h2 class="text-center">{{ pageTitle }}</h2>

  <div class="search d-flex justify-content-end align-items-center col-12 col-md-3">
    <el-input v-model="searchQuery" placeholder="請輸入場站名稱" clearable>
      <template #prefix>
        <el-icon class="el-input__icon"><search /></el-icon>
      </template>
    </el-input>
  </div>
  <el-table :data="filteredParkDriver" height="400">
    <el-table-column align="center" prop="parkName" label="場站名稱" />
    <el-table-column align="center" prop="deviceName" label="設備名稱" />
    <el-table-column align="center" prop="driverNO" label="設備編號" />
    <el-table-column align="center" prop="message" label="備註" />
    <el-table-column align="center" label="修改" fixed="right">
      <template v-slot="scope">
        <el-button @click="openParkDriverDialog(scope.row)">修改</el-button>
      </template>
    </el-table-column>
    <el-table-column align="center" label="刪除" fixed="right">
      <template v-slot="scope">
        <el-button type="danger" @click="openDeleteParkDriverDialog(scope.row)">刪除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button type="success" class="mt-4" style="width: 100%" @click="openParkDriverDialog()">
    新增場站設備
  </el-button>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth" center>
    <el-form
      :model="currentParkDriver"
      label-width="auto"
      :rules="parkDriverFormRules"
      ref="eidtParkDriverForm"
    >
      <el-form-item label="場站名稱" prop="parkName">
        <el-select
          v-model="currentParkDriver.parkId"
          placeholder="請選擇場站名稱"
          @change="handleCarparkChange"
        >
          <el-option
            v-for="carPark in carParks"
            :key="carPark.id"
            :label="carPark.name"
            :value="carPark.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="設備名稱" prop="driverId">
        <el-select
          v-model="currentParkDriver.driverId"
          placeholder="請選擇設備"
          @change="handleDeviceClassChange"
        >
          <el-option
            v-for="item in deviceClass"
            :key="item.id"
            :label="item.deviceName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="設備編號" prop="driverNO">
        <el-input v-model="currentParkDriver.driverNO"></el-input>
      </el-form-item>
      <el-form-item label="備註" prop="message">
        <el-input v-model="currentParkDriver.message"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer d-flex justify-content-end">
      <el-button @click="cancelSaveParkDriver">取消</el-button>
      <el-button type="primary" @click="saveParkDriver">確定</el-button>
    </div>
  </el-dialog>

  <el-dialog
    v-model="deleteParkDriverDialogVisible"
    :close-on-click-modal="false"
    title="刪除場站設備"
    :width="dialogWidth"
    center
  >
    <div class="d-flex flex-column">
      <div class="row mb-2 justify-content-center">
        <div class="col-6 text-end">場站名稱</div>
        <div class="col-6 text-start fw-bold">{{ deleteParkDriverData.deviceName }}</div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteParkDriverDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteParkDriver">確認刪除</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { API } from '@/App.vue'

export default {
  data() {
    return {
      activeNames: [],
      parkDriver: [],
      searchQuery: '',
      dialogVisible: false,
      carParks: [],
      deviceClass: [],
      currentParkDriver: {
        parkId: '',
        driverId: '',
        driverNO: '',
        message: ''
      },
      isEditing: false,
      parkDriverFormRules: {
        parkId: [{ required: true, message: '請選擇場站', trigger: 'change' }],
        driverId: [{ required: true, message: '請選擇設備項目', trigger: 'change' }],
        driverNO: [{ required: true, message: '請輸入設備編號', trigger: 'blur' }]
      },
      deleteParkDriverDialogVisible: false,
      deleteParkDriverData: null
    }
  },
  mounted() {
    this.getParkDriver()
    this.getCarParkData()
    this.getDeviceClass()
  },
  computed: {
    dialogTitle() {
      return this.isEditing ? '修改場站設備' : '新增場站設備'
    },
    filteredParkDriver() {
      if (this.searchQuery.trim() === '') {
        return this.parkDriver
      }
      return this.parkDriver.filter((item) => {
        return item.parkName.includes(this.searchQuery)
      })
    }
  },
  methods: {
    getParkDriver() {
      const getParkDriverAPI = `${API}/main/searchParkDriver`
      this.axios.get(getParkDriverAPI).then((response) => {
        if (response.data.returnCode == 0) {
          this.parkDriver = response.data.data
        } else {
          console.error(response.data.message)
        }
      })
    },
    openParkDriverDialog(parkDriver) {
      if (parkDriver) {
        // 編輯模式
        this.currentParkDriver = { ...parkDriver }
        this.isEditing = true
        const selectedCarpark = this.carParks.find(
          (item) => item.name === this.currentParkDriver.parkName
        )
        this.currentParkDriver.parkId = selectedCarpark.id
        const selectedDeviceClass = this.deviceClass.find(
          (item) => item.deviceName === this.currentParkDriver.deviceName
        )
        this.currentParkDriver.driverId = selectedDeviceClass.id
        delete this.currentParkDriver.parkName
        delete this.currentParkDriver.deviceName
        delete this.currentParkDriver.companyId
      } else {
        // 新增模式
        this.currentParkDriver = {
          parkId: '',
          driverId: '',
          driverNO: '',
          message: ''
        }
        this.isEditing = false
      }
      this.dialogVisible = true
    },
    getCarParkData() {
      const getCarParkDataApi = `${API}/main/searchCarPark`
      this.axios.get(getCarParkDataApi).then((response) => {
        if (response.data.returnCode == 0) {
          this.carParks = response.data.data
        }
      })
    },
    handleCarparkChange(value) {
      const selectedCarpark = this.carParks.find((carpark) => carpark.id === value)
      this.currentParkDriver.parkId = selectedCarpark.id
    },
    getDeviceClass() {
      const getDeviceClassAPI = `${API}/main/searchDeviceClass`
      this.axios.get(getDeviceClassAPI).then((response) => {
        if (response.data.returnCode == 0) {
          this.deviceClass = response.data.data
        } else {
          console.error(response.data.message)
        }
      })
    },
    handleDeviceClassChange(value) {
      const selectedDeviceClass = this.deviceClass.find((item) => item.id === value)
      this.currentParkDriver.driverId = selectedDeviceClass.id
    },
    saveParkDriver() {
      this.$refs.eidtParkDriverForm.validate((valid) => {
        if (valid) {
          if (this.isEditing) {
            const editParkDriverAPI = `${API}/main/updateParkDriver`
            this.axios.post(editParkDriverAPI, this.currentParkDriver).then((response) => {
              if (response.data.returnCode == 0) {
                alert(response.data.message)
                this.getParkDriver()
              } else {
                console.error(response.data.message)
              }
            })
          } else {
            const addParkDriverAPI = `${API}/main/insertParkDriver`
            this.axios.post(addParkDriverAPI, this.currentParkDriver).then((response) => {
              if (response.data.returnCode == 0) {
                alert(response.data.message)
                this.getParkDriver()
              } else {
                console.error(response.data.message)
              }
            })
          }
          this.dialogVisible = false
        }
      })
    },
    cancelSaveParkDriver() {
      this.dialogVisible = false
      this.$refs.eidtParkDriverForm.clearValidate()
    },
    openDeleteParkDriverDialog(scope) {
      this.deleteParkDriverDialogVisible = true
      this.deleteParkDriverData = scope
    },
    deleteParkDriver() {
      const deleteParkDriverAPI = `${API}/main/deleteParkDriver`
      this.axios
        .post(deleteParkDriverAPI, { id: this.deleteParkDriverData.id })
        .then((response) => {
          if (response.data.returnCode == 0) {
            alert(response.data.message)
            this.getParkDriver()
          } else {
            console.error(response.data.message)
          }
        })
      this.deleteParkDriverDialogVisible = false
    }
  }
}
</script>
<style></style>

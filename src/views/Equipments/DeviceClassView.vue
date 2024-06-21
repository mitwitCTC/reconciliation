<template>
  <h2 class="text-center">{{ pageTitle }}</h2>

  <el-table :data="deviceClass" height="400">
    <el-table-column align="center" prop="deviceName" label="設備名稱" />
    <el-table-column align="center" label="修改" fixed="right">
      <template v-slot="scope">
        <el-button @click="openDeviceClassDialog(scope.row)">修改</el-button>
      </template>
    </el-table-column>
    <el-table-column align="center" label="刪除" fixed="right">
      <template v-slot="scope">
        <el-button type="danger" @click="openDeleteDeviceClassDialog(scope.row)">刪除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button type="success" class="mt-4" style="width: 100%" @click="openDeviceClassDialog()">
    新增設備項目
  </el-button>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth" center>
    <el-form
      :model="currentDeviceClass"
      label-width="auto"
      :rules="deviceClassFormRules"
      ref="editDeviceClassForm"
    >
      <el-form-item label="設備項目" prop="deviceName">
        <el-input v-model="currentDeviceClass.deviceName"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer d-flex justify-content-end">
      <el-button @click="cancelSaveDeviceClass">取消</el-button>
      <el-button type="primary" @click="saveDeviceClass">確定</el-button>
    </div>
  </el-dialog>

  <el-dialog
    v-model="deleteDeviceClassDialogVisible"
    :close-on-click-modal="false"
    title="刪除設備項目"
    :width="dialogWidth"
    center
  >
    <div class="d-flex flex-column">
      <div class="row mb-2 justify-content-center">
        <div class="col-6 text-end">設備名稱</div>
        <div class="col-6 text-start fw-bold">{{ deleteDeviceClassData.deviceName }}</div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteDeviceClassDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteDeviceClass">確認刪除</el-button>
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
      deviceClass: [],
      dialogVisible: false,
      currentDeviceClass: {
        deviceName: ''
      },
      isEditing: false,
      deviceClassFormRules: {
        deviceName: [{ required: true, message: '請輸入設備項目名稱', trigger: 'blur' }]
      },
      deleteDeviceClassDialogVisible: false,
      deleteDeviceClassData: null
    }
  },
  created() {
    this.getDeviceClass()
  },
  computed: {
    dialogTitle() {
      return this.isEditing ? '修改設備項目' : '新增設備項目'
    }
  },
  methods: {
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
    openDeviceClassDialog(deviceClass) {
      if (deviceClass) {
        // 編輯模式
        this.currentDeviceClass = { ...deviceClass }
        this.isEditing = true
        delete this.currentDeviceClass.deleteTime
      } else {
        // 新增模式
        this.currentDeviceClass = {
          deviceName: ''
        }
        this.isEditing = false
      }
      this.dialogVisible = true
    },
    saveDeviceClass() {
      this.$refs.editDeviceClassForm.validate((valid) => {
        if (valid) {
          if (this.isEditing) {
            const editDeviceClassAPI = `${API}/main/updateDeviceClass`
            this.axios.post(editDeviceClassAPI, this.currentDeviceClass).then((response) => {
              if (response.data.returnCode == 0) {
                alert(response.data.message)
                this.getDeviceClass()
              } else {
                console.error(response.data.message)
              }
            })
          } else {
            const addDeviceClassAPI = `${API}/main/insertDeviceClass`
            this.axios.post(addDeviceClassAPI, this.currentDeviceClass).then((response) => {
              if (response.data.returnCode == 0) {
                alert(response.data.message)
                this.getDeviceClass()
              } else {
                console.error(response.data.message)
              }
            })
          }
          this.dialogVisible = false
        }
      })
    },
    cancelSaveDeviceClass() {
      this.dialogVisible = false
      this.$refs.editDeviceClassForm.clearValidate()
    },
    openDeleteDeviceClassDialog(scope) {
      this.deleteDeviceClassDialogVisible = true
      this.deleteDeviceClassData = scope
    },
    deleteDeviceClass() {
      const deleteDeviceClassAPI = `${API}/main/deleteDeviceClass`
      this.axios
        .post(deleteDeviceClassAPI, { id: this.deleteDeviceClassData.id })
        .then((response) => {
          if (response.data.returnCode == 0) {
            alert(response.data.message)
            this.getDeviceClass()
          } else {
            console.error(response.data.message)
          }
        })
      this.deleteDeviceClassDialogVisible = false
    }
  }
}
</script>
<style></style>

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
      ref="eidtDeviceClassForm"
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
        <div class="col-6 text-end">場站名稱</div>
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
      return this.isEditing ? '修改場站資料' : '新增場站資料'
    }
  },
  methods: {
    getDeviceClass() {
      this.deviceClass = [
        { id: 1, deviceName: 'mitwit' },
        { id: 2, deviceName: 'ubuti' },
        { id: 3, deviceName: '富軥新系統' },
        { id: 4, deviceName: '富軥舊系統' },
        { id: 5, deviceName: '微程式2代柱' },
        { id: 6, deviceName: '微程式3代柱' },
        { id: 7, deviceName: '微程式4代柱' },
        { id: 8, deviceName: '遠通ETC' },
        { id: 9, deviceName: '遠通goif' }
      ]
    },
    openDeviceClassDialog(deviceClass) {
      if (deviceClass) {
        // 編輯模式
        this.currentDeviceClass = { ...deviceClass }
        this.isEditing = true
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
      this.$refs.eidtDeviceClassForm.validate((valid) => {
        if (valid) {
          if (this.isEditing) {
            alert('修改成功')
            console.log('修改成功', this.currentDeviceClass)
          } else {
            alert('新增成功')
            console.log('新增成功', this.currentDeviceClass)
          }
          this.dialogVisible = false
        }
      })
    },
    cancelSaveDeviceClass() {
      this.dialogVisible = false
      this.$refs.eidtDeviceClassForm.clearValidate()
    },
    openDeleteDeviceClassDialog(scope) {
      this.deleteDeviceClassDialogVisible = true
      this.deleteDeviceClassData = scope
    },
    deleteDeviceClass() {
      alert('成功刪除設備項目')
      console.log('成功刪除設備項目', this.deleteDeviceClassData)
    }
  }
}
</script>
<style></style>

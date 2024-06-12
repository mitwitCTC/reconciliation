<template>
  <div>
    <h2 class="text-center">{{ pageTitle }}</h2>

    <el-table :data="users" height="400">
      <el-table-column align="center" prop="userName" label="使用者名稱" />
      <el-table-column align="center" prop="account" label="帳號" />
      <el-table-column align="center" label="修改密碼" fixed="right">
        <template v-slot="scope">
          <el-button @click="openUserDialog(scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="刪除" fixed="right">
        <template v-slot="scope">
          <el-button type="danger" @click="openDeleteUserDialog(scope.row)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="success" class="mt-4" style="width: 100%" @click="openUserDialog()">
      新增使用者資料
    </el-button>

    <!-- 新增 dialog -->
    <el-dialog v-model="addDialogVisible" :title="dialogTitle" :width="dialogWidth" center>
      <el-form :model="currentUser" label-width="auto" :rules="userFormRules" ref="userForm">
        <el-form-item label="使用者名稱" prop="userName">
          <el-input v-model="currentUser.userName"></el-input>
        </el-form-item>
        <el-form-item label="帳號" prop="account">
          <el-input v-model="currentUser.account"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input type="password" v-model="currentUser.password"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer d-flex justify-content-end">
        <el-button @click="cancelAddUser">取消</el-button>
        <el-button type="primary" @click="addUser">確定</el-button>
      </div>
    </el-dialog>

    <!-- 修改 dialog -->
    <el-dialog v-model="editDialogVisible" :title="dialogTitle" :width="dialogWidth" center>
      <el-form :model="currentUser" label-width="auto" :rules="userFormRules" ref="userForm">
        <el-form-item label="使用者名稱" prop="userName">
          <el-input v-model="currentUser.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="帳號" prop="account">
          <el-input v-model="currentUser.account" disabled></el-input>
        </el-form-item>
        <el-form-item label="原密碼" prop="password">
          <el-input type="password" v-model="currentUser.password"></el-input>
        </el-form-item>
        <el-form-item label="新密碼" prop="newPassword">
          <el-input type="password" v-model="currentUser.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="密碼確認" prop="againPassword">
          <el-input type="password" v-model="currentUser.againPassword"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer d-flex justify-content-end">
        <el-button @click="cancelEditUser">取消</el-button>
        <el-button type="primary" @click="editUser">確定</el-button>
      </div>
    </el-dialog>

    <!-- 刪除 dialog -->
    <el-dialog v-model="deleteDialogVisible" title="刪除使用者" :width="dialogWidth" center>
      <div class="d-flex flex-column">
        <div class="row mb-2 justify-content-center">
          <div class="col-6 text-end">使用者帳號</div>
          <div class="col-6 text-start fw-bold">{{ deleteUserData.account }}</div>
        </div>
      </div>
      <div class="dialog-footer d-flex justify-content-end">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteUser">確定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { API } from '@/App.vue'

export default {
  data() {
    return {
      loginUser: '',
      users: [],
      addDialogVisible: false,
      editDialogVisible: false,
      deleteDialogVisible: false,
      isEditing: false,
      currentUser: {},
      editUserData: {},
      deleteUserData: {},
      userFormRules: {
        userName: [{ required: true, message: '請輸入使用者名稱', trigger: 'blur' }],
        account: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
        password: [{ required: true, message: '請輸入原密碼', trigger: 'blur' }],
        newPassword: [{ required: true, message: '請輸入新密碼', trigger: 'blur' }],
        againPassword: [{ required: true, message: '請再次輸入新密碼', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getLoginUser() {
      this.loginUser = atob(sessionStorage.getItem('account'))
    },
    getUsers() {
      const getUsersAPi = `${API}/user/searchUser`
      this.axios.get(getUsersAPi).then((response) => {
        this.users = response.data.data
      })
    },
    openUserDialog(user) {
      if (user) {
        // 編輯模式
        this.currentUser = { ...user }
        this.currentUser.password = ''
        this.isEditing = true
        this.editDialogVisible = true
      } else {
        // 新增模式
        this.addDialogVisible = true
        this.currentUser = {
          userName: '',
          account: '',
          password: ''
        }
        this.isEditing = false
      }
    },
    cancelAddUser() {
      this.addDialogVisible = false
      this.currentUser = {}
    },
    addUser() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          const addUserApi = `${API}/user/insertUser`
          this.axios.post(addUserApi, this.currentUser).then((response) => {
            if (response.data.returnCode == 0) {
              alert(response.data.message)
              this.getUsers()
              this.addDialogVisible = false
            } else {
              alert(response.data.message)
            }
          })
        }
      })
    },
    cancelEditUser() {
      this.editDialogVisible = false
      this.currentUser = {}
    },
    async editUser() {
      try {
        // 獲取表單的引用
        const form = this.$refs.userForm

        // 驗證表單
        await form.validate()

        // 檢查原密碼是否正確
        const isPasswordCorrect = await this.verifyOriginalPassword(this.currentUser.password)
        if (!isPasswordCorrect) {
          alert('原密碼不正確')
          return
        }

        // 檢查新密碼和確認密碼是否一致
        if (this.currentUser.newPassword !== this.currentUser.againPassword) {
          alert('新密碼和確認密碼不一致')
          return
        }
        const editUserApi = `${API}/user/updateUser`
        this.axios
          .post(editUserApi, { id: this.currentUser.id, password: this.currentUser.newPassword })
          .then((response) => {
            if (response.data.returnCode == 0) {
              if (this.loginUser == this.currentUser.account) {
                alert('成功修改使用者密碼，請重新登入')
                sessionStorage.removeItem('account')
                sessionStorage.removeItem('activeMenu')
                sessionStorage.removeItem('isAuthenticated')
                this.$router.push('/login')
              } else {
                alert(response.data.message)
              }
            } else {
              alert(response.data.message)
            }
            this.editDialogVisible = false
          })
      } catch (error) {
        console.error(error)
      }
    },
    async verifyOriginalPassword(password) {
      const checkPasswordApi = `${API}/user/login`
      try {
        const response = await this.axios.post(checkPasswordApi, {
          account: this.currentUser.account,
          password: password
        })
        if (response.data.data.length === 1) {
          return true
        } else {
          return false
        }
      } catch (error) {
        console.error('Error verifying password:', error)
        return false
      }
    },
    openDeleteUserDialog(scope) {
      this.deleteDialogVisible = true
      this.deleteUserData = scope
    },
    deleteUser() {
      const deleteUserApi = `${API}/user/deleteUser`
      this.axios.post(deleteUserApi, { id: this.deleteUserData.id }).then((response) => {
        if (response.data.returnCode == 0) {
          alert(response.data.message)
          this.getUsers()
          if (this.loginUser == this.deleteUserData.account) {
            sessionStorage.removeItem('account')
            sessionStorage.removeItem('activeMenu')
            sessionStorage.removeItem('isAuthenticated')
            this.$router.push('/login')
          }
        } else {
          alert(response.data.message)
        }
        this.deleteDialogVisible = false
      })
    }
  },
  mounted() {
    this.getUsers()
    this.getLoginUser()
  },
  computed: {
    dialogTitle() {
      return this.isEditing ? '修改使用者' : '新增使用者'
    }
  }
}
</script>

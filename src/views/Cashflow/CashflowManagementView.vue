<template>
    <div>
        <div class="d-flex align-items-center custom-container">
            <h2 class="mb-0">{{ pageTitle }}</h2>
            <el-button class="header-button" @click="openCashflowDialog()">新增</el-button>
        </div>
        <el-table :data="cashFlow" height="600">
            <el-table-column align="center" prop="merchnatId" label="特店代號" />
            <el-table-column align="center" prop="bankName" label="銀行">
            </el-table-column>
            <el-table-column align="center" prop="parkName" label="場站名稱" />
            <el-table-column align="center" prop="casedescribe" label="金流來源" />
            <el-table-column align="center" label="修改" fixed="right">
                <template v-slot="scope">
                    <el-button @click="openCashflowDialog(scope.row)">修改</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" label="刪除" fixed="right">
                <template v-slot="scope">
                    <el-button type="danger" @click="openDeleteCashFlowDialog(scope.row)">刪除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增/修改 dialog -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500" center>
            <el-form :model="currentCashFlow" label-width="auto" :rules="cashFlowFormRules" ref="eidtCashflowForm">
                <el-form-item label="特店代號" prop="merchnatId">
                    <el-input v-model="currentCashFlow.merchnatId"></el-input>
                </el-form-item>
                <el-form-item label="銀行" prop="bankId">
                    <el-select v-model="currentCashFlow.bankId" placeholder="請選擇銀行" @change="getSearchCashFlowData">
                        <el-option v-for="bank in searchInfo.bank" :key="bank.id" :label="bank.name" :value="bank.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="場站" prop="parkId">
                    <el-select v-model="currentCashFlow.parkId" placeholder="請先選擇銀行">
                        <el-option v-for="park in carParkOptions" :key="park.id" :label="park.name" :value="park.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="金流" prop="cashflowClassId">
                    <el-select v-model="currentCashFlow.cashflowClassId" placeholder="請先選擇銀行">
                        <el-option v-for="cashflowClass in cashflowClassOptions" :key="cashflowClass.id"
                            :label="cashflowClass.casedescribe" :value="cashflowClass.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="dialog-footer d-flex justify-content-end">
                <el-button @click="cancelSaveCashflow">取消</el-button>
                <el-button type="primary" @click="saveCashflow">確定</el-button>
            </div>
        </el-dialog>
        <!-- 新增/修改 dialog -->
        <!-- 刪除 dialog -->
        <el-dialog v-model="deleteDialogVisible" :close-on-click-modal="false" title="刪除金流" width="500" center>
            <div class="d-flex flex-column">
                <div class="row mb-2 justify-content-center">
                    <div class="col-3 text-end">特店代號</div>
                    <div class="col-4 text-start fw-bold">{{ deleteCashflowData.merchnatId }}</div>
                </div>
                <div class="row mb-2 justify-content-center">
                    <div class="col-3 text-end">銀行</div>
                    <div class="col-4 text-start fw-bold">{{ deleteCashflowData.bankName }}</div>
                </div>
                <div class="row mb-2 justify-content-center">
                    <div class="col-3 text-end">場站名稱</div>
                    <div class="col-4 text-start fw-bold">{{ deleteCashflowData.parkName }}</div>
                </div>
                <div class="row mb-2 justify-content-center">
                    <div class="col-3 text-end">金流來源</div>
                    <div class="col-4 text-start fw-bold">{{ deleteCashflowData.casedescribe }}</div>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="deleteDialogVisible = false">取消</el-button>
                    <el-button type="danger" @click="deleteCahsflow">確認刪除</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 刪除 dialog -->
    </div>
</template>

<script>
import { API } from '@/App.vue'
import { ElLoading } from 'element-plus'

export default {
    data() {
        return {
            pageTitle: '',
            cashFlow: [],
            dialogVisible: false,
            isEditing: false,
            currentCashFlow: {
                merchnatId: '',
                bankId: '',
                parkId: '',
                cashflowClassId: ''
            },
            deleteDialogVisible: false,
            deleteCashflowData: {},
            searchInfo: {},
            carParkOptions: [],
            cashflowClassOptions: [],
            cashFlowFormRules: {
                merchnatId: [{ required: true, message: '請輸入特店代號', trigger: 'blur' }],
                bankId: [{ required: true, message: '請選擇銀行', trigger: 'change' }],
                parkId: [{ required: true, message: '請選擇場站', trigger: 'change' }],
                cashflowClassId: [{ required: true, message: '請選擇金流來源', trigger: 'change' }],
            }
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
        getPageTitle() {
            this.pageTitle = this.$route.name
        },
        searchCashFlow() {
            const loading = this.showLoading('載入中...')
            const searchCashFlowApi = `${API}/main/searchCashFlow`
            this.axios
                .get(searchCashFlowApi)
                .then((response) => {
                    this.cashFlow = response.data.data
                    loading.close()
                })
        },
        openCashflowDialog(cashFlow) {
            if (cashFlow) {
                // 編輯模式
                this.currentCashFlow = { ...cashFlow }
                this.isEditing = true
                const savedParkId = this.currentCashFlow.parkId
                const savedCashflowClassId = this.currentCashFlow.cashflowClassId
                this.getSearchCashFlowData()
                // 更新carParkOptions 和 cashflowClassOptions 選項後，重新設置 parkId 和 cashflowClassId
                this.currentCashFlow.parkId = savedParkId
                this.currentCashFlow.cashflowClassId = savedCashflowClassId
            } else {
                // 新增模式
                this.currentCashFlow = {
                    merchnatId: '',
                    bankId: '',
                    parkId: '',
                    cashflowClassId: ''
                }
                this.isEditing = false
            }
            this.dialogVisible = true
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
                (item) => item.id === this.currentCashFlow.bankId
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
            this.currentCashFlow.parkId = null
            this.currentCashFlow.cashflowClassId = null
        },
        saveCashflow() {
            this.$refs.eidtCashflowForm.validate((valid) => {
                if (valid) {
                    if (this.isEditing) {
                        const eidtCashflowApi = `${API}/main/updateCashFlow`
                        this.axios
                            .post(eidtCashflowApi, this.currentCashFlow)
                            .then((response) => {
                                if (response.data.returnCode == 0) {
                                    alert("修改成功")
                                    this.searchCashFlow()
                                }
                            })
                    } else {
                        const addCashflowApi = `${API}/main/insertCashFlow`
                        this.axios
                            .post(addCashflowApi, this.currentCashFlow)
                            .then((response) => {
                                if (response.data.returnCode == 0) {
                                    alert(response.data.message)
                                    this.searchCashFlow()
                                }
                            })
                    }
                    this.dialogVisible = false
                }
            })
        },
        cancelSaveCashflow() {
            this.dialogVisible = false
            this.$refs.eidtCashflowForm.clearValidate()
        },
        openDeleteCashFlowDialog(cashFlow) {
            this.deleteDialogVisible = true
            this.deleteCashflowData = { ...cashFlow }
        },
        deleteCahsflow() {
            const deleteCahsflowApi = `${API}/main/deleteCashFlow`
            this.axios
                .post(deleteCahsflowApi, { id: this.deleteCashflowData.id })
                .then((response) => {
                    if (response.data.returnCode == 0) {
                        alert(response.data.message)
                        this.searchCashFlow()
                        this.deleteDialogVisible = false
                    }
                })
        }
    },
    mounted() {
        this.getPageTitle()
        this.searchCashFlow()
        this.getSearchInfo()
    },
    computed: {
        dialogTitle() {
            return this.isEditing ? '修改金流' : '新增金流'
        }
    },
    watch: {
        'currentCashflow.bankId'(newValue, oldValue) {
            if (newValue !== null && newValue !== oldValue) {
                this.getSearchCashFlowData()
            }
        }
    },
}
</script>
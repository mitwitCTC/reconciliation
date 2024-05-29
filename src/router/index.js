import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import BasicView from '@/views/basicInfo/BasicView.vue'
import TempparkingView from '@/views/tempParking/TempparkingView.vue'
import OtherAccountsView from '@/views/OtherAccounts/OtherAccountsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: '登入' }
    },
    {
      path: '/:group',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: 'basic',
          name: '基本資料',
          component: BasicView,
          children: [
            {
              path: 'companies',
              name: '公司基本資料',
              component: () => import('@/views/basicInfo/CompaniesView.vue'),
              meta: { title: '公司基本資料' }
            },
            {
              path: 'carparks',
              name: '場站基本資料',
              component: () => import('@/views/basicInfo/CarparksView.vue'),
              meta: { title: '場站基本資料' }
            },
            {
              path: 'users',
              name: '使用者管理',
              component: () => import('@/views/basicInfo/UsersView.vue'),
              meta: { title: '使用者管理'}
            },
            {
              path: 'equipments',
              name: '設備管理',
              component: () => import('@/views/basicInfo/EquipmentsView.vue'),
              meta: { title: '設備管理' },
              children: [
                {
                  path: 'equipment-items',
                  name: '設備項目',
                  component: () => import('@/views/Equipments/EquipmentItemsView.vue')
                },
                {
                  path: 'equipment-carpark',
                  name: '場站設備管理',
                  component: () => import('@/views/Equipments/CarparkEquipmentView.vue')
                }
              ]
            },
            {
              path: 'cashflow',
              name: '金流',
              component: () => import('@/views/basicInfo/CashflowView.vue'),
              meta: { title: '金流' },
              children: [
                {
                  path: 'bank-management',
                  name: '銀行管理',
                  component: () => import('@/views/Cashflow/BankManagementView.vue'),
                  meta: { title: '銀行管理' }
                },
                {
                  path: 'cashflow-class',
                  name: '金流種類',
                  component: () => import('@/views/Cashflow/CashflowClassView.vue'),
                  meta: { title: '金流種類' }
                },
                {
                  path: 'cashflow-management',
                  name: '金流管理',
                  component: () => import('@/views/Cashflow/CashflowManagementView.vue'),
                  meta: { title: '金流管理' }
                },
                {
                  path: 'carpark-account',
                  name: '場帳對應',
                  component: () => import('@/views/Cashflow/CarparkAccountView.vue'),
                  meta: { title: '場帳對應' }
                }
              ]
            },
            {
              path: 'accounting-account',
              name: '會計科目',
              component: () => import('@/views/basicInfo/AccountingAccountView.vue'),
              meta: { title: '會計科目' }
            }
          ]
        },
        {
          path: 'temporaryparking',
          name: '臨停',
          component: TempparkingView,
          children: [
            {
              path: 'tempparking-member',
              name: '臨停會員',
              component: () => import('@/views/tempParking/TempparkingMemberView.vue'),
              meta: { title: '臨停會員' }
            },
            // {
            //   path: '/temporaryparking/carpark-accounts',
            //   name: '停車場帳務AB',
            //   component: () =>
            //     import('@/views/tempParking/CarparkAccountAB/CarparkAccountABView.vue'),
            //   meta: { title: '停車場帳務AB' },
            //   children: [
            //     {
            //       path: '/temporaryparking/carpark-accounts/reconciliationAB',
            //       name: '轉應收帳',
            //       component: () =>
            //         import('@/views/tempParking/CarparkAccountAB/ReconciliationABView.vue'),
            //       meta: { title: '轉應收帳' }
            //     },
            //     {
            //       path: '/temporaryparking/carpark-accounts/transfer-statusAB',
            //       name: '傳輸狀態',
            //       component: () =>
            //         import('@/views/tempParking/CarparkAccountAB/TransferStatusABView.vue'),
            //       meta: { title: '傳輸狀態' }
            //     },
            //     {
            //       path: '/temporaryparking/carpark-accounts/work-logAB',
            //       name: '工作日誌',
            //       component: () =>
            //         import('@/views/tempParking/CarparkAccountAB/WorkLogsABView.vue'),
            //       meta: { title: '工作日誌' }
            //     },
            //     {
            //       path: '/temporaryparking/carpark-accounts/subpoena-recordAB',
            //       name: '傳票紀錄',
            //       component: () =>
            //         import('@/views/tempParking/CarparkAccountAB/SubpoenaRecordABView.vue'),
            //       meta: { title: '傳票紀錄' }
            //     }
            //   ]
            // },
            {
              path: 'bank-accounts',
              name: '銀行帳務BC',
              component: () => import('@/views/tempParking/bankAccounts/BankAccountsBCView.vue'),
              meta: { title: '銀行帳務BC' },
              children: [
                {
                  path: 'reconciliation',
                  name: '轉應收帳',
                  component: () =>
                    import('@/views/tempParking/bankAccounts/ReconciliationView.vue'),
                  meta: { title: '轉應收帳' }
                },
                {
                  path: 'transfer-status',
                  name: '傳輸狀態',
                  component: () =>
                    import('@/views/tempParking/bankAccounts/TransferStatusView.vue'),
                  meta: { title: '傳輸狀態' }
                },
                {
                  path: 'cash-in-transit',
                  name: '轉在途現金',
                  component: () => import('@/views/tempParking/bankAccounts/CashInTransitView.vue'),
                  meta: { title: '轉在途現金' }
                },
                {
                  path: 'work-log',
                  name: '工作日誌',
                  component: () => import('@/views/tempParking/bankAccounts/WorkLogsView.vue'),
                  meta: { title: '工作日誌' }
                },
                {
                  path: 'subpoena-record',
                  name: '傳票紀錄',
                  component: () =>
                    import('@/views/tempParking/bankAccounts/SubpoenaRecordView.vue'),
                  meta: { title: '傳票紀錄' }
                }
              ]
            },
            {
              path: 'financial-statements',
              name: '報表',
              component: () => import('@/views/tempParking/FinancialStatementsView.vue'),
              meta: { title: '報表' }
            }
          ]
        },
        {
          path: 'otheraccounts',
          name: '其他帳務',
          component: OtherAccountsView,
          children: [
            {
              path: 'input-account',
              name: '進項',
              component: () => import('@/views/OtherAccounts/InputAccountView.vue'),
              meta: { title: '進項' }
            },
            {
              path: 'output-account',
              name: '銷項',
              component: () => import('@/views/OtherAccounts/OutputAccountView.vue'),
              meta: { title: '銷項' }
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true'
  if (to.name !== 'login' && !isAuthenticated) {
    return { name: 'login' }
  } else if (to.name == 'login' && isAuthenticated) {
    router.push('/MDAx/basic/companies')
  }
  if (to.meta.title) {
    document.title = to.meta.title
  }
})

export default router

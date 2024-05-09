import{_ as M,E as T,c as _,a as n,b as e,w as s,d as F,e as r,t as g,f as V,r as c,o as D,F as v,g as C,h as x}from"./index-jrTWPHWI.js";const U={data(){return{disabledDate(o){return o.getTime()>Date.now()},searchData:{date:"",cashFlowSource:"",bankAccount:""},searchOrigin:[],cashFlowSources:[],bankAccounts:[],isComparing:!1,bankFlow:[],countBankFlow:null,totalBankFlow:null,systemFlow:[],countSystemFlow:null,totalSystemFlow:null,dialogSystemVisible:!1,addSystemData:{trx_seq:"",trx_date:"",scheduled_date:"",station:"",trade_amount:"",tn_amount:"",s_amount:"",department:""},systemFormRules:{scheduled_date:[{required:!0,message:"請選擇入帳日",trigger:"change"}],station:[{required:!0,message:"請輸入場站名稱",trigger:"blur"}],s_amount:[{required:!0,message:"請輸入入帳金額",trigger:"blur"}],department:[{required:!0,message:"請輸入部門名稱",trigger:"blur"}]},dialogTableVisible:!1,systemFlowDetails:[],dialogVisible:!1,checkDetail:null,deleteDetailDialogVisible:!1,deleteDetailData:null,transferData:[]}},methods:{getSearchOrigin(){this.searchOrigin=[{id:1,companyId:1,bankMemo:"iPASS MONEY",voucherDesc:"一卡通",message:null,bankId:1,name:"力揚彰銀臨停",bankCode:"009",account:"41150119912400"},{id:2,companyId:1,bankMemo:"國泰世華商連加",voucherDesc:"連加",message:null,bankId:1,name:"力揚彰銀臨停一",bankCode:"009",account:"41150119912401"},{id:3,companyId:1,bankMemo:"悠遊卡公司",voucherDesc:"悠遊卡",message:"悠遊卡舊系統",bankId:1,name:"力揚彰銀臨停",bankCode:"009",account:"41150119912406"}],this.getCashFlowSources(),this.getBankAccountSources()},getCashFlowSources(){this.cashFlowSources=this.searchOrigin.map(o=>o.bankMemo.trim())},getBankAccountSources(){this.bankAccounts=this.searchOrigin.map(o=>({name:o.name.trim(),account:`${o.bankCode}${o.account}`}))},show(){if(this.searchData.date!==""&&this.searchData.cashFlowSource!==""&&this.searchData.bankAccount!==""){const o=T.service({lock:!0,text:"比對中...",background:"rgba(0, 0, 0, 0.7)"});setTimeout(()=>{o.close(),this.countBankFlow=null,this.totalBankFlow=null,this.countSystemFlow=null,this.totalSystemFlow=null,this.compare()},2e3)}else alert("搜尋欄位不得為空！")},getBankFlow(){this.bankFlow=[{id:1,station:"",postingDate:"2024-01-01",depositAmount:1e3,note:"這是備註訊息"},{id:2,station:"",postingDate:"2024-01-01",depositAmount:1300,note:""},{id:3,station:"",postingDate:"2024-01-01",depositAmount:1200,note:"這是備註訊息"},{id:4,station:"",postingDate:"2024-01-01",depositAmount:900,note:""},{id:5,station:"",postingDate:"2024-01-01",depositAmount:500,note:""}],this.countBankFlow=this.bankFlow.length,this.bankFlow.forEach(o=>{this.totalBankFlow+=o.depositAmount})},getSystemFlow(){this.systemFlow=[{id:64,postingDate:"2024-01-01",transactionAmount:515,fee:15,depositAmount:500,transactionCode:"y11111111",station:"富岡停一停車場",department:"部門一"},{id:98,postingDate:"2024-01-01",transactionAmount:915,fee:15,depositAmount:900,transactionCode:"y22222222",station:"南崁廣停一",department:"部門二"},{id:119,postingDate:"2024-01-01",transactionAmount:1315,fee:15,depositAmount:1300,transactionCode:"y33333333",station:"瑞芳消防分隊營業所",department:"部門一"},{id:191,postingDate:"2024-01-01",transactionAmount:515,fee:15,depositAmount:500,transactionCode:"y44444444",station:"桃園停三",department:"部門一"},{id:199,postingDate:"2024-01-01",transactionAmount:515,fee:15,depositAmount:500,transactionCode:"y55555555",station:"桃園停一",department:"部門二"}],this.countSystemFlow=this.systemFlow.length,this.systemFlow.forEach(o=>{this.totalSystemFlow+=o.depositAmount})},handleSystemFlowChange(o){alert("修改成功"),console.log(o)},openSystemDiolog(){this.dialogSystemVisible=!0,this.searchData.postingDate!==""&&(this.addSystemData.postingDate=this.searchData.date)},addSystem(){this.$refs.addSystemForm.validate(o=>{o&&(alert("新增成功"),console.log("新增系統帳資料",this.addSystemData),this.addSystemData={},this.dialogSystemVisible=!1,this.getSystemFlow(),this.getDetail())})},cancelAddSystem(){this.addSystemData={},this.dialogSystemVisible=!1},amountFormatter(o,a,m){return m+="",m.includes(".")||(m+="."),m.replace(/(\d)(?=(\d{3})+\.)/g,function(Y,l){return l+","}).replace(/\.$/,"")},compare(){this.getBankFlow(),this.getSystemFlow(),this.bankFlow.forEach(o=>{const a=this.systemFlow.find(m=>m.depositAmount===o.depositAmount);a&&(o.station=a.station)}),console.log("比對完啦",this.bankFlow)},customRowClassName({row:o}){return o.station!==""?"bg-success text-white":""},customSystemRowClassName({row:o}){return this.bankFlow.some(m=>m.station===o.station&&m.postingDate===o.postingDate)?"bg-success text-white":""},openDetailDialog(o){console.log(o.row),this.dialogTableVisible=!0,this.checkDetail=o.row,this.getDetail()},getDetail(){console.log("查看",this.checkDetail),this.systemFlowDetails=[{outDate:"2024-01-01",transactionTime:"12:30:43",amount:80},{outDate:"2024-01-01",transactionTime:"14:11:34",amount:120},{outDate:"2024-01-01",transactionTime:"16:51:11",amount:160},{outDate:"2024-01-01",transactionTime:"18:40:51",amount:160},{outDate:"2024-01-01",transactionTime:"18:53:20",amount:80},{outDate:"2024-01-01",transactionTime:"19:11:45",amount:200},{outDate:"2024-01-01",transactionTime:"19:41:38",amount:160},{outDate:"2024-01-01",transactionTime:"20:28:54",amount:40},{outDate:"2024-01-01",transactionTime:"21:53:28",amount:200}]},handleDetailAmountChange(o){o.outDate!==null&o.amount!==""?(console.log("交易明細變更",o),alert("修改成功")):alert("修改欄位不得為空！")},openDeleteDetailDialog(o){this.deleteDetailDialogVisible=!0,this.deleteDetailData=o},deleteDetail(){alert("刪除明細成功～"),this.getDetail(),console.log("刪除了這一筆明細",this.deleteDetailData),this.deleteDetailDialogVisible=!1},transfer(){this.transferData=this.bankFlow.filter(o=>o.station!=""),this.transferData.length>0?(this.bankFlow=this.bankFlow.filter(o=>o.station==""),alert("完成轉傳票"),console.log("轉傳票",this.transferData)):alert("無可以轉傳票的資料！")}},mounted(){this.getSearchOrigin()}},B={class:"container"},N=n("h1",{class:"my-3 text-center"},"對帳系統",-1),q={class:"row align-items-center"},E={class:"col-md-3"},O={class:"col-md-3"},R={class:"col-md-3"},I={class:"col-md-2 mobile-btns"},j=n("p",{class:"text-end"},[n("br"),n("span",{class:"bg-success text-white p-1"},"綠底標註"),r("為符合的比對結果 ")],-1),L={class:"row"},P={class:"col-md-6"},z=n("h2",{class:"text-center my-2"},"銀行帳",-1),G={key:0,class:"text-end"},H={class:"col-md-6"},J=n("h2",{class:"text-center my-2"},"系統帳",-1),K={key:0,class:"text-end"},Q={class:"d-flex justify-content-between"},W={class:"d-flex flex-column"},X={class:"row mb-2 justify-content-center"},Z=n("div",{class:"col-3 text-end"},"入帳日期：",-1),$={class:"col-4 text-start fw-bold"},ee={class:"row mb-2 justify-content-center"},te=n("div",{class:"col-3 text-end"},"交易時間：",-1),le={class:"col-4 text-start fw-bold"},ae={class:"row mb-2 justify-content-center"},oe=n("div",{class:"col-3 text-end"},"交易金額：",-1),se={class:"col-4 text-start fw-bold"},ne={class:"dialog-footer"};function ie(o,a,m,Y,l,i){const f=c("el-date-picker"),k=c("el-option"),S=c("el-select"),d=c("el-table-column"),w=c("el-table"),u=c("el-button"),b=c("el-input"),p=c("el-form-item"),A=c("el-form"),y=c("el-dialog");return D(),_("div",B,[N,n("form",q,[n("div",E,[e(f,{class:"align-self-stretch",style:{width:"100%"},modelValue:l.searchData.date,"onUpdate:modelValue":a[0]||(a[0]=t=>l.searchData.date=t),type:"date",placeholder:"請選擇入帳日期",format:"YYYY/MM/DD","value-format":"YYYY-MM-DD","disabled-date":l.disabledDate,clearable:!1},null,8,["modelValue","disabled-date"])]),n("div",O,[e(S,{modelValue:l.searchData.cashFlowSource,"onUpdate:modelValue":a[1]||(a[1]=t=>l.searchData.cashFlowSource=t),placeholder:"請選擇金流來源"},{default:s(()=>[(D(!0),_(v,null,C(l.cashFlowSources,t=>(D(),x(k,{key:t,label:t,value:t},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),n("div",R,[e(S,{modelValue:l.searchData.bankAccount,"onUpdate:modelValue":a[2]||(a[2]=t=>l.searchData.bankAccount=t),placeholder:"請選擇銀行來源"},{default:s(()=>[(D(!0),_(v,null,C(l.bankAccounts,t=>(D(),x(k,{key:t.account,label:t.account,value:t.account},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),n("div",I,[n("button",{class:"btn btn-success",onClick:a[3]||(a[3]=F((...t)=>i.show&&i.show(...t),["prevent"]))},"顯示"),n("button",{class:"btn btn-outline-success",onClick:a[4]||(a[4]=F((...t)=>i.transfer&&i.transfer(...t),["prevent"]))},"轉傳票")])]),j,n("div",L,[n("div",P,[z,l.countBankFlow>0?(D(),_("p",G,[r(" 共  "),n("strong",null,g(l.countBankFlow),1),r("  筆 "),n("span",null,[r("  / 總金額 $ "),n("strong",null,g(l.totalBankFlow.toLocaleString("en",{minimumFractionDigits:0})),1)])])):V("",!0),e(w,{data:l.bankFlow,"row-style":{height:"50px"},"row-class-name":i.customRowClassName,height:"450"},{default:s(()=>[e(d,{align:"center",prop:"station",label:"場站名稱",width:"180"}),e(d,{align:"center",prop:"postingDate",label:"入帳日",width:"180"}),e(d,{align:"center",prop:"depositAmount",sortable:"",formatter:i.amountFormatter,label:"入帳金額",width:"110"},null,8,["formatter"]),e(d,{align:"center",prop:"note",label:"註記",width:"180"})]),_:1},8,["data","row-class-name"])]),n("div",H,[J,l.countSystemFlow>0?(D(),_("p",K,[r(" 共  "),n("strong",null,g(l.countSystemFlow),1),r("  筆 "),n("span",null,[r("  / 總金額 $ "),n("strong",null,g(l.totalSystemFlow.toLocaleString("en",{minimumFractionDigits:0})),1)])])):V("",!0),e(w,{data:l.systemFlow,"row-style":{height:"50px"},"row-class-name":i.customSystemRowClassName,height:"450"},{default:s(()=>[e(d,{align:"center",prop:"station",label:"場站名稱",width:"180"}),e(d,{align:"center",prop:"postingDate",label:"入帳日",width:"210"},{default:s(t=>[n("div",Q,[e(f,{class:"align-self-stretch",style:{width:"100%"},modelValue:t.row.postingDate,"onUpdate:modelValue":h=>t.row.postingDate=h,type:"date",placeholder:"請選擇入帳日期",format:"YYYY/MM/DD","value-format":"YYYY-MM-DD","disabled-date":l.disabledDate,clearable:!1},null,8,["modelValue","onUpdate:modelValue","disabled-date"]),e(u,{onClick:h=>i.handleSystemFlowChange(t.row)},{default:s(()=>[r("確認")]),_:2},1032,["onClick"])])]),_:1}),e(d,{align:"center",prop:"depositAmount",sortable:"",formatter:i.amountFormatter,label:"入帳金額",width:"110"},null,8,["formatter"]),e(d,{align:"center",prop:"transactionAmount",sortable:"",formatter:i.amountFormatter,label:"交易金額",width:"110"},null,8,["formatter"]),e(d,{align:"center",prop:"fee",sortable:"",formatter:i.amountFormatter,label:"手續費",width:"110"},null,8,["formatter"]),e(d,{align:"center",prop:"transactionCode",label:"交易代號",width:"100"}),e(d,{align:"center",prop:"department",label:"部門",width:"100"}),e(d,{align:"center",label:"明細",width:"120",fixed:"right"},{default:s(t=>[e(u,{onClick:h=>i.openDetailDialog(t)},{default:s(()=>[r("查看明細")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data","row-class-name"]),e(u,{type:"success",class:"mt-4",style:{width:"100%"},onClick:a[5]||(a[5]=t=>i.openSystemDiolog())},{default:s(()=>[r(" 新增系統帳資料 ")]),_:1})]),e(y,{modelValue:l.dialogSystemVisible,"onUpdate:modelValue":a[14]||(a[14]=t=>l.dialogSystemVisible=t),title:"新增系統帳資料",center:"",fullscreen:!0,"title-class":"dialog-title"},{default:s(()=>[e(A,{style:{"max-width":"500px","text-align":"center",margin:"0 auto"},"label-width":"120px","label-position":"right",ref:"addSystemForm",model:l.addSystemData,rules:l.systemFormRules},{default:s(()=>[e(p,{label:"付款交易代號","label-position":"right",prop:"trx_seq"},{default:s(()=>[e(b,{modelValue:l.addSystemData.trx_seq,"onUpdate:modelValue":a[6]||(a[6]=t=>l.addSystemData.trx_seq=t),placeholder:"請輸入付款交易代號",type:"text",autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(p,{label:"交易日","label-position":"right",prop:"trx_date"},{default:s(()=>[e(f,{modelValue:l.addSystemData.trx_date,"onUpdate:modelValue":a[7]||(a[7]=t=>l.addSystemData.trx_date=t),type:"date",placeholder:"請選擇交易日",format:"YYYY/MM/DD","value-format":"YYYY-MM-DD","disabled-date":l.disabledDate,clearable:!1},null,8,["modelValue","disabled-date"])]),_:1}),e(p,{label:"入帳日","label-position":"right",prop:"scheduled_date"},{default:s(()=>[e(f,{modelValue:l.addSystemData.scheduled_date,"onUpdate:modelValue":a[8]||(a[8]=t=>l.addSystemData.scheduled_date=t),type:"date",placeholder:"請選擇入帳日",format:"YYYY/MM/DD","value-format":"YYYY-MM-DD","disabled-date":l.disabledDate,clearable:!1},null,8,["modelValue","disabled-date"])]),_:1}),e(p,{label:"場站名稱","label-position":"right",prop:"station"},{default:s(()=>[e(b,{modelValue:l.addSystemData.station,"onUpdate:modelValue":a[9]||(a[9]=t=>l.addSystemData.station=t),placeholder:"請輸入場站名稱",type:"text",autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(p,{label:"交易金額","label-position":"right",prop:"trade_amount"},{default:s(()=>[e(b,{modelValue:l.addSystemData.trade_amount,"onUpdate:modelValue":a[10]||(a[10]=t=>l.addSystemData.trade_amount=t),placeholder:"請輸入交易金額",type:"number",min:"1",autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(p,{label:"手續費","label-position":"right",prop:"tn_amount"},{default:s(()=>[e(b,{modelValue:l.addSystemData.tn_amount,"onUpdate:modelValue":a[11]||(a[11]=t=>l.addSystemData.tn_amount=t),placeholder:"請輸入手續費",type:"number",min:"1",autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(p,{label:"入帳金額","label-position":"right",prop:"s_amount"},{default:s(()=>[e(b,{modelValue:l.addSystemData.s_amount,"onUpdate:modelValue":a[12]||(a[12]=t=>l.addSystemData.s_amount=t),placeholder:"請輸入入帳金額",type:"number",min:"1",autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(p,{label:"部門","label-position":"right",prop:"department"},{default:s(()=>[e(b,{modelValue:l.addSystemData.department,"onUpdate:modelValue":a[13]||(a[13]=t=>l.addSystemData.department=t),placeholder:"請輸入部門",type:"text",autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(p,null,{default:s(()=>[e(u,{type:"success",onClick:i.addSystem},{default:s(()=>[r("確認")]),_:1},8,["onClick"]),e(u,{onClick:i.cancelAddSystem},{default:s(()=>[r("取消")]),_:1},8,["onClick"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue"]),e(y,{modelValue:l.dialogTableVisible,"onUpdate:modelValue":a[18]||(a[18]=t=>l.dialogTableVisible=t),"close-on-click-modal":!1,align:"center",title:"交易明細",width:"70vw"},{default:s(()=>[e(w,{data:l.systemFlowDetails,height:"500"},{default:s(()=>[e(d,{align:"center",property:"outDate",label:"入帳日期"},{default:s(t=>[e(f,{class:"align-self-stretch",modelValue:t.row.outDate,"onUpdate:modelValue":h=>t.row.outDate=h,type:"date",placeholder:"請選擇入帳日期",format:"YYYY/MM/DD","value-format":"YYYY-MM-DD","disabled-date":l.disabledDate,clearable:!1},null,8,["modelValue","onUpdate:modelValue","disabled-date"])]),_:1}),e(d,{align:"center",property:"transactionTime",label:"交易時間",sortable:""}),e(d,{align:"center",property:"amount",label:"金額",sortable:"",formatter:i.amountFormatter},null,8,["formatter"]),e(d,{align:"center",label:"調整"},{default:s(t=>[e(u,{onClick:h=>i.handleDetailAmountChange(t.row)},{default:s(()=>[r("確認調整")]),_:2},1032,["onClick"])]),_:1}),e(d,{align:"center",label:"刪除"},{default:s(t=>[e(u,{type:"danger",onClick:h=>i.openDeleteDetailDialog(t.row)},{default:s(()=>[r("刪除")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"]),e(u,{type:"success",class:"mt-2",onClick:a[15]||(a[15]=t=>i.openSystemDiolog())},{default:s(()=>[r("新增交易明細")]),_:1}),e(y,{modelValue:l.deleteDetailDialogVisible,"onUpdate:modelValue":a[17]||(a[17]=t=>l.deleteDetailDialogVisible=t),"close-on-click-modal":!1,title:"刪除交易明細",width:"500",center:"","align-center":""},{footer:s(()=>[n("div",ne,[e(u,{onClick:a[16]||(a[16]=t=>l.deleteDetailDialogVisible=!1)},{default:s(()=>[r("取消")]),_:1}),e(u,{type:"danger",onClick:i.deleteDetail},{default:s(()=>[r("確認刪除")]),_:1},8,["onClick"])])]),default:s(()=>[n("div",W,[n("div",X,[Z,n("div",$,g(l.deleteDetailData.outDate),1)]),n("div",ee,[te,n("div",le,g(l.deleteDetailData.transactionTime),1)]),n("div",ae,[oe,n("div",se,g(l.deleteDetailData.amount),1)])])]),_:1},8,["modelValue"])]),_:1},8,["modelValue"])])])}const re=M(U,[["render",ie]]);export{re as default};

import{_ as V,E as x,c as g,a as o,b as a,w as r,d as f,e as h,t as T,r as m,o as d,F as y,f as D,g as A,h as k}from"./index-0TD73x14.js";const S={data(){return{searchData:{date:"",payment:"",bankAccount:""},payments:[],bankAccounts:[],isComparing:!1,bankFlow:[],systemFlow:[],dialogTableVisible:!1,systemFlowDetails:[],dialogVisible:!1,selectedId:null,stations:[],transferData:[]}},methods:{getStations(){this.stations=[{id:64,name:"力揚林口廣停二"},{id:98,name:"力揚基隆麥金"},{id:119,name:"力揚八里舊城"},{id:191,name:"力揚第一運動場西門"},{id:199,name:"力揚信義區公所"}]},getPayments(){this.payments=["悠遊卡","街口支付","LinePay"]},getbankAccounts(){this.bankAccounts=["00912345678900","00912345678901","00912345678902"]},show(){if(this.searchData.date!==""&&this.searchData.payment!==""&&this.searchData.bankAccount!==""){const e=x.service({lock:!0,text:"比對中...",background:"rgba(0, 0, 0, 0.7)"});setTimeout(()=>{e.close(),this.compare()},2e3)}else alert("搜尋欄位不得為空！")},getBankFlow(){this.bankFlow=[{id:1,stationName:"",postingDate:"2024-01-01",amount:1e3,note:"這是備註訊息"},{id:2,stationName:"",postingDate:"2024-01-01",amount:1300,note:""},{id:3,stationName:"",postingDate:"2024-01-01",amount:1200,note:"這是備註訊息"},{id:4,stationName:"",postingDate:"2024-01-01",amount:900,note:""},{id:5,stationName:"",postingDate:"2024-01-01",amount:500,note:""}]},getSystemFlow(){this.getStations(),this.systemFlow=[{id:64,postingDate:"2024-01-01",amount:970,transactionCode:"y11111111"},{id:98,postingDate:"2024-01-01",amount:1230,transactionCode:"y22222222"},{id:119,postingDate:"2024-01-01",amount:1200,transactionCode:"y33333333"},{id:191,postingDate:"2024-01-01",amount:900,transactionCode:"y44444444"},{id:199,postingDate:"2024-01-01",amount:500,transactionCode:"y55555555"}],this.systemFlow.forEach(e=>{const n=this.stations.find(l=>e.id===l.id);n&&(e.stationName=n.name)})},amountFormatter(e,n,l){return l+="",l.includes(".")||(l+="."),l.replace(/(\d)(?=(\d{3})+\.)/g,function(F,s){return s+","}).replace(/\.$/,"")},compare(){this.getBankFlow(),this.getSystemFlow(),this.bankFlow.forEach(e=>{const n=this.systemFlow.find(l=>l.amount===e.amount);n&&(e.stationName=n.stationName)}),console.log("比對完啦",this.bankFlow)},customRowClassName({row:e}){return e.stationName!==""?"bg-success text-white":""},customSystemRowClassName({row:e}){return this.bankFlow.some(l=>l.stationName===e.stationName&&l.postingDate===e.postingDate)?"bg-success text-white":""},openDetailDialog(e){console.log(e.row),this.dialogTableVisible=!0,this.systemFlowDetails=[{transactionTime:"12:30:43",amount:80},{transactionTime:"14:11:34",amount:120},{transactionTime:"16:51:11",amount:160},{transactionTime:"18:40:51",amount:160},{transactionTime:"18:53:20",amount:80},{transactionTime:"19:11:45",amount:200},{transactionTime:"19:41:38",amount:160},{transactionTime:"20:28:54",amount:40},{transactionTime:"21:53:28",amount:200}]},handleAmountChange(e){console.log("金額變更",e),alert("修改成功")},transfer(){this.transferData=this.bankFlow.filter(e=>e.stationName!=""),this.transferData.length>0?(this.bankFlow=this.bankFlow.filter(e=>e.stationName==""),alert("完成轉傳票"),console.log("轉傳票",this.transferData)):alert("無可以轉傳票的資料！")}},mounted(){this.getPayments(),this.getbankAccounts()}},Y={class:"container"},M=o("h1",{class:"my-3 text-center"},"對帳系統",-1),B={class:"row align-items-center"},U={class:"col-md-3"},E={class:"col-md-3"},R={class:"col-md-3"},K={class:"col-md-2 mobile-btns"},L={class:"d-flex justify-content-between"},P={class:"text-danger"},j=o("br",null,null,-1),q=o("p",{class:"text-end"},[o("br"),o("span",{class:"bg-success text-white p-1"},"綠底標註"),h("為符合的比對結果 ")],-1),z={class:"row"},G={class:"col-md-6"},H=o("h2",{class:"text-center my-2"},"銀行帳",-1),J={class:"col-md-6"},O=o("h2",{class:"text-center my-2"},"系統帳",-1);function Q(e,n,l,F,s,c){const v=m("el-date-picker"),b=m("el-option"),_=m("el-select"),i=m("el-table-column"),p=m("el-table"),w=m("el-button"),C=m("el-input"),N=m("el-dialog");return d(),g("div",Y,[M,o("form",B,[o("div",U,[a(v,{class:"align-self-stretch",style:{width:"100%"},modelValue:s.searchData.date,"onUpdate:modelValue":n[0]||(n[0]=t=>s.searchData.date=t),type:"date",placeholder:"請選擇對帳日期",format:"YYYY/MM/DD","value-format":"YYYY-MM-DD"},null,8,["modelValue"])]),o("div",E,[a(_,{modelValue:s.searchData.payment,"onUpdate:modelValue":n[1]||(n[1]=t=>s.searchData.payment=t),placeholder:"請選擇金流來源"},{default:r(()=>[(d(!0),g(y,null,D(s.payments,t=>(d(),k(b,{key:t,label:t,value:t},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),o("div",R,[a(_,{modelValue:s.searchData.bankAccount,"onUpdate:modelValue":n[2]||(n[2]=t=>s.searchData.bankAccount=t),placeholder:"請選擇銀行來源"},{default:r(()=>[(d(!0),g(y,null,D(s.bankAccounts,t=>(d(),k(b,{key:t,label:t,value:t},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),o("div",K,[o("button",{class:"btn btn-success",onClick:n[3]||(n[3]=f((...t)=>c.show&&c.show(...t),["prevent"]))},"顯示"),o("button",{class:"btn btn-outline-success",onClick:n[4]||(n[4]=f((...t)=>c.transfer&&c.transfer(...t),["prevent"]))},"轉傳票")])]),o("div",L,[o("p",P,[h(" 銀行帳未核銷日期：1/2、1/5 "),j,o("span",null,"未核筆數 "+T(s.bankFlow.length)+" 筆 / 總筆數 10 筆",1)]),q]),o("div",z,[o("div",G,[H,a(p,{data:s.bankFlow,"row-style":{height:"50px"},"row-class-name":c.customRowClassName,height:"450"},{default:r(()=>[a(i,{align:"center",prop:"stationName",label:"場站名稱",width:"180"}),a(i,{align:"center",prop:"postingDate",label:"入帳日",width:"180"}),a(i,{align:"center",prop:"amount",sortable:"",formatter:c.amountFormatter,label:"金額",width:"80"},null,8,["formatter"]),a(i,{align:"center",prop:"note",label:"備註",width:"180"})]),_:1},8,["data","row-class-name"])]),o("div",J,[O,a(p,{data:s.systemFlow,"row-style":{height:"50px"},"row-class-name":c.customSystemRowClassName,height:"450"},{default:r(()=>[a(i,{align:"center",prop:"stationName",label:"場站名稱",width:"180"}),a(i,{align:"center",prop:"postingDate",label:"交易日",width:"120"}),a(i,{align:"center",prop:"amount",sortable:"",formatter:c.amountFormatter,label:"金額",width:"80"},null,8,["formatter"]),a(i,{align:"center",prop:"transactionCode",label:"交易代號",width:"100"}),a(i,{align:"center",label:"明細",width:"180"},{default:r(t=>[a(w,{onClick:u=>c.openDetailDialog(t)},{default:r(()=>[h("查看明細")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data","row-class-name"])]),a(N,{modelValue:s.dialogTableVisible,"onUpdate:modelValue":n[5]||(n[5]=t=>s.dialogTableVisible=t),"close-on-click-modal":!1,align:"center",title:"交易明細",width:"70vw"},{default:r(()=>[a(p,{data:s.systemFlowDetails},{default:r(()=>[a(i,{align:"center",property:"transactionTime",label:"交易時間"}),a(i,{align:"center",label:"金額"},{default:r(t=>[a(C,{modelValue:t.row.amount,"onUpdate:modelValue":u=>t.row.amount=u,onKeyup:A(u=>c.handleAmountChange(t.row),["enter"]),min:0,step:5,type:"number"},null,8,["modelValue","onUpdate:modelValue","onKeyup"])]),_:1}),a(i,{align:"center",label:"調整"},{default:r(t=>[a(w,{onClick:u=>c.handleAmountChange(t.row)},{default:r(()=>[h("確認調整")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"])]),_:1},8,["modelValue"])])])}const X=V(S,[["render",Q]]);export{X as default};

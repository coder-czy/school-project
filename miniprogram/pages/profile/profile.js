// miniprogram/pages/profile/profile.js
import {tool} from '../../js/tool'
var wxCharts = require('../../js/wxcharts.js')


const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar:{},

    // 用户个人信息
    userInfo:{},

      // 年
      year:'',

      // 月
      month:'',
  
      // 时间选择器的结束时间
      end:'',
  
      date:'',
      // 31天数的月份
      day31: ['01', '03', '05', '07', '08', '10', '12'],
  
      // 月份对应的开始时间和结束时间
      startDate:'',
      endDate:'',
  
      // 每月渲染数据
      bookingData:'',
  
      // 本月总收入和总支出结余
      shouru:'0.00',
      zhichu:'0.00',
      surplus:'0.00',

      // 连续打卡天数、记账总天数、记账总笔数
      continueBookingDate:0,
      totalBookingDateCount:0,
      totalBookingTimes:0,

      // 本月预算
      budget:'100.00',
      surplusBudget:'100.00',

      // 判断是否有记账数据
      isHasData:true,

      // 是否显示签到弹窗
      isShow:false,

      // 是否签到
      isCheckIn:false,
      // 签到时间
      checkInTime:'',

      // 保存画图参数
      series:[],
      title:{},

      shouruObj:{
        shouru1:'0',
        shouru2:'00'
      },
      zhichuObj:{
        zhichu1:'0',
        zhichu2:'00'
      },
      surplusObj:{
        surplus1:'0',
        surplus2:'00'
      },
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar()
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow(){
   this.getUserInfo()
   this.getUserData()
   this.getdate()
  //  this.findBookingDataByDate()
   
  },

  
   // 获取用户信息
   getUserData(){
   let isAuth = app.globalData.isAuth
      if(!isAuth){
        let title= {
         name: '100%',
         color: '#333333',
         fontSize: 16
       }
      let series=[{color:'#ffdd4a',data:100},{color:'#f2f2f2',data:0}]
         this.drawPie(series,title)
         return
       }
     
    wx.cloud.callFunction({
      name:'get_userData'
    }).then(res=>{
      console.log('userData==>',res);
     this.initData(res.result.data[0])
     this.findBookingDataByDate()

    }).catch(err=>{
      console.log('err=>',err);
    })
  },

  // 初始化打卡等时间
  initData(data){

    let time = tool.formatDate(new Date()) 
    let checkInTime = tool.formatDate(new Date(data.checkInTime))
    if(time==checkInTime){
      this.setData({
        isCheckIn:true
      })
    }
    console.log(time,checkInTime);
    this.setData({
      continueBookingDate:data.continueBookingDate,
      totalBookingDateCount:data.totalBookingDate,
      totalBookingTimes:data.totalBookingTimes,
      // 本月预算
      budget:data.budget.toFixed(2),
      checkInTime : data.checkInTime
    })

    this.judgeContinueTime()
  },


    // 获取用户微信头像等信息
    getUserInfo(){
    let isAuth = app.globalData.isAuth;
    console.log(app.globalData);
    console.log('isAuth==>',isAuth)
    if(isAuth){
                let res = app.globalData
                this.setData({
                  userInfo:{
                    img:res.userInfo.avatarUrl,
                    nickname: res.userInfo.nickName
                  }
                })
              }
    },

  // 用户授权登录
  toAuth(){
        // 判断用户是否已授权
        let isAuth = app.globalData.isAuth;
        console.log('isAuth==>',isAuth)
        if(!isAuth){
          wx.navigateTo({
            url: '../auth/auth',
          })
          return
        }
  },

  // 跳转当月账单详情页
  goMonthDetail(){
    wx.switchTab({
      url: '../history/history',
    })
  },




  // 获取日期
  getdate(){
    let date = new Date()
    let month = date.getMonth()+1
    month=month<10?'0'+month : month
    let day = date.getDate()
    day=day<10?'0'+day : day
    let time = `${date.getFullYear()}-${month}-${day}`
    this.setData({
     end:time,
     date:time,
     year:date.getFullYear(),
     month
      
    })
    console.log(month,this.data.year,this.data.end);

  },
  // 根据月获取数据
  getBookingData(start,end){
    // 如果未授权则阻止
    let isAuth = app.globalData.isAuth;
  //   if(!isAuth){
  //    let title= {
  //     name: '100%',
  //     color: '#333333',
  //     fontSize: 16
  //   }
  //  let series=[{color:'#ffdd4a',data:100},{color:'#f2f2f2',data:0}]
  //     this.drawPie(series,title)
  //     return
  //   }
    wx.showNavigationBarLoading()
    wx.cloud.callFunction({
      name:"get_bookingByMonth",
      data:{
        start,
        end
      }
    }).then(res=>{
      wx.hideNavigationBarLoading();
      console.log('res==>',res);

      let bookingData=[]
      let data = res.result.data
      let allShouru =0
      let allZhichu = 0

      // 判断是否有记账数据
      if(data.length<=0){
        this.setData({
          isHasData:false
        })
      }else{
        this.setData({
          isHasData:true
        })
      }

      for(let i=0;i<data.length;i++){
        let keys = Object.keys(bookingData)
        let flag = true

        for(let j =0;j<keys.length;j++){

          if(keys[j]==data[i].date){
            console.log(data[i]);
            bookingData[keys[j]].push(data[i])
            flag=false
            break;
          }
        }
        if(flag){

          bookingData[data[i].date]=[data[i]]
        }
      }

      
      console.log(bookingData);

      // 对数据进一步处理
      let arr = []
      for(let key in bookingData){
        let obj = {}
        let shouru = 0
        let zhichu = 0
        obj.dateItem = key.split('-')[1]+'月'+key.split('-')[2]+'日'
        obj.week = this.getWeek(new Date(key).getDay())
        obj.data = bookingData[key]

        for(let i=0;i<bookingData[key].length;i++){
          if(bookingData[key][i].titles.type=='zhichu'){
            zhichu += bookingData[key][i].money*1
          }else if(bookingData[key][i].titles.type=='shouru'){
            shouru += bookingData[key][i].money*1

          }
        }

        obj.zhichu = zhichu
        obj.shouru = shouru
        allShouru+=shouru
        allZhichu+=zhichu

        arr.push(obj)
        
      }
      this.setData({
        allMonthData:data,
        bookingData:arr.reverse(),
        shouru:allShouru.toFixed(2),
        zhichu:allZhichu.toFixed(2),
        surplus:(allShouru-allZhichu).toFixed(2),
        surplusBudget:(this.data.budget - allZhichu).toFixed(2),
        shouruObj:{
          shouru1:allShouru.toFixed(2).split('.')[0],
          shouru2:allShouru.toFixed(2).split('.')[1]
        },
        zhichuObj:{
          zhichu1:allZhichu.toFixed(2).split('.')[0],
          zhichu2:allZhichu.toFixed(2).split('.')[1]
        },
        surplusObj:{
          surplus1:(allShouru-allZhichu).toFixed(2).split('.')[0],
          surplus2:(allShouru-allZhichu).toFixed(2).split('.')[1],

        }
      })
      console.log(arr);

      let title = Math.floor((this.data.surplusBudget*1/this.data.budget*1)*100)+'%'
      let color = ''
      let sBedget = this.data.surplusBudget*1
      if(sBedget>=0){
        color='#666'
      }else{
        sBedget = 0
        title='已超支',
        color='#e4393c'
      }
      console.log(title,color,sBedget);
      this.drawPie(
        [{color:'#ffdd4a',data:sBedget},{color:'#f2f2f2',data:this.data.zhichu*1}],
        {
            name: title,
            color: color,
            fontSize: 16
          }
      )
      this.setData({
        series: [{color:'#ffdd4a',data:sBedget},{color:'#f2f2f2',data:this.data.zhichu*1}],
        title: {
          name: title,
          color: color,
          fontSize: 16
        }
      })

    }).catch(error=>{
      wx.hideNavigationBarLoading();
      console.log('获取数据失败',error);
    })
  },

  // 判断选中的时间
  findBookingDataByDate: function () {

   
    var start = '';
    var end = '';

    var currentDate = this.data.date.split('-');
    var today = new Date();

      start = currentDate[0] + '-' + currentDate[1] + '-01';

      if (currentDate[0] == today.getFullYear()) {
        if (currentDate[1] == today.getMonth() + 1) {
          end = currentDate[0] + '-' + currentDate[1] + '-' + today.getDate();

        } else {

          if (currentDate[1] == 2) {
            if (currentDate[0] % 400 == 0 || (currentDate[0] % 4 == 0 && currentDate[0] % 100 != 0)) {
              end = currentDate[0] + '-' + currentDate[1] + '-29';
            } else {
              end = currentDate[0] + '-' + currentDate[1] + '-28';
            }

          } else {

            if (this.data.day31.indexOf(currentDate[1]) > -1) {
              end = currentDate[0] + '-' + currentDate[1] + '-31';
            } else {
              end = currentDate[0] + '-' + currentDate[1] + '-30';
            }
          }

        }

      } else {

        if (currentDate[1] == 2) {
          if (currentDate[0] % 400 == 0 || (currentDate[0] % 4 == 0 && currentDate[0] % 100 != 0)) {
            end = currentDate[0] + '-' + currentDate[1] + '-29';
          } else {
            end = currentDate[0] + '-' + currentDate[1] + '-28';
          }

        } else {

          if (this.data.day31.indexOf(currentDate[1]) > -1) {
            end = currentDate[0] + '-' + currentDate[1] + '-31';
          } else {
            end = currentDate[0] + '-' + currentDate[1] + '-30';
          }
        }

      }

    this.setData({
      startDate: start,
      endDate: end
    })
    // console.log(this.data.startDate,this.data.endDate);
    this.getBookingData(start,end)

  },

  // 判断星期
  getWeek(num){
    let week = ''
    switch (true) {
      case num==1:
        week='星期一'
        break;
      case num==2:
        week='星期二'
        break;
      case num==3:
        week='星期三'
        break;
      case num==4:
        week='星期四'
        break;
      case num==5:
        week='星期五'
        break;
      case num==6:
        week='星期六'
        break;
      case num==0:
        week='星期日'
        break;
 
    }
    return week
  },


  // 签到
  checkIn(){
    // console.log(app.globalData.isAuth);
    if(!app.globalData.isAuth){
      return
    }
    if(this.data.isCheckIn){
      return
    }

    // 判断打卡状态
    let time = tool.formatDate(new Date()) 
    let ciTime = tool.formatDate(new Date(this.data.checkInTime))
    let timeDiff = Date.now() - this.data.checkInTime
    let timeMS = 48*60*60*1000
    // 更新userData数据

    let sendData = { }

   
    if(time !== ciTime){
      
      // 判断是否连续打卡
      if(0<timeDiff&&timeDiff<=timeMS){
        
        sendData.continueBookingDate=this.data.continueBookingDate+1
        sendData.checkInTime=Date.now()
      }else{
        sendData.continueBookingDate=1
        sendData.checkInTime=Date.now()
      }
    }
    console.log('sendData==>',sendData);
    
    // 调用update方法
    this.updateUserData(sendData).then(res=>{

      this.setData({
        isCheckIn:true,
        isShow:true,
        continueBookingDate: sendData.continueBookingDate
      })
    })

    // wx.cloud.callFunction({
    //   name:'get_userData'
    // }).then(res=>{
    //   console.log('userData==>',res);
    //  let continueBookingDate = res.result.data[0].continueBookingDate
    //  console.log('continueBookingDate',continueBookingDate);
    //  this.setData({
    //   continueBookingDate
    //  })
    // }).catch(err=>{
    //   console.log('err=>',err);
    // })
   
  },

  judgeContinueTime(){
    if(!app.globalData.isAuth){
      return
    }

    // 判断打卡状态
    let time = tool.formatDate(new Date()) 
    let ciTime = tool.formatDate(new Date(this.data.checkInTime))
    let timeDiff = Date.now() - this.data.checkInTime
    let timeMS = 48*60*60*1000
    // 更新userData数据

    let sendData = { }
    if(time !== ciTime){
      
      // 判断是否连续打卡
      if(0<timeDiff&&timeDiff<=timeMS){

      }else{
        sendData.continueBookingDate=0
        this.setData({
          continueBookingDate:0
        })
      }
    }
    console.log('sendData==>',sendData);
    
    // 调用update方法
    this.updateUserData(sendData)
  },

  // 更新userData
  updateUserData(data){
    let _this = this
    return new Promise((resolve,reject)=>{

      wx.cloud.callFunction({
        name:'update_userData',
        data
      }).then(res=>{
        console.log('update==>',res);
        resolve()
      }).catch(err=>{
        console.log(err);
      })
    })
  },

  // 跳转打卡规则
  goRule(){
    wx.navigateTo({
      url: '../rule/rule',
    })
  },

  // 关闭弹窗
  close(){
    this.setData({
      isShow:false
    })
  },

  // 画饼图
  drawPie:function(series,title){
    if(series.length==0){
      return
    }
    const res = wx.getSystemInfoSync();

    this.setData({
      width:res.screenWidth
    })
    new wxCharts({
      canvasId:'pieCanvas',

      // type:'pie',
      /*
      换成环形
      */
     type:'ring',
     extra:{
      ringWidth:15,
      pie:{
        offsetAngle:-90
      },
     
     
     },
     title,
    //  title: {
    //   name: '100%',
    //   color: '#333333',
    //   fontSize: 16
    // },
      series:series,
      disablePieStroke: true,
      width:140,
      height:140,
      dataLabel:false,
      legend:false
    })
  },

  // 跳转预算详情
  goToBudgetDetail(){
    if(!app.globalData.isAuth) return
    let monthData = JSON.stringify(this.data.bookingData)
    let allMonthData = JSON.stringify(this.data.allMonthData)
    let drawData =JSON.stringify( {
      surplus:this.data.surplus,
      budget:this.data.budget,
      zhichu:this.data.zhichu,
      surplusBudget:this.data.surplusBudget
    })
    let series = JSON.stringify(this.data.series)
    let title = JSON.stringify(this.data.title)
 
    wx.navigateTo({
      url: '../budgetDetail/budgetDetail?monthData='+monthData+'&drawData='+drawData+'&series='+series+'&title='+title+'&allMonthData='+allMonthData,
    })
  }
  
})
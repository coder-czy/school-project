// miniprogram/pages/profile/profile.js
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
  
      // 总收入和总支出
      shouru:'',
      zhichu:'',
  
      // 判断是否有记账数据
      isHasData:true,

      // 是否显示签到弹窗
      isShow:false,

      // 是否签到
      isCheckIn:false
  
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
   this.getdate()
   this.findBookingDataByDate()
   this.drawPie(
     [{color:'#ffdd4a',data:80},{color:'#fff',data:20}]
   )
  },

    // 获取用户信息
    getUserInfo(){
let isAuth = app.globalData.isAuth;
console.log(app.globalData);
console.log('isAuth==>',isAuth)
if(isAuth){
        // 需授权才可使用
        wx.getUserInfo({
          success:res=>{
            console.log('res==>',res)
            this.setData({
              userInfo:{
                img:res.userInfo.avatarUrl,
                nickname: res.userInfo.nickName
              }
            })
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
        bookingData:arr.reverse(),
        shouru:allShouru.toFixed(2),
        zhichu:allZhichu.toFixed(2),
        surplus:(allShouru-allZhichu).toFixed(2)
      })
      console.log(arr);
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
    if(this.data.isCheckIn){
      return
    }
    this.setData({
      isCheckIn:true,
      isShow:true
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
  drawPie:function(series){
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
      ringWidth:20,
      pie:{
        offsetAngle:-90
      },
     
     },
      series:series,
      disablePieStroke: true,
      width:140,
      height:140,
      dataLabel:false,
      legend:false
    })
  },
  
})
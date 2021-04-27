// miniprogram/pages/history/history.js

const { tool } = require("../../js/tool")

const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar:{},

    // 选择的时间
    year:'',

    // 记账数据
    bookingData:[],

    // 总结余
    surplus:0.00,

    // 总收入，总支出
    shouru:0.00,
    zhichu:0.00,

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




  onLoad: function (options) {
    app.editTabbar()
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTime()
    this.getYearData()
  },

  // 获取当前时间
  getTime(){
    let time 
    if(app.globalData.selectYear){
      time = app.globalData.selectYear
    }else{
      time = new Date().getFullYear()
    }
    this.setData({
      year:time
    })
  },

  // 时间选择器的获取时间方法
  bindTimeChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      year:e.detail.value
    })
    app.globalData.selectYear = e.detail.value
    this.getYearData()
    
  },

  getYearData(){
    if(!app.globalData.isAuth){
      return
    }
    let selectYear = this.data.year
    this.getBookingData(selectYear+'-01-01',selectYear+'-12-31')
  },
  // 获取一年的数据
  getBookingData(start,end){
    wx.showNavigationBarLoading()
    wx.cloud.callFunction({
      name:'get_bookingByMonth',
      data:{
        start,
        end
      }
    }).then(res=>{
      // console.log(res);
    wx.hideNavigationBarLoading()

      // 对数据进一步处理
    let allShouru =0
    let allZhichu =0
    let year = new Date().getFullYear()
    let selectYear = this.data.year
    let monthArr = []
    if(year+''==selectYear+''){
      console.log(year,selectYear);
      let month = new Date().getMonth()+1
      for(let i=1;i<=month;i++){
        monthArr.unshift({month:i,data:[]})
      }

    }else{
      for(let j=1;j<=12;j++){
        monthArr.unshift({month:j,data:[]})

      }
    }

    let data= res.result.data

    for(let k=0;k<data.length;k++){

      for(let l=0;l<monthArr.length;l++){
        if(monthArr[l].month==data[k].date.split('-')[1]){
          monthArr[l].data.push(data[k])
        }
      }
    }
    console.log(monthArr);
    let allData = []
    
    for(let q=0;q<monthArr.length;q++){
      let bookingData = {}
      let shouru =0
      let zhichu = 0
      let surplus = 0

      bookingData.month = monthArr[q].month
      bookingData.data = monthArr[q].data
      if(monthArr[q].data.length>0){
        for(let a=0;a<monthArr[q].data.length;a++){
          if(monthArr[q].data[a].titles.type=='shouru'){

            shouru+= monthArr[q].data[a].money*1
          }else{

            zhichu+= monthArr[q].data[a].money*1
          }
        }

      }else{
      shouru = 0.00
      zhichu = 0.00
      surplus = 0.00
       

      }
      allShouru += shouru*1
      allZhichu += zhichu*1
      bookingData.shouru = shouru.toFixed(2)
      bookingData.zhichu = zhichu.toFixed(2)
      bookingData.surplus = (shouru-zhichu).toFixed(2)
      allData.push(bookingData)
      
      console.log(bookingData);
      continue;
    }

    
    this.setData({
      shouru:tool.thousandthPlace(allShouru.toFixed(2)),
      zhichu:tool.thousandthPlace(allZhichu.toFixed(2)),
      surplus:tool.thousandthPlace((allShouru-allZhichu).toFixed(2)),
      bookingData:allData,
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
    console.log(this.data.bookingData,allData);

    // 计算总收入，总支出，结余
    

    }).catch(err=>{
      console.log('获取整年数据出错',err);
      wx.hideNavigationBarLoading()


    })
  },

  goMonthDetail(e){
    console.log(e);
    let data = JSON.stringify(e.currentTarget.dataset.booking)
    let allData = JSON.stringify(this.data.bookingData)
    wx.navigateTo({
      url: '../monthDetail/monthDetail?data='+data+'&allData='+allData,
    })
  }

})
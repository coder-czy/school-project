// miniprogram/pages/index/index.js

const app =getApp()
import {tool} from '../../js/tool' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabbar栏数据
    tabbar:{},

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

    shouruObj:{},
    zhichuObj:{},

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
  onShow: function () {
    this.getdate()
    this.findBookingDataByDate()
    // console.log(this.getWeek(5));
  },

  // 获取时间选择器的时间
  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      year: e.detail.value.split('-')[0],
      month:e.detail.value.split('-')[1],
      date:e.detail.value
    })
    this.findBookingDataByDate()
    // console.log(this.data.month,this.data.year,this.data.end);
    
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
      // 排序
      arr.sort((a,b)=>{
        return a.dateItem.split('日')[0].split('月')[1] - b.dateItem.split('日')[0].split('月')[1]
      })


      this.setData({
        bookingData:arr.reverse(),
        shouru:allShouru.toFixed(2),
        zhichu:allZhichu.toFixed(2),
        shouruObj:{
          shouru1:allShouru.toFixed(2).split('.')[0],
          shouru2:allShouru.toFixed(2).split('.')[1]
        },
        zhichuObj:{
          zhichu1:allZhichu.toFixed(2).split('.')[0],
          zhichu2:allZhichu.toFixed(2).split('.')[1]
        },
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

  // 跳转详情页面
  goDetail(e){
    // console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../bookingDetail/bookingDetail?id='+e.currentTarget.dataset.id,
    })
  }

})
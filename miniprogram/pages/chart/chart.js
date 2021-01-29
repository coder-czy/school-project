// miniprogram/pages/chart/chart.js
// 引入canvas插件
import * as echarts from '../../ec-canvas/echarts';
import { tool } from '../../js/tool.js'
const app =getApp()
let wxCharts = require('../../js/wxcharts.js')
let chart = null
let data =[{value:100,name:'shju'},
            {value:150,name:'jsj'}
  ]
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  chart.showLoading(); // 首次显示加载动画
  canvas.setChart(chart);
  let option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}:({d}%)'
  },
  legend: {
      top: '5%',
      left: 'center'
  },
  series: [
      {
          name: '访问来源',
          type: 'pie',
          radius: ['50%', '90%'],
          avoidLabelOverlap: false,
          top: '20%',
         
          label: {
              show: false,
              position: 'center'
          },
          emphasis: {
              label: {
                  show: true,
                  fontSize: '20',
                  fontWeight: 'bold'
              }
          },
          labelLine: {
              show: false
          },
          data
      }
  ]
  };
  chart.hideLoading(); // 隐藏加载动画
  chart.setOption(option);
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar:{},

    // 记账类型
    payType:'zhichu',
    // 记账时间范围
    timeType:'month',


    dateTitle: '月',

    //月份
    day31: ['01', '03', '05', '07', '08', '10', '12'],
    // day30: ['04', '06', '09', '11'],

    //分类
    bookingDataType: [],

    startDate: '',
    endDate: '',
    
    // canvans图的宽度
    width:0,

    ec: {
      onInit: initChart
    }

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
    let date = tool.formatDate(new Date());
    this.setData({
      date : date
    })
    this.findBookingDataByDate()
    
  },

  // 改变支付类型
  changePay(e){
    if(e.currentTarget.dataset.pay==this.data.payType) return
    console.log(e.currentTarget);
    this.setData({
      payType:e.currentTarget.dataset.pay
    })

    this.findBookingDataByDate()

  },


  // 改变时间类型
  changeTime(e){
    if(e.currentTarget.dataset.time==this.data.timeType) return
    console.log(e.currentTarget);
    this.setData({
      timeType:e.currentTarget.dataset.time
    })
    this.findBookingDataByDate()

 
  },





  findBookingDataByDate: function () {

   
   let titles={
      type:this.data.payType== 'shouru' ? 'shouru' : 'zhichu',
      title: this.data.payType== 'shouru' ? '收入' : '支出'
    }
    let start = '';
    let end = '';

    let currentDate = this.data.date.split('-');
    let today = new Date();

    if (this.data.timeType == 'month') {
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

      this.getBookingData('get_bookingByMonth', {
        start: start,
        end: end,
        titles: titles
      });


  

    } else if (this.data.timeType == 'year') {
      start = currentDate[0] + '-01-01';
      if (currentDate[0] == today.getFullYear()) {

        end = currentDate[0] + '-' + (today.getMonth() + 1) + '-' + today.getDate();

      } else {
        end = currentDate[0] + '-12-31';
      }

      this.getBookingData('get_bookingByMonth', {
        start: start,
        end: end,
        titles: titles
      });


    } else {
      start = this.data.date;
      this.getBookingData('get_bookingData', {
        date: start,
        titles: titles
      });

    }

    this.setData({
      startDate: start,
      endDate: end
    })

  },

  getBookingData: function (fnName, condition) {

    wx.showNavigationBarLoading()
    wx.cloud.callFunction({
      name: fnName,
      data: condition,
      success: res => {
        wx.hideNavigationBarLoading()
        console.log('res ==> ', res);

        let bookingDatas = {};

        //分类
        let totalMoney = 0;
        res.result.data.forEach(v => {
          totalMoney += Number(v.money)
          let type = v.typeIcons.type;
          if (!bookingDatas[type]) {
              let rgb =[];
            for(let i=0 ; i<3;i++){
              let value = Math.ceil(Math.random()*255);
              rgb.push(value)
            }
            bookingDatas[type] = {
              icon: v.typeIcons.icon,
              title: v.typeIcons.title,
              count: 1,
              money: Number(v.money),
              ids: [v._id],
              type: v.titles.type,
              data: Number(v.money),
              color:'rgb('+rgb.join(',')+')',
              name:v.typeIcons.title,
              format:function(v1){
                return v.typeIcons.title+' '+(v1*100).toFixed(3)+'%'
              }
            }
          } else {
            bookingDatas[type].count++;
            bookingDatas[type].money += Number(v.money);
            bookingDatas[type].ids.push(v._id);
            bookingDatas[type].data += Number(v.money);
          }


        })

        let bData = [];
        let chartData = []
        for (let key in bookingDatas) {
          let obj ={}
          //处理千分位
         bookingDatas[key].money = tool.thousandthPlace(bookingDatas[key].money);
          bookingDatas[key].percent = bookingDatas[key].data/totalMoney*100+'%'
          bookingDatas[key].ids = bookingDatas[key].ids.join('@');
          // bookingDatas[key].stroke = false
          bData.push(bookingDatas[key]);

          // 将数据存入data中
          obj.value = tool.thousandthPlace(bookingDatas[key].money)*1;
          obj.name =  bookingDatas[key].name
          chartData.push(obj)
        }

        this.setData({
          bookingDataType: bData
        });
        data = chartData
        // chart.setOption({
         
        //     data:[{value:10,name:'11'},{value:12,name:'22'},{value:15,name:'33'}]  //全局变量
        
         
        // });

          console.log('bookingDataType ==> ', this.data.bookingDataType);
          console.log('ec ==> ', this.data.ec);
        
      },
      fail: err => {
        wx.hideNavigationBarLoading()

        console.log('err ==> ', err);
      }
    })

  },

  //获取收入和支出
  getTotal: function (fnName, condition) {
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: fnName,
      data: condition,
      success: res => {
        wx.hideLoading();
        console.log('总数 res ==> ', res);

        //统计收入-支出
        this.data.titles.forEach(v => {
          let type = v.type;
          v.money = 0;
          res.result.data.forEach(item => {
            if (type == item.titles.type) {
              v.money += Number(item.money);
            }
          })
          //处理千分位
          v.money = tool.thousandthPlace(v.money.toFixed(2));
        })

        this.setData({
          titles: this.data.titles
        })

      },
      fail: err => {
        wx.hideLoading();
        console.log('err ==> ', err);
      }
    })
  },

  viewBookData:function(e){
    console.log(111)
    wx.navigateTo({
      url: '../detail/detail?ids='+e.currentTarget.dataset.ids,
    })
},



})
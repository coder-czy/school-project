// miniprogram/pages/chart/chart.js
// 引入canvas插件
import * as echarts from '../../ec-canvas/echarts';

const app =getApp()
var wxCharts = require('../../js/wxcharts.js')

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  var option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
      top: '5%',
      left: 'center'
  },
  series: [
      {
          name: '访问来源',
          type: 'pie',
          radius: ['50%', '80%'],
          avoidLabelOverlap: false,
          top: '15%',
         
          label: {
              show: false,
              position: 'center'
          },
          emphasis: {
              label: {
                  show: false,
                  fontSize: '40',
                  fontWeight: 'bold'
              }
          },
          labelLine: {
              show: false
          },
          data: [
              {value: 1048, name: '搜索引擎'},
              {value: 735, name: '直接访问'},
              {value: 580, name: '邮件营销'},
              {value: 484, name: '联盟广告'},
              {value: 300, name: '视频广告'}
          ]
      }
  ]
  };

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

  },

  // 改变支付类型
  changePay(e){
    if(e.currentTarget.dataset.pay==this.data.payType) return
    console.log(e.currentTarget);
    this.setData({
      payType:e.currentTarget.dataset.pay
    })
  },


  // 改变时间类型
  changeTime(e){
    if(e.currentTarget.dataset.time==this.data.timeType) return
    console.log(e.currentTarget);
    this.setData({
      timeType:e.currentTarget.dataset.time
    })
  },

  // 绘制饼图
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
      ringWidth:40,
      pie:{
        offsetAngle:-45
      }
     },
      series:series,
      disablePieStroke: true,
      width:this.data.width,
      height:300,
      dataLabel:true
    })
  },

  toggleTitles: function (e) {
   
    var condition = {
      titles: {
        type: this.data.titles[e.currentTarget.dataset.index].type,
        title: this.data.titles[e.currentTarget.dataset.index].name
      }
    };
    var fnName = '';
    if (this.data.endDate == '') {
      //按日查询
      fnName = 'get_booking';
      condition.date = this.data.startDate;
    } else {
      fnName = 'get_booking_bymonth';
      condition.start = this.data.startDate;
      condition.end = this.data.endDate;
    }

    this.getBookingData(fnName, condition);

  },




  findBookingDataByDate: function () {

    var titles = {};
    for (var i = 0; i < this.data.titles.length; i++) {
      if (this.data.titles[i].isActive) {
        titles = {
          type: this.data.titles[i].type,
          title: this.data.titles[i].name
        }
        break;
      }
    }
    var start = '';
    var end = '';

    var currentDate = this.data.date.split('-');
    var today = new Date();

    if (this.data.dateTitle == '月') {
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

      this.getBookingData('get_booking_bymonth', {
        start: start,
        end: end,
        titles: titles
      });


      //获取总收入和支出
      this.getTotal('get_booking_bymonth', {
        start: start,
        end: end,
      });

    } else if (this.data.dateTitle == '年') {
      start = currentDate[0] + '-01-01';
      if (currentDate[0] == today.getFullYear()) {

        end = currentDate[0] + '-' + (today.getMonth() + 1) + '-' + today.getDate();

      } else {
        end = currentDate[0] + '-12-31';
      }

      this.getBookingData('get_booking_bymonth', {
        start: start,
        end: end,
        titles: titles
      });

      this.getTotal('get_booking_bymonth', {
        start: start,
        end: end,
      });

    } else {
      start = this.data.date;
      this.getBookingData('get_booking', {
        date: start,
        titles: titles
      });

      this.getTotal('get_booking', {
        date: start
      });
    }

    this.setData({
      startDate: start,
      endDate: end
    })

  },

  getBookingData: function (fnName, condition) {

    wx.showLoading({
      title: '加载中...'
    })
    wx.cloud.callFunction({
      name: fnName,
      data: condition,
      success: res => {
        wx.hideLoading();
        console.log('res ==> ', res);

        var bookingDatas = {};

        //分类
        var totalMoney = 0;
        res.result.data.forEach(v => {
          totalMoney += Number(v.money)
          var type = v.typeIcons.type;
          if (!bookingDatas[type]) {
              var rgb =[];
            for(var i=0 ; i<3;i++){
              var value = Math.ceil(Math.random()*255);
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

        var bData = [];
        for (var key in bookingDatas) {
          //处理千分位
          bookingDatas[key].money = tool.thousandthPlace(bookingDatas[key].money);
          bookingDatas[key].percent = bookingDatas[key].data/totalMoney*100+'%'
          bookingDatas[key].ids = bookingDatas[key].ids.join('@');
          // bookingDatas[key].stroke = false
          bData.push(bookingDatas[key]);
        }

        this.setData({
          bookingDataType: bData
        });

          console.log('bookingDataType ==> ', this.data.bookingDataType);
        this.drawPie(this.data.bookingDataType)
      },
      fail: err => {
        wx.hideLoading();
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
          var type = v.type;
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
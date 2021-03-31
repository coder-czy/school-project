// miniprogram/pages/budgetDetail/budgetDetail.js
import * as echarts from '../../ec-canvas/echarts';
var wxCharts = require('../../js/wxcharts.js')
const app = getApp()


let chart = null
let data =[]
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  chart.showLoading(); // 首次显示加载动画
  canvas.setChart(chart);
  
var dataBJ = [
  
  [367,216,280,4.8,308,64,9],

];


var lineStyle = {
  normal: {
      width: 1,
      opacity: 0.5
  }
};

let option = {
  // backgroundColor: '#161627',
  title: {
      text: '预算使用详细',
      left: 'center',
      textStyle: {
          color: '#eee'
      }
  },
  legend: {
      bottom: 5,
      data: ['北京'],
      itemGap: 20,
      textStyle: {
          color: '#fff',
          fontSize: 14
      },
      selectedMode: 'single'
  },
  // visualMap: {
  //     show: true,
  //     min: 0,
  //     max: 20,
  //     dimension: 6,
  //     inRange: {
  //         colorLightness: [0.5, 0.8]
  //     }
  // },
  radar: {
    radius:'60%',
      indicator: [
          {name: 'AQI', },
          {name: 'PM2.5', },
          {name: 'PM10', },
          {name: 'CO', },
          {name: 'NO2', },
          {name: 'SO2', }
      ],
      shape: 'circle',
      splitNumber: 5,
      name: {
          textStyle: {
              color: 'rgb(238, 197, 102)'
          }
      },
      splitLine: {
          lineStyle: {
              color: [
                  'rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)',
                
              ].reverse()
          }
      },
      splitArea: {
          show: false
      },
      axisLine: {
          lineStyle: {
              color: 'rgba(238, 197, 102, 0.5)'
          }
      }
  },
  series: [
      {
          name: '北京',
          type: 'radar',
          lineStyle: lineStyle,
          data: dataBJ,
          symbol: 'none',
          itemStyle: {
              color: '#F9713C'
          },
          areaStyle: {
              opacity: 0.1
          }
      },
   
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
    month:0,
    monthData:[],
    surplus:0.00,
    budget:0.00,
    zhichu:0.00,
    surplusBudget:0.00,
    series:[],
    title:{},

    // 是否显示
    isShow:false,
      //在真机上将焦点给input
      inputFocus:true,
      //初始占位清空
      inputInfo: '',

      showInput:false,
         // canvans图的宽度
    width:0,

    ec: {
      onInit: initChart
    },
    isHasData:true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let monthData = JSON.parse(options.monthData)
    let drawData = JSON.parse(options.drawData)
    let series = JSON.parse(options.series)
    let title = JSON.parse(options.title)
    this.setData({
      monthData,
      surplus:drawData.surplus,
      budget:drawData.budget,
      zhichu:drawData.zhichu,
      surplusBudget:drawData.surplusBudget,
      series,
      title,
      newBudget:''
      
    })
    this.drawPie(series,title)
  },

 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let nowMonth = new Date().getMonth()
    this.setData({
      month:nowMonth+1
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

    // 显示编辑预算
    showEditBudget(){
      this.setData({
        isShow:true
      })
    },
  
    
    cancle(){
      this.setData({
        isShow:false,
        showInput:false
      })
    },

    comfirm(){
      if(this.data.newBudget*1<=0 || this.data.newBudget == ''){
        return
      }
      let sendData = {}
      let series = this.data.series
      let pieTitle = this.data.title
      let sBedget = this.data.newBudget*1-this.data.zhichu
      let title = Math.floor((sBedget*1/this.data.newBudget*1)*100)+'%'
      sendData.budget =  this.data.newBudget*1

      if(sBedget>=0){
        series[0].data = sBedget
        pieTitle.color='#666'
        pieTitle.name=title
      }else{
        series[0].data = 0
        pieTitle.name='已超支'
        pieTitle.color='#e4393c'
      }
     
      this.updateUserData(sendData
        ).then(res=>{

          this.drawPie(series,pieTitle)
        }).catch(err=>{
          // console.log(err);
        })

      this.setData({
        isShow:false,
        budget:sendData.budget.toFixed(2),
        surplusBudget:sBedget.toFixed(2)
      })
    },
    // 阻止冒泡事件
    nothing(){

    },

    // 获取input输入框的值
    getInputVal(e){
      
        this.setData({
          newBudget:e.detail.value
      })
 
      
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

  tapInput() {
    this.setData({
        //在真机上将焦点给input
        inputFocus:true,
        //初始占位清空
        inputInfo: '',
        showInput:false
    });
},

/**
 * input 失去焦点后将 input 的输入内容给到cover-view
 */
blurInput(e) {
    this.setData({
        inputInfo: e.detail.value || '请输入预算金额',
        showInput:true
    });
}


})
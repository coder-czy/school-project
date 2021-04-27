// miniprogram/pages/budgetDetail/budgetDetail.js
import * as echarts from '../../ec-canvas/echarts';
var wxCharts = require('../../js/wxcharts.js')
const app = getApp()


let chart = null
let data =[]
let val = []
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  chart.showLoading(); // 首次显示加载动画
  canvas.setChart(chart);
  
 let option = {
  // title: {
  //     text: '预算支出明细',
  //     left:10,
  //     top:10,
  //     textStyle: {
  //       color:'#444',
  //       fontSize:'14'
  //   }
    
  // },

  radar: [
      {
        
          
          splitArea: {
              areaStyle: {
                  color: ['rgba(114, 172, 209, 0.2)',
                      'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
                      'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
                  shadowColor: 'rgba(0, 0, 0, 0.3)',
                  shadowBlur: 10
              }
          },
          
          axisLine: {
              lineStyle: {
                  color: 'rgba(255, 255, 255, 0.5)'
              }
          },
          splitLine: {
              lineStyle: {
                  color: 'rgba(255, 255, 255, 0.5)'
              }
          }
      },
      {
          indicator: data,
          center: ['50%', '50%'],
          radius: 120,
          name: {
            textStyle: {
                color: '#444'
            }
        },
      }
  ],
  series: [
     
      {
          name: '支出',
          type: 'radar',
          radarIndex: 1,
          clolor:'#ffdd4a',
          data: [
              {
                  value:val,
                  name: '预算',
                  areaStyle:{
                    color:'#ffdd4a',
                    opacity:0.5
                  },
                  lineStyle:{
                    color:'#ffdd4a'  
                  },
                  itemStyle:{
                    color:'#ffdd4a'
                  },
                  label: {
                     color:'#ffdd4a',
                      show: true,
                     
                    
                      formatter: function(params) {
                          return params.value;
                      }
                  }
              },
              
          ]
      }
  ]
}
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
    let allMonthData = JSON.parse(options.allMonthData)
    this.setData({
      monthData,
      allMonthData,
      surplus:drawData.surplus,
      budget:drawData.budget,
      zhichu:drawData.zhichu,
      surplusBudget:drawData.surplusBudget,
      series,
      title,
      newBudget:''
      
    })
    this.drawPie(series,title)
    // this.getDrawData()
    if(this.data.allMonthData.length<=0){
      this.setData({
        isHasData:false
      })
    }
    console.log(this.data.allMonthData);
  },

 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let nowMonth = new Date().getMonth()
    this.setData({
      month:nowMonth+1
    })
    this.getDrawData()

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

    getDrawData(){
      let allMonthData = this.data.allMonthData.filter(val=>val.titles.type=='zhichu')
      let obj = {}
      allMonthData.forEach(val => {
        if(!obj[val.typeIcons.title]){
          obj[val.typeIcons.title] = val.money*1
        }else{
          obj[val.typeIcons.title] += val.money*1
        
        }
      });
      console.log(obj);

      let indicator= []
      let value= []
      let keys = Object.keys(obj)
      if(keys.length<5){
        console.log(keys.indexOf('医疗'));
        if(keys.indexOf('餐饮')<-1){
          indicator.push({text:'餐饮',max:10})
          value.push(0)
        }
         if(keys.indexOf('其他')<0){
          indicator.push({text:'其他',max:10})
          value.push(0)
        }
         if(keys.indexOf('日用')<0){
          indicator.push({text:'日用',max:10})
          value.push(0)
        }
         if(keys.indexOf('交通')<0){
          indicator.push({text:'交通',max:10})
          value.push(0)
        }
         if(keys.indexOf('话费')<0){
          indicator.push({text:'话费',max:10})
          value.push(0)
        }
         if(keys.indexOf('医疗')<0){
          console.log(11);
          indicator.push({text:'医疗',max:10})
          value.push(0)
        }
      }
      for(let key in obj){
        
        indicator.push({
          text: key,
          max :Math.ceil(obj[key]/10)*10
        })
        value.push(obj[key])
      }
      console.log(indicator,value);
      data = indicator
      val = value
      // chart.setOption({
      //   series:[{
      //     data:[
      //       {
      //         value
      //       }
      //     ]
          
      //   }]
      // })
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
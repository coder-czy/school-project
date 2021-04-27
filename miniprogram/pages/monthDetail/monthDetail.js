// miniprogram/pages/monthDetail/monthDetail.js
// 引入canvas插件
import * as echarts from '../../ec-canvas/echarts';
import { tool } from '../../js/tool.js'

let app =getApp()
let chart = null
let data =[]

// 类饼图
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  chart.showLoading(); // 首次显示加载动画
  canvas.setChart(chart);
  let option = {
    backgroundColor: '#fff',

    title: {
        text: '支出类别',
        left: 10,
        top: 10,
        textStyle: {
            color: '#444',
            fontSize:'14'
        }
    },
    

    tooltip: {
        trigger: 'item',
        formatter: '{b}:{c}元({d}%)'
    },
    
    // visualMap: {
    //     show: false,
    //     min: 10,
    //     max: 200,
    //     inRange: {
    //         colorLightness: [0,1]
    //     }
    // },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data,
            roseType: 'radius',
            label: {
               
            },
            labelLine: {
                lineStyle: {
                  
                },
                smooth: 0.2,
                length: 10,
                length2: 20
            },
            itemStyle: {
                color: '#ffdd4a',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.1)'
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
    ]
};
  chart.hideLoading(); // 隐藏加载动画
  chart.setOption(option);
  return chart;
}

// 折线图
let charts = null
function initCharts(canvas, width, height,dpr) {
  charts = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(charts);

  let option = {
    //折线图标题
    title: {
      text: '支出趋势',
      left: 10,
        top: 10,
        textStyle: {
            color: '#444',
            fontSize:'14'
        }
    },
    // 折线图线条的颜色
    color: ["#ffdd4a"],
    // 折线图的线条代表意义
    legend: {
      itemWidth:5,//小圆点的宽度
      itemGap:25,
      selectedModel:'single',//折线可多选
      inactiveColor:'#87CEEB',
      data: [
        {
          
          icon: 'circle',
          textStyle: {
            color: '#000000',
          }
        }
      ],
      
      bottom: 0,
      left: 30,
      z: 100
    },
    // 刻度
    grid: {
      containLabel: true
    },
    // 悬浮图标
    tooltip: {
      show: true,
      trigger: 'axis',
      // position: function (pos, params, dom, rect, size) {
      //   var obj = { top: 60 };
      //   obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
      //   return obj;
      // } 
      // trigger: 'item',
      formatter: '{c}元'
    },
    

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      // splitLine: {
      //   lineStyle: {
      //     type: 'dashed'
      //   }
      // },
      
      axisLine:{//y轴坐标是否显示
        show:true
      },
      axisTick:{//y轴刻度小标是否显示
        show:true
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      top: 60,
      left: 60,
      height:'auto',
      width:'auto'

    },
    series: [{
      name: '支出',
      type: 'line',
      // 设置折线是否平滑
      smooth: false,
      data: [],
      areaStyle: {
        color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
                {
                    offset: 0,
                    color: "rgb(255, 217, 70)"
                },
                {
                    offset: 1,
                    color: "rgb(254,256,242)"
                }
            ]
        )
    }
      }]
  };

  charts.setOption(option);
  return charts;
}

// 柱状图
let chartt = null
function initChartt(canvas, width, height,dpr) {
  chartt = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chartt);

  let option = {
    title: {
      text: '月支出对比',
      left: 10,
        top: 10,
        textStyle: {
            color: '#444',
            fontSize:'14'
        }
    },
    grid: {
      left: '8%',
      right: '8%',
      top: 60,
      left: 60,
      height:'auto',
      width:'auto'

    },

    color:'#ffdd4a',
    
    tooltip: {
      trigger: 'item',
      formatter: '{c}元'
  },

    xAxis: {
        type: 'category',
        data: [],
        axisTick:{
          show:false
        }
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
        }
    }]
};

  chartt.setOption(option);
  return chartt;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},

    // canvans图的宽度
    width:0,
// 类饼图
    ec: {
      onInit: initChart
    },

// 折线图
    ecs: {
      onInit: initCharts
    },

// 柱状图
    ect: {
      onInit: initChartt
    },

    // 每月的记账数据
    bookingData:{},

    // 相识的天数
    meetDay:0,

    zhichuPersent:0,
    shouruPersent:0,

    // 排行数据
    rankData:[],

    dayTopZhichu:0.00,
    averageDayZhichu:0.00,
    monthTotalZhichu:0.00,

    isHasData:false

  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log('options==>',options);
    let data = JSON.parse(options.data)
    if(data.data.length<=0){
      this.setData({
        isHasData:false
      })
    }else{

      let allData = JSON.parse(options.allData)
      let total = data.zhichu*1+data.shouru*1
      let zhichuPersent = data.zhichu*1/total*100+'%'
      let shouruPersent = data.shouru*1/total*100+'%'
      console.log(total,zhichuPersent,shouruPersent);
      this.setData({
        bookingData:data,
        allBookingData:allData,
        zhichuPersent,
        shouruPersent,
        isHasData:true
      })
    }
    // console.log(this.data.allBookingData);
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo()
    this.getUserData()
    this.rankData()
 
  },

  // 计算支出排行
  rankData(){
    if(Object.keys(this.data.bookingData).length<=0){
      return
    }
    let data = this.data.bookingData.data
    let rankData = []
    let typeObj = {}
    let typeData = []
    let topMoney =0
    data = data.filter(val=>{
      val.date1 = tool.formatDate2(val.date)
      return val.titles.type == 'zhichu'
    }).sort((a,b)=>{
      return b.money-a.money
    })
    // console.log(data);
    if(data.length>3){
      rankData = data.slice(0,3)
    }else{
      rankData = data
    }

    // 支出类别
    let monthTotal = 0
    data.forEach(val=>{
      // console.log(val);
      monthTotal += val.money*1
      let title = val.typeIcons.title
      if(!typeObj[title]){
      
        typeObj[title] = {}
        typeObj[title].typeIcons = val.typeIcons
        typeObj[title].money = val.money*1

      }else{
        typeObj[title].money += val.money*1
      }
    })

    for(let key in typeObj){
      typeData.push({title:key,money:typeObj[key].money,typeIcons:typeObj[key].typeIcons})
    }
    typeData = typeData.sort((a,b)=>{
      return b.money - a.money
    })
    let typeArr = []
    if(typeData.length>3){
      typeArr = typeData.slice(0,3)
    }else{
      typeArr = typeData
    }
    console.log(typeArr);
  


    this.setData({
      rankData,
      typeData:typeArr,
      dayTopZhichu:(rankData[0].money*1).toFixed(2),
      monthTotalZhichu:monthTotal.toFixed(2),
      averageDayZhichu:(monthTotal/30).toFixed(2)
    })
    console.log(rankData);
  },

  

    // 进入记账编辑页面
    goDetail(e){
      // console.log(e.currentTarget.dataset);
      wx.navigateTo({
        url: '../bookingDetail/bookingDetail?id='+e.currentTarget.dataset.id,
      })
    },

  // 画支出类别
  drawPie(){

    let data1 = this.data.bookingData.data
    let arr = []
    let obj = {}
    let dayObj = {}
    data1 = data1.filter(val=>{
      return val.titles.type == 'zhichu'
    })
    data1.forEach(val=>{
    let type = val.typeIcons.title
       if(!obj[type]){
        obj[type] = {
          value:val.money*1
        }
       }else{
         obj[type].value +=val.money*1
       }
       let date = val.date.split('-')[2]
       if(!dayObj[date]){
        dayObj[date] = {
          value:val.money*1
        }
       }else{
         dayObj[date].value +=val.money*1
       }
   
    })
    // console.log('obj==>',obj);
    // console.log('dayObj==>',dayObj);

   

    for(let key in obj){
      arr.push({value:obj[key].value,name:key})
    }
    arr.sort(function (a, b) { return a.value - b.value; })

    // 折线图数据
    let allAxis = []
    let xAxis = []
    let yAxis = []
    for(let key in dayObj){
      allAxis.push({value:dayObj[key].value,day:key*1})
    }
    allAxis.sort(function (a, b) { return a.day - b.day; })
    // console.log('allAxis==>',allAxis);

    allAxis.forEach(val => {
      xAxis.push(val.day)
      yAxis.push(val.value)
    });
    console.log(xAxis,yAxis);

    // 处理柱状图数据
    let allBookingData = this.data.allBookingData
    let allObj = {}
    let allMArr = []
    let mXAxis = []
    let mYAxis = []
    allBookingData.forEach(val=>{
      let month = val.month
         if(!allObj[month]){
          allObj[month] = {
            value:val.zhichu*1
          }
         }else{
           allObj[month].value +=val.zhichu*1
         }
       
     
      })
      // console.log('obj==>',allObj);

      for(let key in allObj){
        allMArr.push({value:allObj[key].value,month:key*1})
      }
      allMArr.sort(function (a, b) { return a.day - b.day; })
      // console.log('allMArr==>',allMArr);
  
      allMArr.forEach(val => {
        mXAxis.push(val.month+'月')
        mYAxis.push(val.value)
      });
      // console.log(mXAxis,mYAxis);

    // console.log(chart);
    // 饼图
    chart.setOption({
      series:[{
        data:arr ,//全局变量
        
      }]
    })

    // 折线图
    charts.setOption({
      series:[{
        data:yAxis ,//全局变量
        
      }],
      xAxis:{
        data:xAxis
      }
    })

    // 柱状图
    chartt.setOption({
      series:[{
        data:mYAxis ,//全局变量
        
      }],
      xAxis:{
        data:mXAxis
      }
    })
  },

     // 获取用户userData
     getUserData(){
      if(!app.globalData.isAuth){
        return
      }
     wx.cloud.callFunction({
       name:'get_userData'
     }).then(res=>{
       console.log('userData==>',res);
       let registerDate = res.result.data[0].registerDate
       let nowDate = Date.now()
      let meetDay = Math.ceil((nowDate - registerDate)/(24*60*60*1000))
      // console.log(registerDate,nowDate,meetDay);
       this.setData({
        meetDay
       })
    this.drawPie()

     }).catch(err=>{
       console.log('err=>',err);
     })
   },
 

      // 获取用户信息
      getUserInfo(){
        let isAuth = app.globalData.isAuth;
        console.log(app.globalData);
        console.log('isAuth==>',isAuth)
        if(isAuth){
                // 需授权才可使用
              
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

        // 授权页面
        goAuth(){
          wx.navigateTo({
            url: '../auth/auth',
          })
        }
})
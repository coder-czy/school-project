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
        left: 'center',
        top: 20,
        textStyle: {
            color: '#ccc'
        }
    },
    

    tooltip: {
        trigger: 'item',
        formatter: '{b}:{c}元({d}%)'
    },
    
    visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
            colorLightness: [0, 1]
        }
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
                {value: 335, name: '直接访问'},
                {value: 310, name: '邮件营销'},
                {value: 274, name: '联盟广告'},
                {value: 235, name: '视频广告'},
                {value: 400, name: '搜索引擎'}
            ].sort(function (a, b) { return a.value - b.value; }),
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
      left: 'center'
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
          name: '浏览小程序',
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
      position: function (pos, params, dom, rect, size) {
        var obj = { top: 60 };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        return obj;
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLine:{//y轴坐标是否显示
        show:false
      },
      axisTick:{//y轴刻度小标是否显示
        show:false
      }
    },
    series: [{
      name: '浏览小程序',
      type: 'line',
      // 设置折线是否平滑
      smooth: false,
      data: [18, 36, 65, 30, 78, 40, 33]
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
      left: 'center'
    },
    color:'#ffdd4a',
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 400, 150, 80, 70, 110, 130],
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


  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo()


 
  },

  test(){
console.log(chart);
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

        // 授权页面
        goAuth(){
          wx.navigateTo({
            url: '../auth/auth',
          })
        }
})
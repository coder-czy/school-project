//app.js
// 主题色：#ffda44/#7c7c7c
// let app = getApp()
App({
  onLaunch: function () {
    let that = this 
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })

      
    }
      // 隐藏系统tabbar
      wx.hideTabBar();

      // 获取设备信息
      this.getSystemInfo();

      wx.getStorage({
        key: 'userInfo',
      }).then(res=>{
        console.log('userInfo',res);
        that.globalData.userInfo = res.data
        that.globalData.isAuth = true
        
      }).catch(err=>{
        console.log('userInfo-err',err);
        that.globalData.isAuth = false

      })

      
    // 授权
    // wx.getSetting({
    //   success:res=>{
    //     console.log('res==>',res)

    //     this.globalData.isAuth = res.authSetting['scope.userInfo'];
    //   }
    // })
  },
  onShow: function () {
    //隐藏系统tabbar
    wx.hideTabBar();
   
  },
// 获取系统信息
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },

  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },

  globalData: {
    userInfo: null,
    isAuth:false,  //test
    
    tabBar:{
      "backgroundColor": "#ffffff",
      "color": "#7c7c7c",
      "selectedColor": "#ffda44",
    "list": [
      {
        "pagePath": "/pages/index/index",
        "iconPath": "icon/tab1.png",
        "selectedIconPath": "icon/tab1-active.png",
        "text": "首页"
      },
      {
        "pagePath": "/pages/chart/chart",
        "iconPath": "icon/tab2.png",
        "selectedIconPath": "icon/tab2-active.png",
        "text": "图表"
      },
      {
        "pagePath": "/pages/booking/booking",
        "iconPath": "icon/icon_release.png",
        "isSpecial": true,
        "text": ""
      },
      {
        "pagePath": "/pages/history/history",
        "iconPath": "icon/tab3.png",
        "selectedIconPath": "icon/tab3-active.png",
        "text": "明细"
      },
      {
        "pagePath": "/pages/profile/profile",
        "iconPath": "icon/tab4.png",
        "selectedIconPath": "icon/tab4-active.png",
        "text": "我的"
      },

    ]
  }
  }
})

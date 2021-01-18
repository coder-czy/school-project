// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
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
            "pagePath": "/pages/assemblyNumber/assemblyNumber",
            "iconPath": "icon/tab2.png",
            "selectedIconPath": "icon/tab2-active.png",
            "text": "图表"
          },
          {
            "pagePath": "/pages/message/message",
            "iconPath": "icon/icon_release.png",
            "isSpecial": true,
            "text": " "
          },
          {
            "pagePath": "/pages/message/message",
            "iconPath": "icon/tab3.png",
            "selectedIconPath": "icon/tab3-active.png",
            "text": "明细"
          },
          {
            "pagePath": "/pages/my/my",
            "iconPath": "icon/tab4.png",
            "selectedIconPath": "icon/tab4-active.png",
            "text": "我的"
          },
    
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.systemInfo.model.search('iPhone X') != -1 ? true : false
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

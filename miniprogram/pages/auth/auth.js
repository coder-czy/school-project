// miniprogram/pages/auth/auth.js

let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**

  * 生命周期函数--监听页面加载

  */

  onLoad: function(options) {

      var that = this;
  
      //查看是否授权
  
      wx.getSetting({
        success: function(res) {
          if (res.authSetting['scope.userInfo']) {
            console.log("用户授权了");
          } else {
            //用户没有授权
            console.log("用户没有授权");
          }
        }
      });
    },
  
  bindGetUserInfo: function(res) {
 
      if (res.detail&&res.detail.userInfo) {
  
        //用户按了允许授权按钮
  
        var that = this;
  
        // 获取到用户的信息了，打印到控制台上看下
  
        console.log("用户的信息如下：");
  
        console.log(res.detail.userInfo);

        app.globalData.isAuth = true;
        this.getUserData()
        wx.navigateBack()
  
      } else {
  
        //用户按了拒绝按钮
      app.globalData.isAuth=false;
        wx.showModal({
  
          title: '警告',
  
          content: '您点击了拒绝授权，将无法正常使用记账功能！',
  
          showCancel: false,
  
          confirmText: '返回授权',
  
          success: function(res) {
  
            // 用户没有授权成功，不需要改变 isHide 的值
  
            if (res.confirm) {

              console.log('用户点击了“返回授权”');
  
            }
  
          }
  
        });
  
      }
  
   },

    // 获取用户信息
    getUserData(){
      wx.cloud.callFunction({
        name:'get_userData'
      }).then(res=>{
        console.log('userData==>',res);
        if(res.result.data.length==0){
          console.log('用户信息初始化');
          this.initUserData()
        }else{
          return
        }
      }).catch(err=>{
        console.log('err=>',err);
      })
    },

    getUserProfile(){
      wx.getUserProfile({
        desc:'用于完善用户资料',
        lang: 'zh_CN',
        success:(res)=>{
          console.log(res);
          if (res.userInfo) {
  
                  //用户按了允许授权按钮
            
                  var that = this;
            
                  // 获取到用户的信息了，打印到控制台上看下
            
                  console.log("用户的信息如下：");
            
                  console.log(res.userInfo);
          
                  app.globalData.isAuth = true;
                  app.globalData.userInfo = res.userInfo;
                  wx.setStorage({
                    key:"userInfo",
                    data:res.userInfo
                  }).then(res=>{
                    console.log(res);
                  }).catch(err=>{
                    console.log(err);
                  })
                  this.getUserData()
                  wx.navigateBack()
            
                } 
        },
        fail:(err)=>{
          
            
                  //用户按了拒绝按钮
                app.globalData.isAuth=false;
                  wx.showModal({
                    title: '警告',
                    content: '您点击了拒绝授权，将无法正常使用记账功能！',
                    showCancel: false,
                    confirmText: '返回授权',
                    success: function(res) {
                      // 用户没有授权成功，不需要改变 isHide 的值
                      if (res.confirm) {
                        console.log('用户点击了“返回授权”');
            
                      }
            
                    }
            
                  });
            
                
        }
      })
    },


    // 初始化用户数据
    initUserData(){
      let data ={
      registerDate:  Date.now(),
      continueBookingDate: 1,
      checkInTime:Date.now(),
      totalBookingDate:0,
      totalBookingTimes:0,
      budget:100.00,
      bookedIcon:[],
      shouruDislikeIcon:[],
      zhichuDislikeIcon:[]
      }
      console.log(data);

      wx.cloud.callFunction({
        name:'add_userData',
        data
      }).then(res=>{
        console.log('user信息',res);
      }).catch(err=>{
        console.log(err);
      })
    }
  
  



})
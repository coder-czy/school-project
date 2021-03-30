// miniprogram/pages/bookingDetail/bookingDetail.js

import {tool} from '../../js/tool'
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 记账ID
    id:'',
    // 记账数据
    bookingData:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);

    wx.showNavigationBarLoading()
    wx.cloud.callFunction({
      name:"get_bookingDataById",
      data:{
        id:options.id
      }
    }).then(res=>{
      wx.hideNavigationBarLoading();
      console.log(res);

      // 对数据的时间进行格式化
      let data = res.result.data
      data[0].date = tool.formatDate2(data[0].date)
      console.log(data);
      this.setData({
        id:options.id,
        bookingData:data[0]
      })
    }).catch(err=>{
      wx.hideNavigationBarLoading();
      console.log('获取数据失败',err);
    })

  },

  onShow(){
    this.getUserData()
  },

     // 获取用户信息
     getUserData(){
      if(!app.globalData.isAuth){
        return
      }
     wx.cloud.callFunction({
       name:'get_userData'
     }).then(res=>{
       console.log('userData==>',res);
       this.setData({
        totalBookingTimes:res.result.data[0].totalBookingTimes
       })
     }).catch(err=>{
       console.log('err=>',err);
     })
   },

  // 编辑记账信息
  edit(e){
    console.log(e);
    wx.navigateTo({
      url: '../booking/booking?id='+e.currentTarget.dataset.id,
    })
  },
  // 删除记账信息
  delete(){
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确定删除这条记账？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          _this.deleteBookingData(_this.data.id)

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 删除本条记账数据
  deleteBookingData(id){
    wx.cloud.callFunction({
      name:'remove_bookingDataById',
      data:{
        id
      }
    }).then(res=>{
      console.log(res);
      this.reduceOne()
      wx.showToast({
        title: '删除成功',
        icon:'success',
        duration:2000
      })
      wx.navigateBack()
    }).catch(err=>{
      console.log('删除失败',err);

    })
  },

  // 减少一条记账记录
  reduceOne(){
    let data = {
      totalBookingTimes:this.data.totalBookingTimes - 1
    }
    wx.cloud.callFunction({
      name:'update_userData',
      data
    }).then(res=>{
      console.log('user信息',res);
    }).catch(err=>{
      console.log(err);
    })
  }

 
})
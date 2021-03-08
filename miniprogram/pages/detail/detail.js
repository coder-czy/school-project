// miniprogram/pages/detail/detail.js
import {tool} from '../../js/tool'

Page({

  /**
   * 页面的初始数据
   */
  data: {
      detailBookingData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 截取参数
    var ids = options.ids;
    this.getBookingDataByIds(ids)

  },
  getBookingDataByIds:function(ids){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'get_bookingDataByIds',
      data:{
        ids:ids
      },
      success:res=>{
        wx.hideLoading();
        console.log('res==>',res)
        let data = res.result.data
        data.forEach(item => {
            item.date = tool.formatDate2(item.date)
        });
        console.log(data);
        this.setData({
          detailBookingData:data
        })
      },
      fail:err=>{
        console.log('err==>',err)
      }
    })
  },

  // 进入记账编辑页面
  goDetail(e){
    // console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../bookingDetail/bookingDetail?id='+e.currentTarget.dataset.id,
    })
  }

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
})
// miniprogram/pages/setBookingIcon/setBookingIcon.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'zhichu',
    zhichu:[],
    shouru:[],
    randerIcon:[],
    zhichuDislikeIcon:[],
    shouruDislikeIcon:[],
    bookedIcon:[]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let type = JSON.parse(options.type)
    let zhichu_arr = JSON.parse(options.zhichu)
    let shouru_arr = JSON.parse(options.shouru)
    // console.log(type,zhichu,shouru);
    this.setData({
      type,
      zhichu_arr,
      shouru_arr,

    })
  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserData()
  },


     // 获取用户信息
     getUserData(){
      wx.showNavigationBarLoading()
     wx.cloud.callFunction({
       name:'get_userData'
     }).then(res=>{
       console.log('userData==>',res);
      let data = res.result.data[0]
      this.setData({
  
        zhichuDislikeIcon:data.zhichuDislikeIcon,
        shouruDislikeIcon:data.shouruDislikeIcon,
        bookedIcon:data.bookedIcon,
      })
      wx.hideNavigationBarLoading()

      this.disposeIcon()
     }).catch(err=>{
       console.log('err=>',err);
     })
   },
   // 图标预处理
   disposeIcon(){

    let _this = this
    let shouru_arr = _this.data.shouru_arr
    let zhichu_arr = _this.data.zhichu_arr

    zhichu_arr = zhichu_arr.filter((x) => !_this.data.zhichuDislikeIcon.some((item) => x.type == item.type));

    shouru_arr = shouru_arr.filter((x) => !_this.data.shouruDislikeIcon.some((item) => x.type == item.type));
    this.setData({
      shouru:shouru_arr,
      zhichu:zhichu_arr,
    })
    console.log(this.data.shouru,this.data.zhichu);
   
  },
  reduceIcon(e){
    let icon  =e.currentTarget.dataset.icon
    console.log(icon);
    let icon_arr 
    let sendData = {}
    let bookedIcon = this.data.bookedIcon
    if(bookedIcon.some(item=>item.type ==icon.type)){
      // return console.log('');
      wx.showToast({
        title: '该类型已存在记账，无法减去此类型',
        icon:'none'
      })
      return
    }
    if(this.data.type == 'zhichu'){
      icon_arr = this.data.zhichuDislikeIcon
    }else{
      icon_arr = this.data.shouruDislikeIcon
    }
    console.log(icon);
   icon_arr.push(icon)
    console.log(icon_arr);
    
    if(this.data.type == 'zhichu'){
      sendData.zhichuDislikeIcon = icon_arr
    }else{
      sendData.shouruDislikeIcon = icon_arr
    }

    this.updateUserData(sendData)
  },

  addIcon(e){
    let icon  =e.currentTarget.dataset.icon
    let icon_arr 
    let sendData = {}
    if(this.data.type == 'zhichu'){
      icon_arr = this.data.zhichuDislikeIcon
    }else{
      icon_arr = this.data.shouruDislikeIcon
    }
    console.log(icon);
   icon_arr= icon_arr.filter(item=>item.type!=icon.type)
    console.log(icon_arr);

    if(this.data.type == 'zhichu'){
      sendData.zhichuDislikeIcon = icon_arr
    }else{
      sendData.shouruDislikeIcon = icon_arr
    }

    this.updateUserData(sendData)

  },

   // 更新userData
  updateUserData(data){
    let _this = this
    wx.cloud.callFunction({
      name:'update_userData',
      data
    }).then(res=>{
      console.log('update==>',res);
      this.getUserData()
      wx.showToast({
        title: '修改成功',
        icon:'none'
      })
    }).catch(err=>{
      console.log(err);
    })
  },


  changeType(e){
    let type =e.currentTarget.dataset.type
    if(this.data.type==type){
      return
    }else{
      this.setData({
        type:type
      })
    }
    // console.log(e);
  }

  
})
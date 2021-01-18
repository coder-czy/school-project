// miniprogram/pages/booking/booking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab切换数据
    tabData:[
    
      {
        title:'支出',
        type:'zhichu'
      },  {
        title:'收入',
        type:'shouru'
      }
    ],

    // tab切换的当前下标
    currentIndex:0,

    // shouru zhichu 图标数据
    shouru:[],
    zhichu:[],

    // 记账类型下标
    shouruIconIndex:-1,
    zhichuIconIndex:-1,

    // 记账金额
    bookingNum:'0.00',

    // 记账时间
    bookingDate:'今天',

    // 完成按钮文字
    confirmText:'完成',

    // 是否展示键盘
    showKeyboard:false,

    // 评论
    comment:'',

    // 当前时间
    nowDate:'',
    choseDate:''



  },

  onShow(){
    this.getBookingIcons('shouru')
    this.getBookingIcons('zhichu')
    this.getNowDate()
  },
  // 切换tab
  changeTab(e){
    let index = e.target.dataset.index
    this.setData({
      currentIndex:index,
      showKeyboard:false,
      shouruIconIndex:-1,
      zhichuIconIndex:-1
    })
  },

    // 获取记账图标
    getBookingIcons(type){
      wx.showNavigationBarLoading()
      wx.cloud.callFunction({
        name:"get_bookingIcons",
        data:{
          type
        }
      }).then(res=>{
        wx.hideNavigationBarLoading();
       this.setData({
         [type]:res.result.data
       })
       console.log(this.data[type]);
      }).catch(err=>{
        wx.hideNavigationBarLoading();

        console.log('获取bookingIcons失败');
      })
    },

  // 切换tab
  changeItem(e){
    this.setData({
      currentIndex:e.detail.current,
      showKeyboard:false,
      shouruIconIndex:-1,
      zhichuIconIndex:-1
    })
    // console.log(e.detail.current);
  },

  // 切换记账类型
  changeIcon(e){
    console.log( e);
    if(this.data.currentIndex===0){
      this.setData({
        zhichuIconIndex: e.currentTarget.dataset.index,
        shouruIconIndex:-1,
        showKeyboard:true
      })
    }else{
      this.setData({
        shouruIconIndex: e.currentTarget.dataset.index ,
        zhichuIconIndex:-1,
        showKeyboard:true
      })
    }
  },

  // 取消键盘的操作
  cancel(){
    this.setData({
      showKeyboard:false,
      shouruIconIndex:-1,
      zhichuIconIndex:-1
    })
  },

  // 获取键盘的数字
  getNum(e){
  let n = e.currentTarget.dataset.msg
  let num = this.data.bookingNum

  if(num == '0.00'|| num=='0'){
    this.setData({
      bookingNum:n
    })
    return
  }
  if(num.indexOf('.')>-1){
    let numArr=num.split('.')
    if(numArr[1].length>=2){
      console.log(numArr[1]);
      if(numArr[1].indexOf('+')>-1||numArr[1].indexOf('-')>-1){
        console.log(numArr);
        if(numArr[2]&&numArr[2].length>1){
          return
        }else{

          this.setData({
            bookingNum:num+n,
            confirmText:'='
          })
        }
      }else{
        return
      }
    }
  }
  if(num.indexOf('+')>-1||num.indexOf('-')>-1){
    this.setData({
      bookingNum:num+n,
      confirmText:'='
    })
    return
  }
  this.setData({
    bookingNum:num+n
  })
 
  },



  // 对输入的数字进行相加
  addNum(){
    // console.log('add');
    let num = this.data.bookingNum

   
    if(num.indexOf('+')>-1){
      let subArr = num.split('+')
      if(subArr[1]==''){
        return
      }
    let data= this.calculate('+')
     this.setData({
       bookingNum:data+'+'
     })
    }else{
      if(num.indexOf('-')>-1){
        let addArr = num.split('-')
        if(addArr[1].length!=''){
         let data = this.calculate('-')
         this.setData({
           bookingNum:data+'+'
         })
        }
        return
      }
      if(num=='0.00'||num=='0'){
        return
      }else{
        this.setData({
          bookingNum:num+'+'
        })
      }
    }
    
  },

  // 对输入的数字进行相减
  subNum(){
    let num = this.data.bookingNum
    if(num.indexOf('-')>-1){
      let subArr = num.split('-')
      if(subArr[1]==''){
        return
      }
   let data= this.calculate('-')
     this.setData({
       bookingNum:data+'-'
     })
    }else{
      if(num.indexOf('+')>-1){
        let addArr = num.split('+')
        if(addArr[1].length!=''){
         let data = this.calculate('+')
         this.setData({
           bookingNum:data+'-'
         })
        }
        return
      }
      if(num=='0.00'||num=='0'){
        return
      }else{
        this.setData({
          bookingNum:num+'-'
        })
      }
    }
  },

  // 计算结果
  calculate(type){
    this.setData({
      confirmText:'完成'
    })
    let number = this.data.bookingNum
    if(number.indexOf(type)>-1){
    let numArr= number.split(type)
    if(numArr[1]===''){
      return number
    }
    let data = ''
     console.log(number);
  
     if(type=='+'){
      return data = (numArr[0]*1+numArr[1]*1).toFixed(2)
     }else if(type=='-'){
       if(numArr.length>2){

        return data = type+(numArr[1]*1+numArr[2]*1).toFixed(2)
        }else{
         return data = (numArr[0]*1-numArr[1]*1).toFixed(2)

       }

     }

    }else{
     return
    }
  },


  // 对输入的数字进行删除
  deleteNum(){
    let num = this.data.bookingNum
  
    if(num.length>1){
      num = num.substring(0,num.length-1)
      this.setData({
        bookingNum:num
      })
    }else{
      
      this.setData({
        bookingNum:'0'
      })
    }
    if(num.indexOf('+')>-1||num.indexOf('-')>-1){
      let addArr = num.split('+')
      let subArr=num.split('-')
      if(addArr[1]==''||subArr[1]==''){
        this.setData({
          confirmText:'完成'
        })
      }
    }
    
   
  },

  // 添加小数点
  addDot(){
    let num =this.data.bookingNum

    if(num.indexOf('.')>-1){
      
      if(num.indexOf('+')>-1||num.indexOf('-')>-1){
       let arr1= num.split('+')
       let arr2 = num.split('-')
       if(arr1[1]=='' || arr2[2]==''){
        return
       }
      }else{
        return
      }
    }

    this.setData({
      bookingNum:num+'.'
    })
  },

  // 完成和等于的功能
  comfirm(){
    let text = this.data.confirmText
    let num =this.data.bookingNum
    let data = ''
   if(text=='='){
     if(num.indexOf('+')>-1){
     data= this.calculate('+')
     }else if(num.indexOf('-')>-1){
     data= this.calculate('-')
     }
     this.setData({
       bookingNum:data
     })
    //  将数据进行记录
   }else if(text=='完成'){
     if(num==0||num=='0.00'||num==''){
       return
     }
     let index =this.data.currentIndex
     let typeIcons = {}
     let date = ''
     if(this.data.bookingDate=='今天'){
       date=this.data.nowDate
     }else{
       date=this.data.choseDate
     }
     if(index){
       typeIcons = this.data.shouru[this.data.shouruIconIndex]
      }else{
        typeIcons = this.data.zhichu[this.data.zhichuIconIndex]
      }

    let data = {
      comment:this.data.comment,
      date,
      money:this.data.bookingNum,
      titles:this.data.tabData[index],
      typeIcons
    }

    // 调用add_bookingData云函数
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name:'add_bookingData',
      data
    }).then(res=>{
      wx.hideLoading()
    
      this.setData({
        comment:'',
        showKeyboard:false,
        bookingNum:'0.00',
        bookingDate:'今天',
        shouruIconIndex:-1,
        zhichuIconIndex:-1
      })
      wx.showToast({
        title: '记账成功',
        duration:2000,
        icon:'success'
      })
      console.log(res);
    }).catch(err=>{
      wx.hideLoading()
      console.log('记账添加失败==>',err);
    })
    // console.log(data);       
   }
  },

  // 获取备注数据
  getInputVal(e){
   this.setData({
     comment:e.detail.value
   })
  },

 // 获取当前日期
 getNowDate(){
  let year = new Date().getFullYear()
    let month = new Date().getMonth()+1
    let day = new Date().getDate()
   month= month<10 ? '0'+month :month
   day= day<10 ? '0'+day :day
    let nowDate = `${year}-${month}-${day}`
    this.setData({
      nowDate
    })
 },
  bindTimeChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    
   let date = e.detail.value.replace(/-/g,'/')
   console.log(e.detail.value,this.data.nowDate);
    // 判断当前日期是否相等
   if(e.detail.value==this.data.nowDate){
     date = '今天'
   }
  
    this.setData({
     bookingDate:date,
     choseDate:e.detail.value
    })

    
  },

  
  


})
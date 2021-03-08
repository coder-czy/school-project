// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

let db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  try {
    console.log(event);
    
    db.collection('booking').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: event.data,
      success: function(res) {
        console.log(res.data)
        return {
          message: '更新成功',
          code: 0
        }
      }
    })
  } catch (error) {
    console.log('云函数调用失败',error);
  }
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database()
let _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var ids = event.ids.split('@')
  try{
    return await db.collection('booking').where({
      _id:_.in(ids)
    }).get()
  }catch(err){
    console.log('err云函数调用错误',err)
  }
}
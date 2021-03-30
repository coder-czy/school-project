// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let data = event
  // data.openId = event.userInfo.openId
  // data.appId = event.userInfo.appId
try {
  return await db.collection('user').add({data})

} catch (error) {
  console.log('云函数执行出错',error);
}
}
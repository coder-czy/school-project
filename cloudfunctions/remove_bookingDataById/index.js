// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
 
try {
  return await db.collection('booking').where({
    _id:event.id
  }).remove()
} catch (error) {
  console.log('云函数执行出错',error);
}

}
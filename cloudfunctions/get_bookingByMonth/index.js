// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

let db = cloud.database()
let _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let condition= {
    date:_.gte(event.start).and(_.lte(event.end)),
    userInfo:event.userInfo
  }
  if(event.titles){
    condition.titles = event.titles
  }
  try {
    return await db.collection('booking').where(condition).get()
    
  } catch (error) {
    console.log('云函数执行错误error',error);
  }
}
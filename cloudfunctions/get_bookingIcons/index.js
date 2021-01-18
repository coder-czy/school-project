// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

let db = cloud.database()

const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let type = event.type
  try {
    return db.collection('bookingIcons').where({
      bookingType:_.eq('both').or(_.eq(type))
    }).get()
    
  } catch (error) {
    console.log('云函数调用失败',error);
  }
}
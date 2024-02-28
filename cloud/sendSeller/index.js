// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid,
      page: 'pages/index/index',
      data: {
        phrase1:{
          value: event.status
        },
        thing18:{
          value: event.party_type
        },
        amount26:{
          value: event.budget
        },
        thing10:{
          value: event.address
        },
        time25:{
          value: event.time
        },
      },
      templateId: 'xbYExegGKYxM0B0DayNLaLLcQ1n9PKKHhxI0vJm3xFQ'
    })
    console.log(result)
    return JSON.parse(JSON.stringify(result))
  } catch (err) {
    console.log(err)
    return JSON.parse(JSON.stringify(err))
  }
}

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
        thing1:{
          value: '您的订单已有商家报价'
        },
        thing2:{
          value: event.party_type
        },
        thing9:{
          value: event.company
        },
        amount3:{
          value: event.budget
        },
        time4:{
          value: event.time
        },
      },
      templateId: 'WxRHbhG35xdCevHLmgbGaVZfW8EGOAHO2p7X3gpsm0s'
    })
    console.log(result)
    return JSON.parse(JSON.stringify(result))
  } catch (err) {
    console.log(err)
    return JSON.parse(JSON.stringify(err))
  }
}

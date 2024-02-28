let app = getApp()
let api = app.globalData.api

Page({
  data: {
    qr:''
  },
  onShow: function () {
    let orderkey = app.globalData.orderkey
    this.setData({
      order: app.globalData.orders[orderkey]
    })
  },
  jumpBack: ()=>{
    wx.navigateBack({
      delta: 0,
    })
  },
  withdraw(){
    api.withdraw(this.data.order.need_id).then(res => {
      wx.navigateBack({
        delta: 0,
      })
    })
  },
  finish(){
    api.finish(this.data.order.need_id).then(res => {
      wx.navigateBack({
        delta: 0,
      })
    })
  }
});


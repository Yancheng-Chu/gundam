let app = getApp()
let api = app.globalData.api
let fileserver = app.globalData.fileserver
const db = wx.cloud.database()
const userCollection = db.collection('Response')
const _ = db.command;
Page({
  data: {
    tab: "全部",
    orders: [],
    order: [],
    listId: '',
    openId: '',
  },
  async onLoad(option) {
    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/response/userOrders",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        _openid: wx.getStorageSync('_openid'),
      },
      success: (res) => {
        for (let i in res.data) {
          if (res.data[i].status !== '已取消') {
            this.data.orders.push({
              listId: res.data[i].responseId,
              party_type: res.data[i].party_type,
              budget: res.data[i].budget,
              orderTime: res.data[i].orderTime,
              status: res.data[i].status,
              order_status: res.data[i].order_status
            })
          }
        }
        this.setData({
          orders: this.data.orders,
          order: this.data.orders
        })
      },
      fail: (res) => {
        wx.showToast({
          title: 'Searched Failed',
        })
      }
    })
    // wx.request({
    //   // url: 'http://localhost:1919/response/userOrders',
    //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/response/userOrders',
    //   method: "POST",
    //   data: {
    //     _openid: wx.getStorageSync('_openid'),
    //   },
    //   success: (res) => {
    //     for (let i in res.data) {
    //       if (res.data[i].status !== '已取消') {
    //         this.data.orders.push({
    //           listId: res.data[i].responseId,
    //           party_type: res.data[i].party_type,
    //           budget: res.data[i].budget,
    //           orderTime: res.data[i].orderTime,
    //           status: res.data[i].status,
    //           order_status: res.data[i].order_status
    //         })
    //       }
    //     }
    //     this.setData({
    //       orders: this.data.orders,
    //       order: this.data.orders
    //     })
    //   },
    //   fail: (res) => {
    //     wx.showToast({
    //       title: 'Searched Failed',
    //     })
    //   }
    // })
  },
  onShow: function () {

  },

  tab: function (e) {
    let response = this.data.order.filter((item) => {
      return item.order_status == '已报价'
    })
    let wait = this.data.order.filter((item) => {
      return item.order_status == '已接受'
    })
    let complete = this.data.order.filter((item) => {
      return item.order_status == '已完成'
    })
    let all = this.data.order.filter((item) => {
      return item.order_status
    })

    this.setData({
      tab: e.target.dataset.name
    })
    if (e.target.dataset.name == '已报价') {
      this.setData({
        orders: response
      })
    } else if (e.target.dataset.name == '已接单') {
      this.setData({
        orders: wait
      })
    } else if (e.target.dataset.name == '已完成') {
      this.setData({
        orders: complete
      })
    } else {
      this.setData({
        orders: all
      })
    }
  },
  jumpToArea(e) {
    let url = "/pages/SellerPage/Sorder_detail/index?id=" + e.currentTarget.dataset.id + "&status=" + e.currentTarget.dataset.status
    wx.navigateTo({
      url
    })
  },
  goBack() {
    wx.navigateBack({
      delta: 1,
    })
  },
});

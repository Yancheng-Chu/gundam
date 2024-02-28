let app = getApp()
let api = app.globalData.api
let fileserver = app.globalData.fileserver
const db = wx.cloud.database()
const userCollection = db.collection('PartyList')
const _ = db.command;
Page({
  data: {
    tab: "全部",
    orders: [],
    order: [],
    listId: '',
    openId: '',
    statusBarHeight: wx.getStorageSync('statusBarHeight'),
    navigationBarHeight: wx.getStorageSync('navigationBarHeight'),
    menuButtonHeight: wx.getStorageSync('menuButtonHeight'),
    navigationBarAndStatusBarHeight: wx.getStorageSync('statusBarHeight') + wx.getStorageSync('navigationBarHeight')
  },
  async sql(){
    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/customer/userOrders",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        _openid: wx.getStorageSync('_openid')
      },
      success:(res) => {
        console.log(res)
           for (let i in res.data) {
          this.data.orders.push({
            img: res.data[i].img,
            listId: res.data[i]._id,
            party_type: res.data[i].party_type,
            budget: res.data[i].budget,
            person: res.data[i].person,
            diy_on: res.data[i].diy_on,
            date: res.data[i].date,
            orderTime: res.data[i].orderTime,
            location: res.data[i].location.rough,
            status: res.data[i].status
          })
        }
        this.setData({
          orders: this.data.orders,
          order: this.data.orders
        })
      },
      fail:(res) => {
        wx.showToast({
          title: 'Searched Failed',
        })
      }
    })

  //   wx.request({
  //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/customer/userOrders',
  //   // url: 'http://localhost:1919/customer/userOrders',
  //   method:'POST',
  //   data:{
  //     _openid: wx.getStorageSync('_openid')
  //   },
  //   // headers:({
  //   //   // 'Content-Type': 'application/json'
  //   //   'Content-Type':'application/x-www-form-urlencoded'
  //   // }),
  //   success:(res) => {
  //     console.log(res)
  //        for (let i in res.data) {
  //       this.data.orders.push({
  //         img: res.data[i].img,
  //         listId: res.data[i]._id,
  //         party_type: res.data[i].party_type,
  //         budget: res.data[i].budget,
  //         person: res.data[i].person,
  //         diy_on: res.data[i].diy_on,
  //         date: res.data[i].date,
  //         orderTime: res.data[i].orderTime,
  //         location: res.data[i].location.rough,
  //         status: res.data[i].status
  //       })
  //     }
  //     this.setData({
  //       orders: this.data.orders,
  //       order: this.data.orders
  //     })
  //   },
  //   fail:(res) => {
  //     wx.showToast({
  //       title: 'Searched Failed',
  //     })
  //   }
  // })
},
  onLoad: async function () {
    this.sql()
  },

  onShow: function () {
 
  },

  tab: function (e) {
    let wait = this.data.order.filter((item) => {
      return item.status == '发布中'
    })
    let ing = this.data.order.filter((item) => {
      return item.status == '服务中'
    })
    let cancel = this.data.order.filter((item) => {
      return item.status == '已取消'
    })
    let complete = this.data.order.filter((item) => {
      return item.status == '已完成'
    })
    let all = this.data.order.filter((item) => {
      return item.status
    })
    this.setData({
      tab: e.target.dataset.name
    })
    if (e.target.dataset.name == '待服务') {
      this.setData({
        orders: wait
      })
    }else if(e.target.dataset.name == '服务中') {
      this.setData({
        orders: ing
      })
    }else if(e.target.dataset.name == '已取消') {
      this.setData({
        orders: cancel
      })
    }else if(e.target.dataset.name == '已完成') {
      this.setData({
        orders: complete
      })
    }else{
      this.setData({
        orders: all
      })
    }
  },
  jumpToDetail(e) {
    let url = "/pages/order/index?id=" + e.currentTarget.dataset.id + "&status=" + e.currentTarget.dataset.status
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

let app = getApp()
const db = wx.cloud.database()
const userCollection = db.collection('PartyList')
const sellerCollection = db.collection('Company')
const _ = db.command;
Page({
  data: {
    response: 0,
    accept: 0,
    complete: 0,
    orders: [],
    party_type: '',
    budget: '',
    orderTime: '',
    listId: '',
    status: '',
    color: '#FF8400',
    active: 1,
    sy: {
      normal: '/resource/images/tabBar/syh.png',
      active: '/resource/images/tabBar/syc.png',
    },
    wd: {
      normal: '/resource/images/tabBar/wdh.png',
      active: '/resource/images/tabBar/wdc.png',
    },
    jd: {
      normal: '/resource/images/tabBar/jdh .png',
      active: '/resource/images/tabBar/jdc.png',
    },
  },
  onChange(e) {
    let url
    if (e.detail == 0) {
      url = "/pages/SellerPage/Smain/index"
    } else if (e.detail == 2) {
      url = "/pages/SellerPage/Spage/index"
    }
    this.setData({
      active: e.detail
    });
    wx.reLaunch({
      url
    })
  },

  onShow() {

  },
  async onLoad(option) {
    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/seller/allOrders",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      success: (res) => {
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
      fail: (res) => {
        wx.showToast({
          title: 'Searched Failed',
        })
      }
    })
    // wx.request({
    //   // url: 'http://localhost:1919/seller/allOrders',
    //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/allOrders',
    //   method: "POST",
    //   success: (res) => {
    //     for (let i in res.data) {
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
    //   fail: (res) => {
    //     wx.showToast({
    //       title: 'Searched Failed',
    //     })
    //   }
    // })

    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/seller/seller",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        _openid: wx.getStorageSync('_openid')
      },
      success: (res) => {
        this.setData({
          response: res.data[0].response,
          accept: res.data[0].accept,
          complete: res.data[0].complete,
        })
      },
      fail: (res) => {
        wx.showToast({
          title: 'Searched Failed',
        })
      }
    })
    // wx.request({
    //   // url: 'http://localhost:1919/seller/seller',
    //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/seller',
    //   method: "POST",
    //   data: {
    //     _openid: wx.getStorageSync('_openid')
    //   },
    //   success: (res) => {
    //     this.setData({
    //       response: res.data[0].response,
    //       accept: res.data[0].accept,
    //       complete: res.data[0].complete,
    //     })
    //   },
    //   fail: (res) => {
    //     wx.showToast({
    //       title: 'Searched Failed',
    //     })
    //   }
    // })
  },

  jumpToArea(e) {
    let url = "/pages/SellerPage/Sorder_detail/index?id=" + e.currentTarget.dataset.id
    wx.navigateTo({
      url
    })
  },

});

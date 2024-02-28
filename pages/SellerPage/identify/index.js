const db = wx.cloud.database()
const userCollection = db.collection('Company')
const _ = db.command;
Page({
  data: {
    ID: '',
    license: '',
    completeI: '',
    completeL: '',
    completeF: '',
    colorI: '',
    colorL: '',
    colorF: '',
    titles: '',
    ID_activate: 1,
    Li_activate: 1,
    Fo_activate: 1,
  },
  async onShow() {
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
        _openid: wx.getStorageSync('_openid'),
      },
      success: (res) => {
        if (res.data[0].ID == '待审核') {
          this.setData({
            completeI: res.data[0].ID,
            colorI: 'during',
            ID_activate: 1,
          })
        } else if (res.data[0].ID == '已完成') {
          this.setData({
            completeI: res.data[0].ID,
            colorI: 'complete',
            ID_activate: 2,
          })
        } else if (res.data[0].ID == '已拒绝') {
          this.setData({
            completeI: res.data[0].ID,
            colorI: 'reject',
            ID_activate: 1,
          })
        } else {
          this.setData({
            completeI: '',
            colorI: ''
          })
        }
        if (res.data[0].FoodID == '待审核') {
          this.setData({
            completeF: res.data[0].FoodID,
            colorF: 'during',
            Fo_activate: 1,
          })
        } else if (res.data[0].FoodID == '已完成') {
          this.setData({
            completeF: res.data[0].FoodID,
            colorF: 'complete',
            Fo_activate: 2,
          })
        } else {
          this.setData({
            completeF: '',
            colorF: ''
          })
        }
        if (res.data[0].License == '待审核') {
          this.setData({
            completeL: res.data[0].License,
            colorL: 'during',
            Li_activate: 1,
          })
        } else if (res.data[0].License == '已完成') {
          this.setData({
            completeL: res.data[0].License,
            colorL: 'complete',
            Li_activate: 2,
          })
        } else {
          this.setData({
            completeL: '',
            colorL: ''
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          icon: 'error',
          title: 'Published Failed',
        })
      }
    })
    // wx.request({
    //   // url: 'http://localhost:1919/seller/seller',
    //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/seller',
    //   method: "POST",
    //   data: {
    //     _openid: wx.getStorageSync('_openid'),
    //     // _openid:"oNfXF5KGYSWjVMmWCpMcqov95q8U",
    //   },
    //   success: (res) => {
    //     if (res.data[0].ID == '待审核') {
    //       this.setData({
    //         completeI: res.data[0].ID,
    //         colorI: 'during',
    //         ID_activate: 1,
    //       })
    //     } else if (res.data[0].ID == '已完成') {
    //       this.setData({
    //         completeI: res.data[0].ID,
    //         colorI: 'complete',
    //         ID_activate: 2,
    //       })
    //     } else if (res.data[0].ID == '已拒绝') {
    //       this.setData({
    //         completeI: res.data[0].ID,
    //         colorI: 'reject',
    //         ID_activate: 1,
    //       })
    //     } else {
    //       this.setData({
    //         completeI: '',
    //         colorI: ''
    //       })
    //     }
    //     if (res.data[0].FoodID == '待审核') {
    //       this.setData({
    //         completeF: res.data[0].FoodID,
    //         colorF: 'during',
    //         Fo_activate: 1,
    //       })
    //     } else if (res.data[0].FoodID == '已完成') {
    //       this.setData({
    //         completeF: res.data[0].FoodID,
    //         colorF: 'complete',
    //         Fo_activate: 2,
    //       })
    //     } else {
    //       this.setData({
    //         completeF: '',
    //         colorF: ''
    //       })
    //     }
    //     if (res.data[0].License == '待审核') {
    //       this.setData({
    //         completeL: res.data[0].License,
    //         colorL: 'during',
    //         Li_activate: 1,
    //       })
    //     } else if (res.data[0].License == '已完成') {
    //       this.setData({
    //         completeL: res.data[0].License,
    //         colorL: 'complete',
    //         Li_activate: 2,
    //       })
    //     } else {
    //       this.setData({
    //         completeL: '',
    //         colorL: ''
    //       })
    //     }
    //   },
    //   fail: (res) => {
    //     wx.showToast({
    //       icon: 'error',
    //       title: 'Published Failed',
    //     })
    //   }
    // })
  },
  checkID(e) {
    let url
    this.setData({
      titles: '身份认证'
    })
    if (this.data.completeI == '待审核') {
      url = "/pages/SellerPage/check/index?check=" + e.currentTarget.dataset.check + '&title=' + e.currentTarget.dataset.title + '&activate=' + e.currentTarget.dataset.activate
    } else if (this.data.completeI == '已完成') {
      url = "/pages/SellerPage/check/index?check=" + e.currentTarget.dataset.check + '&title=' + e.currentTarget.dataset.title + '&activate=' + e.currentTarget.dataset.activate
    } else {
      url = "/pages/SellerPage/getID/index"
    }
    wx.navigateTo({
      url
    })
  },
  checkLi(e) {
    let url
    this.setData({
      titles: '营业执照认证'
    })

    if (this.data.completeL == '待审核') {
      url = "/pages/SellerPage/check/index?check=" + e.currentTarget.dataset.check + '&title=' + e.currentTarget.dataset.title + '&activate=' + e.currentTarget.dataset.activate
    } else if (this.data.completeL == '已完成') {
      url = "/pages/SellerPage/check/index?check=" + e.currentTarget.dataset.check + '&title=' + e.currentTarget.dataset.title + '&activate=' + e.currentTarget.dataset.activate
    } else {
      url = "/pages/SellerPage/getLi/index"
    }
    wx.navigateTo({
      url
    })
  },
  checkFo(e) {
    let url
    this.setData({
      titles: '食品安全认证'
    })

    if (this.data.completeF == '待审核') {
      url = "/pages/SellerPage/check/index?check=" + e.currentTarget.dataset.check + '&title=' + e.currentTarget.dataset.title + '&activate=' + e.currentTarget.dataset.activate
    } else if (this.data.completeF == '已完成') {
      url = "/pages/SellerPage/check/index?check=" + e.currentTarget.dataset.check + '&title=' + e.currentTarget.dataset.title + '&activate=' + e.currentTarget.dataset.activate
    } else {
      url = "/pages/SellerPage/getFo/index"
    }
    wx.navigateTo({
      url
    })
  },
  jump(e) {
    let url = "/pages/mine/index"
    wx.switchTab({
      url
    })
  },
  back() {
    wx.navigateBack({
      delta: 1,
    })
  }
});

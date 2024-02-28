let startX = 0;
let moveX = 0;
let moveDistance = 0;
let selectedSite = ''
const db = wx.cloud.database()
Page({
  data: {
    show: false,
    siteList: [],
    hasAvailable: false,
    hasReview: false
  },

  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  handleTouchStart(e) {
    startX = e.touches[0].clientX
  },

  handleTouchMove(e) {
    let siteId = e.currentTarget.dataset.siteid
    moveX = e.touches[0].clientX
    moveDistance = moveX - startX
    let {
      siteList
    } = this.data

    let index = siteList.findIndex(item => item._id == siteId)
    if (moveDistance < 0 && siteList[index].x == 0) {
      siteList[index].x = -166
      this.setData({
        siteList
      })
    }

    if (moveDistance > 0 && siteList[index].x == -166) {
      siteList[index].x = 0
      this.setData({
        siteList
      })
    }
  },

  toSiteInfo() {
    wx.navigateTo({
      url: '/pages/SellerPage/siteInfo/index',
    })
  },

  showPopup(e) {
    selectedSite = e.currentTarget.dataset.siteid
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  async deleteSite() {
    this.onClose()
    await wx.showLoading({
      title: '删除中......',
      mask: true
    })
    let {
      siteList
    } = this.data
    let index = siteList.findIndex(item => item._id == selectedSite)

    let deleteFileIds = siteList[index].picList

    await wx.cloud.deleteFile({
      fileList: deleteFileIds
    })

    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/category/siteRemove",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        _id:selectedSite,
      },
      success:(res) => {
        console.log(res)
      },
      fail:(res) => {
        wx.showToast({
          icon: 'error',
          title: 'Removed Failed',
        })
      }
    })
    // wx.request({
    //   // url: 'http://localhost:1919/category/siteRemove',
    //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/siteRemove',
    //   method:'POST',
    //   data:{
    //       _id:selectedSite,
    //   },
    //   success:(res) => {
    //     console.log(res)
    //   },
    //   fail:(res) => {
    //     wx.showToast({
    //       icon: 'error',
    //       title: 'Removed Failed',
    //     })
    //   }
    // })

    siteList.splice(index, 1)
    this.setData({
      siteList
    })

    if (!this.data.siteList.some(item => item.status == 0)) {
      this.setData({
        hasReview: false
      })
    }

    if (!this.data.siteList.some(item => item.status == 1)) {
      this.setData({
        hasAvailable: false
      })
    }

    wx.hideLoading()
  },

  editSite(e) {
    wx.navigateTo({
      url: `/pages/SellerPage/siteInfo/index?siteId=${e.currentTarget.dataset.siteid}`,
    })
  },

  onLoad(options) {

  },

  onReady() {

  },

  async onShow() {
    this.onLoad()
    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/category/getSite",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        companyId: wx.getStorageSync('companyId'),
      },
      success: (res) => {
        if (res.statusCode !== 404) {
        res.data.forEach(item => {
          item.x = 0
        })
        if (res.data.some(item => item.status == 0)) {
          this.setData({
            hasReview: true
          })
        } else {
          this.setData({
            hasReview: false
          })
        }

        if (res.data.some(item => item.status == 1)) {
          this.setData({
            hasAvailable: true
          })
        } else {
          this.setData({
            hasAvailable: false
          })
        }
        this.setData({
          siteList: res.data
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
    //   // url: 'http://localhost:1919/category/getSite',
    //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/getSite',
    //   method:"POST",
    //   data: {
    //     companyId: wx.getStorageSync('companyId'),
    //   },
    //   success: (res) => {
    //     if (res.statusCode !== 404) {
    //     res.data.forEach(item => {
    //       item.x = 0
    //     })
    //     if (res.data.some(item => item.status == 0)) {
    //       this.setData({
    //         hasReview: true
    //       })
    //     } else {
    //       this.setData({
    //         hasReview: false
    //       })
    //     }

    //     if (res.data.some(item => item.status == 1)) {
    //       this.setData({
    //         hasAvailable: true
    //       })
    //     } else {
    //       this.setData({
    //         hasAvailable: false
    //       })
    //     }
    //     this.setData({
    //       siteList: res.data
    //     })
    //   }
    //   },
    //   fail: (res) => {
    //     wx.showToast({
    //       icon: 'error',
    //       title: 'Published Failed',
    //     })
    //   }
    // })
  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {

  }
})

let startX = 0;
let moveX = 0;
let moveDistance = 0;
let selectedLayout = ''
const db = wx.cloud.database()
Page({
  data: {
    show: false,
    layoutList: [],
    hasReview: false,
    hasAvailable: false
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
    let layoutId = e.currentTarget.dataset.layoutid
    moveX = e.touches[0].clientX
    moveDistance = moveX - startX
    let {
      layoutList
    } = this.data

    let index = layoutList.findIndex(item => item._id == layoutId)
    if (moveDistance < 0 && layoutList[index].x == 0) {
      layoutList[index].x = -166
      this.setData({
        layoutList
      })
    }

    if (moveDistance > 0 && layoutList[index].x == -166) {
      layoutList[index].x = 0
      this.setData({
        layoutList
      })
    }
  },

  toLayoutInfo() {
    wx.navigateTo({
      url: '/pages/SellerPage/layoutInfo/index',
    })
  },

  showPopup(e) {
    selectedLayout = e.currentTarget.dataset.layoutid
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  async deleteLayout() {
    this.onClose()
    await wx.showLoading({
      title: '删除中......',
      mask: true
    })

    let {
      layoutList
    } = this.data
    let index = layoutList.findIndex(item => item._id == selectedLayout)

    let deleteFileIds = layoutList[index].picList
    await wx.cloud.deleteFile({
      fileList: deleteFileIds
    })
    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/category/layoutRemove",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        _id: selectedLayout,
      },
      success: (res) => {
        console.log(res)
      },
      fail: (res) => {
        wx.showToast({
          icon: 'error',
          title: 'Removed Failed',
        })
      }
    })
    // wx.request({
    //   // url: 'http://localhost:1919/category/layoutRemove',
    //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/layoutRemove',
    //   method:'POST',
    //   data:{
    //       _id:selectedLayout,
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

    layoutList.splice(index, 1)
    this.setData({
      layoutList
    })

    if (!this.data.layoutList.some(item => item.status == 0)) {
      this.setData({
        hasReview: false
      })
    }

    if (!this.data.layoutList.some(item => item.status == 1)) {
      this.setData({
        hasAvailable: false
      })
    }

    wx.hideLoading()
  },

  editLayout(e) {
    wx.navigateTo({
      url: `/pages/SellerPage/layoutInfo/index?layoutId=${e.currentTarget.dataset.layoutid}`,
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
      "path": "/category/getLayout",
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
            layoutList: res.data
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
    //   // url: 'http://localhost:1919/category/getLayout',
    //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/getLayout',
    //   method:'POST',
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
    //       layoutList: res.data
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

let startX = 0;
let moveX = 0;
let moveDistance = 0;
let selectedPerformance = ''
const db = wx.cloud.database()
Page({
  data: {
    show: false,
    performanceList: [],
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
    let performanceId = e.currentTarget.dataset.performanceid
    moveX = e.touches[0].clientX
    moveDistance = moveX - startX
    let {
      performanceList
    } = this.data

    let index = performanceList.findIndex(item => item._id == performanceId)
    if (moveDistance < 0 && performanceList[index].x == 0) {
      performanceList[index].x = -166
      this.setData({
        performanceList
      })
    }

    if (moveDistance > 0 && performanceList[index].x == -166) {
      performanceList[index].x = 0
      this.setData({
        performanceList
      })
    }
  },

  toPerformanceInfo() {
    wx.navigateTo({
      url: '/pages/SellerPage/performanceInfo/index',
    })
  },

  showPopup(e) {
    selectedPerformance = e.currentTarget.dataset.performanceid
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  async deletePerformance() {
    this.onClose()
    await wx.showLoading({
      title: '删除中......',
      mask: true
    })

    let {
      performanceList
    } = this.data

    let index = performanceList.findIndex(item => item._id == selectedPerformance)

    let deleteFileIds = performanceList[index].picList

    await wx.cloud.deleteFile({
      fileList: deleteFileIds
    })
    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/category/performanceRemove",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        _id: selectedPerformance,
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
    //   // url: 'http://localhost:1919/category/performanceRemove',
    //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/performanceRemove',
    //   method:'POST',
    //   data:{
    //       _id:selectedPerformance,
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

    performanceList.splice(index, 1)
    this.setData({
      performanceList
    })

    if (!this.data.performanceList.some(item => item.status == 0)) {
      this.setData({
        hasReview: false
      })
    }

    if (!this.data.performanceList.some(item => item.status == 1)) {
      this.setData({
        hasAvailable: false
      })
    }

    wx.hideLoading()
  },

  editPerformance(e) {
    wx.navigateTo({
      url: `/pages/SellerPage/performanceInfo/index?performanceId=${e.currentTarget.dataset.performanceid}`,
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
      "path": "/category/getPerformance",
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
            performanceList: res.data
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
    //   // url: 'http://localhost:1919/category/getPerformance',
    //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/getPerformance',
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
    //       performanceList: res.data
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

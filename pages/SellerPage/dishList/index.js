let startX = 0;
let moveX = 0;
let moveDistance = 0;
let selectedDish = ''
const db = wx.cloud.database()
Page({
  data: {
    show: false,
    dishList: [],
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
    let dishId = e.currentTarget.dataset.dishid
    moveX = e.touches[0].clientX
    moveDistance = moveX - startX
    let {
      dishList
    } = this.data

    let index = dishList.findIndex(item => item._id == dishId)
    if (moveDistance < 0 && dishList[index].x == 0) {
      dishList[index].x = -166
      this.setData({
        dishList
      })
    }

    if (moveDistance > 0 && dishList[index].x == -166) {
      dishList[index].x = 0
      this.setData({
        dishList
      })
    }
  },

  toDishInfo() {
    wx.navigateTo({
      url: '/pages/SellerPage/dishInfo/index',
    })
  },

  showPopup(e) {
    selectedDish = e.currentTarget.dataset.dishid
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  async deleteDish() {
    this.onClose()
    await wx.showLoading({
      title: '删除中......',
      mask: true
    })

    let {
      dishList
    } = this.data

    let index = dishList.findIndex(item => item._id == selectedDish)

    let deleteFileIds = dishList[index].picList

    await wx.cloud.deleteFile({
      fileList: deleteFileIds
    })

    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/category/dishRemove",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        _id: selectedDish,
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
    //   // url: 'http://localhost:1919/category/dishRemove',
    //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/dishRemove',
    //   method: 'POST',
    //   data: {
    //     _id: selectedDish,
    //   },
    //   success: (res) => {
    //     console.log(res)
    //   },
    //   fail: (res) => {
    //     wx.showToast({
    //       icon: 'error',
    //       title: 'Removed Failed',
    //     })
    //   }
    // })

    dishList.splice(index, 1)
    this.setData({
      dishList
    })

    if (!this.data.dishList.some(item => item.status == 0)) {
      this.setData({
        hasReview: false
      })
    }

    if (!this.data.dishList.some(item => item.status == 1)) {
      this.setData({
        hasAvailable: false
      })
    }

    wx.hideLoading()
  },

  editDish(e) {
    wx.navigateTo({
      url: `/pages/SellerPage/dishInfo/index?dishId=${e.currentTarget.dataset.dishid}`,
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
      "path": "/category/getDish",
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
            dishList: res.data
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
    //   // url: 'http://localhost:1919/category/getDish',
    //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/getDish',
    //   method:'POST',
    //   data: {
    //     companyId: wx.getStorageSync('companyId'),
    //   },
    //   success: (res) => {
    //     if (res.statusCode !== 404) {
    //       res.data.forEach(item => {
    //         item.x = 0
    //       })
    //       if (res.data.some(item => item.status == 0)) {
    //         this.setData({
    //           hasReview: true
    //         })
    //       } else {
    //         this.setData({
    //           hasReview: false
    //         })
    //       }

    //       if (res.data.some(item => item.status == 1)) {
    //         this.setData({
    //           hasAvailable: true
    //         })
    //       } else {
    //         this.setData({
    //           hasAvailable: false
    //         })
    //       }
    //       this.setData({
    //         dishList: res.data
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

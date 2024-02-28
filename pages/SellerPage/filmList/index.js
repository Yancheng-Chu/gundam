let startX = 0;
let moveX = 0;
let moveDistance = 0;
let selectedFilm = ''
const db = wx.cloud.database()
Page({
  data: {
    show: false,
    filmList: [],
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
    let filmId = e.currentTarget.dataset.filmid
    moveX = e.touches[0].clientX
    moveDistance = moveX - startX
    let {
      filmList
    } = this.data

    let index = filmList.findIndex(item => item._id == filmId)
    if (moveDistance < 0 && filmList[index].x == 0) {
      filmList[index].x = -166
      this.setData({
        filmList
      })
    }

    if (moveDistance > 0 && filmList[index].x == -166) {
      filmList[index].x = 0
      this.setData({
        filmList
      })
    }
  },

  toFilmInfo() {
    wx.navigateTo({
      url: '/pages/SellerPage/filmInfo/index',
    })
  },

  showPopup(e) {
    selectedFilm = e.currentTarget.dataset.filmid
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  async deleteFilm() {
    this.onClose()
    await wx.showLoading({
      title: '删除中......',
      mask: true
    })
    let {
      filmList
    } = this.data
    let index = filmList.findIndex(item => item._id == selectedFilm)

    let deleteFileIds = filmList[index].picList

    await wx.cloud.deleteFile({
      fileList: deleteFileIds
    })
    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/category/filmRemove",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        _id: selectedFilm,
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
    //   // url: 'http://localhost:1919/category/filmRemove',
    //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/filmRemove',
    //   method: 'POST',
    //   data: {
    //     _id: selectedFilm,
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

    filmList.splice(index, 1)
    this.setData({
      filmList
    })

    if (!this.data.filmList.some(item => item.status == 0)) {
      this.setData({
        hasReview: false
      })
    }

    if (!this.data.filmList.some(item => item.status == 1)) {
      this.setData({
        hasAvailable: false
      })
    }

    wx.hideLoading()
  },

  editFilm(e) {
    wx.navigateTo({
      url: `/pages/SellerPage/filmInfo/index?filmId=${e.currentTarget.dataset.filmid}`,
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
      "path": "/category/getFilm",
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
            filmList: res.data
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
    //   // url: 'http://localhost:1919/category/getFilm',
    //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/getFilm',
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
    //         filmList: res.data
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
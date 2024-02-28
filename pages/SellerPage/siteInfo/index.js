const db = wx.cloud.database()
let editSiteId = ''
let staticFileIds = []
import getTimeStamp from "../../../utils/getTimeStamp"
Page({
  data: {
    fileList: [],
    name: '',
    address: '',
    size: '',
    capacity: '',
    info: '',
    usedTimes: 0,
  },

  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  afterRead(e) {
    console.log(e);
    let {
      fileList
    } = this.data

    fileList = [...fileList, ...e.detail.file]

    this.setData({
      fileList
    })
  },

  deleteImg(e) {
    console.log(e);
    let {
      fileList
    } = this.data
    fileList.splice(e.detail.index, 1)
    this.setData({
      fileList
    })
  },

  handleSize(e) {
    if (/^0/.test(e.detail.value)) {
      this.setData({
        size: ''
      })
    } else {
      this.setData({
        size: e.detail.value > 10000 ? 10000 : e.detail.value
      })
    }
  },

  handleCapacity(e) {
    if (/^0/.test(e.detail.value)) {
      this.setData({
        capacity: ''
      })
    } else {
      this.setData({
        capacity: e.detail.value > 2000 ? 2000 : e.detail.value
      })
    }
  },

  async submit() {
    let {
      fileList,
      name,
      address,
      capacity,
      info,
      size,
      usedTimes
    } = this.data
    let companyId = wx.getStorageSync('companyId')
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
        console.log(res.data)
        this.setData({
          company: res.data[0].company
        })
      },
      fail: (res) => {
        wx.showToast({
          icon: 'error',
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
    //     console.log(res.data)
    //       this.setData({
    //         company:res.data[0].company
    //       })
    //   },
    //   fail: (res) => {
    //     wx.showToast({
    //       icon: 'error',
    //       title: 'Searched Failed',
    //     })
    //   }
    // })

    // let companyId = "635a13deda85a5a23a16d8a7"
    let picList = []
    if (fileList.length && name && address && capacity && size) {
      await wx.showLoading({
        title: '上传中......',
        mask: true
      })
      if (editSiteId) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].url.startsWith('cloud')) {
            picList.push(fileList[i].url)
          } else {
            let code = Math.random().toFixed(10).slice(-10)
            let res = await wx.cloud.uploadFile({
              cloudPath: `category/sitePics/${companyId}/${code}`,
              filePath: fileList[i].url,
            })
            picList.push(res.fileID)
          }
        }

        let deleteFileIds = []
        staticFileIds.forEach(item => {
          if (!picList.includes(item)) {
            deleteFileIds.push(item)
          }
        })
        await wx.cloud.deleteFile({
          fileList: deleteFileIds
        })
        wx.cloud.callContainer({
          "config": {
            "env": "dream-party-7gp4oasy1647b3f1"
          },
          "path": "/category/siteUpdate",
          "header": {
            "X-WX-SERVICE": "party"
          },
          "method": "POST",
          "data": {
            _id: editSiteId,
            name,
            address,
            capacity,
            info,
            size,
            picList,
            fileList,
            timeStamp: getTimeStamp(),
            usedTimes,
            status: 0,
            company: this.data.company
          },
          success: (res) => {
            console.log(res)
          },
          fail: (res) => {
            wx.showToast({
              icon: 'error',
              title: 'Published Failed',
            })
          }
        })
        // wx.request({
        //   // url: 'http://localhost:1919/category/siteUpdate',
        //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/siteUpdate',
        //   method: 'POST',
        //   data: {
        //     _id: editSiteId,
        //     name,
        //     address,
        //     capacity,
        //     info,
        //     size,
        //     picList,
        //     fileList,
        //     timeStamp: getTimeStamp(),
        //     usedTimes,
        //     status: 0,
        //     company:this.data.company
        //   },
        //   success: (res) => {
        //     console.log(res)
        //   },
        //   fail: (res) => {
        //     wx.showToast({
        //       icon: 'error',
        //       title: 'Published Failed',
        //     })
        //   }
        // })
      } else {
        for (let i = 0; i < fileList.length; i++) {
          let code = Math.random().toFixed(10).slice(-10)
          let res = await wx.cloud.uploadFile({
            cloudPath: `category/sitePics/${companyId}/${code}`,
            filePath: fileList[i].url,
          })
          picList.push(res.fileID)
        }
        let list = []
        for (let i = 0; i < picList.length; i++) {
          list.push({
            url: picList[i],
            type: "image",
            thumb: picList[i]
          })
        }
        wx.cloud.callContainer({
          "config": {
            "env": "dream-party-7gp4oasy1647b3f1"
          },
          "path": "/category/site",
          "header": {
            "X-WX-SERVICE": "party"
          },
          "method": "POST",
          "data": {
            _openid: wx.getStorageSync('_openid'),
            companyId,
            name,
            address,
            capacity,
            info,
            size,
            picList,
            fileList: list,
            timeStamp: getTimeStamp(),
            company: this.data.company
          },
          success: (res) => {

          },
          fail: (res) => {
            wx.showToast({
              icon: 'error',
              title: 'Published Failed',
            })
          }
        })
        // wx.request({
        //   // url: 'http://localhost:1919/category/site',
        //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/site',
        //   method: 'POST',
        //   data: {
        //     _openid: wx.getStorageSync('_openid'),
        //     companyId,
        //     name,
        //     address,
        //     capacity,
        //     info,
        //     size,
        //     picList,
        //     fileList: list,
        //     timeStamp: getTimeStamp(),
        //     company: this.data.company
        //   },
        //   success: (res) => {

        //   },
        //   fail: (res) => {
        //     wx.showToast({
        //       icon: 'error',
        //       title: 'Published Failed',
        //     })
        //   }
        // })
      }

      setTimeout(() => {
        wx.hideLoading()
        wx.navigateBack({
          delta: 1
        })
      }, 1000);
    } else {
      wx.showToast({
        title: '您当前输入信息不完整',
        icon: 'none',
        mask: true
      })
    }
  },

  async onLoad(options) {
    console.log(options)
    if (options.siteId) {
      editSiteId = options.siteId
      wx.cloud.callContainer({
        "config": {
          "env": "dream-party-7gp4oasy1647b3f1"
        },
        "path": "/category/getSiteDetail",
        "header": {
          "X-WX-SERVICE": "party"
        },
        "method": "POST",
        "data": {
          _id: options.siteId,
        },
        success: (res) => {
          console.log(res)
          this.setData({
            address: res.data.address,
            capacity: res.data.capacity,
            info: res.data.info,
            name: res.data.name,
            size: res.data.size,
            fileList: res.data.fileList,
            staticFileIds: res.data.picList,
            company: res.data.company
          })
        },
        fail: (res) => {
          wx.showToast({
            icon: 'error',
            title: 'Published Failed',
          })
        }
      })
      // wx.request({
      //   // url: 'http://localhost:1919/category/getSiteDetail',
      //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/getSiteDetail',
      //   method: "POST",
      //   data: {
      //     _id: options.siteId,
      //   },
      //   success: (res) => {
      //     console.log(res)
      //     this.setData({
      //       address: res.data.address,
      //       capacity: res.data.capacity,
      //       info: res.data.info,
      //       name: res.data.name,
      //       size: res.data.size,
      //       fileList: res.data.fileList,
      //       staticFileIds: res.data.picList,
      //       company: res.data.company
      //     })
      //   },
      //   fail: (res) => {
      //     wx.showToast({
      //       icon: 'error',
      //       title: 'Published Failed',
      //     })
      //   }
      // })
    }
  },

  onReady() {

  },

  onShow() {

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

const db = wx.cloud.database()
let editLayoutId = ''
let staticFileIds = []
import getTimeStamp from "../../../utils/getTimeStamp"
Page({
  data: {
    fileList: [],
    name: '',
    info: '',
    usedTimes: 0,
  },

  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  afterRead(e) {
    let {
      fileList
    } = this.data

    fileList = [...fileList, ...e.detail.file]

    this.setData({
      fileList
    })
  },

  deleteImg(e) {
    let {
      fileList
    } = this.data
    fileList.splice(e.detail.index, 1)
    this.setData({
      fileList
    })
  },

  async submit() {
    let {
      fileList,
      name,
      info,
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
    //     this.setData({
    //       company: res.data[0].company
    //     })
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
    if (fileList.length && name) {
      await wx.showLoading({
        title: '上传中......',
        mask: true
      })
      if (editLayoutId) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].url.startsWith('cloud')) {
            picList.push(fileList[i].url)
          } else {
            let code = Math.random().toFixed(10).slice(-10)
            let res = await wx.cloud.uploadFile({
              cloudPath: `category/layoutPics/${companyId}/${code}`,
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
          "path": "/category/layoutUpdate",
          "header": {
            "X-WX-SERVICE": "party"
          },
          "method": "POST",
          "data": {
            _id: editLayoutId,
            name,
            info,
            picList,
            fileList,
            usedTimes,
            timeStamp: getTimeStamp(),
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
        //   // url: 'http://localhost:1919/category/layoutUpdate',
        //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/layoutUpdate',
        //   method: 'POST',
        //   data: {
        //     _id: editLayoutId,
        //     name,
        //     info,
        //     picList,
        //     fileList,
        //     usedTimes,
        //     timeStamp: getTimeStamp(),
        //     status: 0,
        //     company: this.data.company
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
            cloudPath: `category/layoutPics/${companyId}/${code}`,
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
          "path": "/category/layout",
          "header": {
            "X-WX-SERVICE": "party"
          },
          "method": "POST",
          "data": {
            _openid: wx.getStorageSync('_openid'),
            companyId,
            name,
            info,
            picList,
            fileList: list,
            timeStamp: getTimeStamp(),
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
        //   // url: 'http://localhost:1919/category/layout',
        //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/layout',
        //   method: 'POST',
        //   data: {
        //     _openid: wx.getStorageSync('_openid'),
        //     companyId,
        //     name,
        //     info,
        //     picList,
        //     fileList: list,
        //     timeStamp: getTimeStamp(),
        //     company: this.data.company
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
    if (options.layoutId) {
      editLayoutId = options.layoutId
      wx.cloud.callContainer({
        "config": {
          "env": "dream-party-7gp4oasy1647b3f1"
        },
        "path": "/category/getLayoutDetail'",
        "header": {
          "X-WX-SERVICE": "party"
        },
        "method": "POST",
        "data": {
          _id: options.layoutId,
        },
        success: (res) => {
          console.log(res)
          this.setData({
            info: res.data.info,
            name: res.data.name,
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
      //   // url: 'http://localhost:1919/category/getLayoutDetail',
      //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/getLayoutDetail',
      //   method: 'POST',
      //   data: {
      //     _id: options.layoutId,
      //   },
      //   success: (res) => {
      //     console.log(res)
      //     this.setData({
      //       info: res.data.info,
      //       name: res.data.name,
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

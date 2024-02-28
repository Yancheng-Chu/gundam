const db = wx.cloud.database()
let editDishId = ''
let staticFileIds = []
import getTimeStamp from "../../../utils/getTimeStamp"
Page({

  data: {
    fileList: [],
    name: '',
    capacity: '',
    info: '',
    company:''
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
      capacity,
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
            company:res.data[0].company
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
    if (fileList.length && name && capacity) {
      await wx.showLoading({
        title: '上传中......',
        mask: true
      })
      if (editDishId) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].url.startsWith('cloud')) {
            picList.push(fileList[i].url)
          } else {
            let code = Math.random().toFixed(10).slice(-10)
            let res = await wx.cloud.uploadFile({
              cloudPath: `category/dishPics/${companyId}/${code}`,
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
          "path": "/category/dishUpdate",
          "header": {
            "X-WX-SERVICE": "party"
          },
          "method": "POST",
          "data": {
            _id: editDishId,
            capacity,
            name,
            info,
            picList,
            fileList,
            usedTimes,
            timeStamp: getTimeStamp(),
            status: 0,
            company:this.data.company
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
        //   // url: 'http://localhost:1919/category/dishUpdate',
        //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/dishUpdate',
        //   method: 'POST',
        //   data: {
        //     _id: editDishId,
        //     capacity,
        //     name,
        //     info,
        //     picList,
        //     fileList,
        //     usedTimes,
        //     timeStamp: getTimeStamp(),
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
            cloudPath: `category/dishPics/${companyId}/${code}`,
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
            "path": "/category/dish",
            "header": {
              "X-WX-SERVICE": "party"
            },
            "method": "POST",
            "data": {
              _openid: wx.getStorageSync('_openid'),
              companyId,
              capacity,
              name,
              info,
              picList,
              fileList: list,
              timeStamp: getTimeStamp(),
              company:this.data.company
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
        //   // url: 'http://localhost:1919/category/dish',
        //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/dish',
        //   method: 'POST',
        //   data: {
        //     _openid: wx.getStorageSync('_openid'),
        //     companyId,
        //     capacity,
        //     name,
        //     info,
        //     picList,
        //     fileList: list,
        //     timeStamp: getTimeStamp(),
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
    if (options.dishId) {
      editDishId = options.dishId
      wx.cloud.callContainer({
        "config": {
          "env": "dream-party-7gp4oasy1647b3f1"
        },
        "path": "/category/getDishDetail",
        "header": {
          "X-WX-SERVICE": "party"
        },
        "method": "POST",
        "data": {
          _id: options.dishId,
        },
        success: (res) => {
          console.log(res)
          this.setData({
            capacity: res.data.capacity,
            info: res.data.info,
            name: res.data.name,
            fileList: res.data.fileList,
            staticFileIds: res.data.picList,
            company:res.data.company
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
      //   // url: 'http://localhost:1919/category/getDishDetail',
      //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/category/getDishDetail',
      //   method:'POST',
      //   data: {
      //     _id: options.dishId,
      //   },
      //   success: (res) => {
      //     console.log(res)
      //     this.setData({
      //       capacity: res.data.capacity,
      //       info: res.data.info,
      //       name: res.data.name,
      //       fileList: res.data.fileList,
      //       staticFileIds: res.data.picList,
      //       company:res.data.company
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
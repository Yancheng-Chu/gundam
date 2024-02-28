let app = getApp()
const db = wx.cloud.database()
const userCollection = db.collection('Company')
const _ = db.command;
Page({
  data: {
    avatar: '',
    userInfo: '店铺名称',
    showQRCode: false,
    edit: '完善你的店铺信息',
    color: '#FF8400',
    active: 2,
    img: [],
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

  onChooseAvatar(e) {
    let avatarUrl = e.detail.avatarUrl
    const companyId = wx.getStorageSync('companyId')
    var timeStamp = new Date().getTime();
    wx.showLoading({
      title: '上传图片中',
      mask: true,
      success: () => {
        wx.cloud.uploadFile({
          cloudPath: `companys_avatar/${companyId}/${timeStamp}`,
          filePath: avatarUrl, // 文件路径
          success: res => {
            let fileID = res.fileID
            wx.cloud.callContainer({
              "config": {
                "env": "dream-party-7gp4oasy1647b3f1"
              },
              "path": "/seller/update",
              "header": {
                "X-WX-SERVICE": "party"
              },
              "method": "POST",
              "data": {
                _id: wx.getStorageSync('companyId'),
                avatar: fileID
              },
              success: (res) => {
                console.log(res);
                this.setData({
                  avatar: fileID
                })
                wx.hideLoading()
              }
            })
            // wx.request({
            //   // url: 'http://localhost:1919/seller/update',
            //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/update',
            //   method:'POST',
            //   data: {
            //     _id: wx.getStorageSync('companyId'),
            //     avatar: fileID
            //   },
            //   success: (res) => {
            //     console.log(res);
            //     this.setData({
            //       avatar: fileID
            //     })
            //     wx.hideLoading()
            //   }
            // })
          },
          fail: (e) => {
            console.log(e);
          }
        })
      }
    })
  },
  onChange(e) {
    let url
    if (e.detail == 0) {
      url = "/pages/SellerPage/Smain/index"
    } else if (e.detail == 1) {
      url = "/pages/SellerPage/Sorder/index"
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
      "path": "/seller/seller",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        _openid: wx.getStorageSync('_openid')
      },
      success: (res) => {
        if (res.data[0].company != '') {
          this.setData({
            userInfo: res.data[0].company,
            avatar: res.data[0].avatar,
            img: res.data[0].img
          })
        } else {
          this.setData({
            avatar: res.data[0].avatar,
            img: res.data[0].img
          })
        }
        if (res.data[0].img.length !== 0) {
          this.setData({
            edit: '修改店铺信息',
            color: '#BCBCBC'
          })
        }
      },
      fail: (res) => {
        console.log("Search Failed", res)
        wx.showToast({
          icon: 'error',
          title: '请重新加载',
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
    //     if (res.data[0].company != '') {
    //       this.setData({
    //         userInfo: res.data[0].company,
    //         avatar: res.data[0].avatar,
    //         img: res.data[0].img
    //       })
    //     } else {
    //       this.setData({
    //         avatar: res.data[0].avatar,
    //         img: res.data[0].img
    //       })
    //     }
    //     if (res.data[0].img.length !== 0) {
    //       this.setData({
    //         edit: '修改店铺信息',
    //         color: '#BCBCBC'
    //       })
    //     }
    //   },
    //   fail: (res) => {
    //     console.log("Search Failed", res)
    //     wx.showToast({
    //       icon: 'error',
    //       title: '请重新加载',
    //     })
    //   }
    // })
  },
  showQRCodePopup() {
    this.setData({
      showQRCode: true
    });
  },

  onCloseQRCode() {
    this.setData({
      showQRCode: false
    });
  },

  jumpToOrder() {
    let url = "/pages/SellerPage/Slist/index"
    wx.navigateTo({
      url
    })
  },
  jumpToCheck() {
    let url = "/pages/SellerPage/identify/index"
    wx.navigateTo({
      url
    })
  },
  jumpToProvider() {
    let url = "/pages/SellerPage/Sclass/index"
    wx.navigateTo({
      url
    })
  },
  jumpToMain() {
    let url = "/pages/mine/index"
    wx.switchTab({
      url
    })
  },
  jumpToCF() {
    let url = "/pages/SellerPage/Sclass/index"
    wx.navigateTo({
      url
    })
  },
  jumpToInfo() {
    let url = "/pages/SellerPage/information/index"
    wx.navigateTo({
      url
    })
  },
});

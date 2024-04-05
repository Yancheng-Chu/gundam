import {
  api
} from './utils/api.js';
import {
  fileserver,
  mapkey
} from './utils/const.js';

App({
  onLaunch() {
    wx.cloud.init({
      env: ''
    })

    // wx.clearStorageSync()

    this.getNavigationBarInfo()

    wx.showLoading({
      title: '获取用户数据',
      mask: true,
      success: () => {
        if (!wx.getStorageSync('_openid')) {
          wx.cloud.callFunction({
            name: "getOpenId",
            success(res) {
              wx.setStorageSync('_openid', res.result.openid)
              let _openid = wx.getStorageSync('_openid')
              wx.cloud.callContainer({
                "config": {
                  "env": "dream-party-7gp4oasy1647b3f1"
                },
                "path": "/customer/getUser",
                "header": {
                  "X-WX-SERVICE": "party"
                },
                "method": "POST",
                "data": {
                  _openid: _openid,
                },
                success: (res) => {
                  wx.removeStorageSync("userInfo")
                  if (res.data.length > 0) {
                    wx.setStorageSync('userInfo', {
                      nickName: res.data[0].nickName,
                      avatarUrl: res.data[0].avatarUrl,
                      phoneNumber: res.data[0].phoneNumber
                    })
                  }
                  wx.hideLoading()
                },

                fail: (res) => {
                  wx.showToast({
                    icon: 'error',
                    title: 'Login Failed',
                  })
                }
              })

              // wx.request({
              //   // url: 'http://localhost:1919/customer/getUser',
              //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/customer/getUser',
              //   method: 'POST',
              //   data: {
              //     _openid: _openid,
              //   },
              //   // header:{
              //   //   'Content-Type':'application/json'
              //   // },
              //   success: (res) => {
              //     wx.removeStorageSync("userInfo")
              //     if (res.data.length > 0) {
              //       wx.setStorageSync('userInfo', {
              //         nickName: res.data[0].nickName,
              //         avatarUrl: res.data[0].avatarUrl,
              //         phoneNumber: res.data[0].phoneNumber
              //       })
              //     }
              //     wx.hideLoading()
              //   },

              //   fail: (res) => {
              //     wx.showToast({
              //       icon: 'error',
              //       title: 'Login Failed',
              //     })
              //   }
              // })
            }
          })
        }else{
          wx.hideLoading()
        }
      }
    })


  },
  globalData: {
    userInfo: '',
    openid: '',
    unionid: '',
    fileserver,
    mapkey,
    api,
    popupshow:true,

    seller: [{
        "pagePath": "/pages/SellerPage/Spage/index",
        "text": "首页",
        iconPath: "cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/seller/tabbar/syh.png",
        selectedIconPath: "cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/seller/tabbar/syc.png"
      },
      {
        "pagePath": "/pages/SellerPage/Spage/index",
        "text": "接单",
        iconPath: "cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/seller/tabbar/jdh .png",
        selectedIconPath: "cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/seller/tabbar/jdc.png"
      },
      {
        "pagePath": "/pages/SellerPage/Spage/index",
        "text": "我的",
        iconPath: "cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/seller/tabbar/wdh.png",
        selectedIconPath: "cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/seller/tabbar/wdc.png"
      }
    ]
  },

  tabChange: function (e) {
    wx.redirectTo({
      url: e.detail.item.pagePath
    })
  },
  getNavigationBarInfo() {
    const {
      statusBarHeight,
      platform
    } = wx.getSystemInfoSync()
    const {
      top,
      height
    } = wx.getMenuButtonBoundingClientRect()
    wx.setStorageSync('statusBarHeight', statusBarHeight)
    wx.setStorageSync('menuButtonHeight', height ? height : 32)

    if (top && top !== 0 && height && height !== 0) {
      const navigationBarHeight = (top - statusBarHeight) * 2 + height
      wx.setStorageSync('navigationBarHeight', navigationBarHeight)
    } else {
      wx.setStorageSync('navigationBarHeight', platform === 'android' ? 48 : 40)
    }
  }
})

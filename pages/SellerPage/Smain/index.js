let app = getApp()
const db = wx.cloud.database()
const userCollection = db.collection('Company')
const _ = db.command;
Page({
  data: {
    response: 0,
    userInfo: '店铺名称',
    avatar: '',
    color: '#FF8400',
    active: 0,
    list: [],
    list2: [],
    check: [],
    check2: [],
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
  onChange(e) {
    let url
    if (e.detail == 1) {
      url = "/pages/SellerPage/Sorder/index"
    } else if (e.detail == 2) {
      url = "/pages/SellerPage/Spage/index"
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
        for (let i = 0; i < res.data[0].list.length; i++) {
          if (i < 3) {
            this.data.list.push("/resource/images/classfi/" + res.data[0].list[i] + ".png")
            this.data.check.push(res.data[0].check[i])
          } else {
            this.data.list2.push("/resource/images/classfi/" + res.data[0].list[i] + ".png")
            this.data.check2.push(res.data[0].check[i])
          }
        }
        if (res.data[0].company != '') {
          this.setData({
            list: this.data.list,
            list2: this.data.list2,
            check: this.data.check,
            check2: this.data.check2,
            userInfo: res.data[0].company,
            avatar: res.data[0].avatar,
            response: res.data[0].response,
            accept: res.data[0].accept,
            complete: res.data[0].complete,
          })
        } else {
          this.setData({
            list: this.data.list,
            list2: this.data.list2,
            check: this.data.check,
            check2: this.data.check2,
            avatar: res.data[0].avatar,
            response: res.data[0].response,
            accept: res.data[0].accept,
            complete: res.data[0].complete,
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: 'Searched Failed',
        })
      }
    })
    // wx.request({
    //   // url: 'http://localhost:1919/seller/seller',
    //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/seller',
    //   method:"POST",
    //   data:{
    //     _openid: wx.getStorageSync('_openid')
    //   },
    //   success:(res) => {
    //     for (let i = 0; i<res.data[0].list.length; i++){
    //       if(i<3){
    //         this.data.list.push("/resource/images/classfi/" + res.data[0].list[i] + ".png")
    //         this.data.check.push(res.data[0].check[i])
    //       }else{
    //         this.data.list2.push("/resource/images/classfi/" + res.data[0].list[i] + ".png")
    //         this.data.check2.push(res.data[0].check[i])
    //       }
    //     }
    //     if(res.data[0].company != ''){
    //       this.setData({
    //         list:this.data.list,
    //         list2:this.data.list2,
    //         check:this.data.check,
    //         check2:this.data.check2,
    //         userInfo:res.data[0].company,
    //         avatar:res.data[0].avatar,
    //       response: res.data[0].response,
    //       accept: res.data[0].accept,
    //       complete: res.data[0].complete,
    //       })
    //     }else{
    //       this.setData({
    //         list:this.data.list,
    //         list2:this.data.list2,
    //         check:this.data.check,
    //         check2:this.data.check2,
    //         avatar:res.data[0].avatar,
    //       response: res.data[0].response,
    //       accept: res.data[0].accept,
    //       complete: res.data[0].complete,
    //       })
    //     }
    //   },
    //   fail:(res) => {
    //     wx.showToast({
    //       title: 'Searched Failed',
    //     })
    //   }
    // })
  },

  jumpToArea(e) {
    let url
    let item = e.currentTarget.dataset.jump
    console.log(item)
    let i = item.split("/")[item.split("/").length - 1]
    let ii = i.substr(0, i.length - 4)
    if (ii == 'area') {
      url = "/pages/SellerPage/siteList/index"
    } else if (ii == 'activity') {

    } else if (ii == 'meal') {
      url = "/pages/SellerPage/dishList/index"
    } else if (ii == 'photo') {
      url = "/pages/SellerPage/filmList/index"
    } else if (ii == 'show') {
      url = "/pages/SellerPage/performanceList/index"
    } else if (ii == 'decoration') {
      url = "/pages/SellerPage/layoutList/index"
    }
    wx.navigateTo({
      url
    })
  },
  jumpToArea2(e) {
    let url
    let item = e.currentTarget.dataset.jump
    console.log(item)
    let i = item.split("/")[item.split("/").length - 1]
    let ii = i.substr(0, i.length - 4)
    if (ii == 'area') {
      url = "/pages/SellerPage/siteList/index"
    } else if (ii == 'activity') {

    } else if (ii == 'meal') {
      url = "/pages/SellerPage/dishList/index"
    } else if (ii == 'photo') {
      url = "/pages/SellerPage/filmList/index"
    } else if (ii == 'show') {
      url = "/pages/SellerPage/performanceList/index"
    } else if (ii == 'decoration') {
      url = "/pages/SellerPage/layoutList/index"
    }
    wx.navigateTo({
      url
    })
  },
});

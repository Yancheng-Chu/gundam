const db = wx.cloud.database()
const userCollection = db.collection('Company')
const _ = db.command;
const computedBehavior = require('miniprogram-computed');
Page({
  behaviors: [computedBehavior],
  watch: {
    'FoList,checked'(e) {
      if (this.data.FoList.length == 1 && this.data.checked == true) {
        this.setData({
          isDisabled: false,
          opacity: 0.9
        });
      }else{
        this.setData({
          isDisabled: true,
          opacity: 0.4
        });
      }
    },
  },
  data: {
    checked: false,
    ID:'',
    license:'',
    FoList: [],
    isDisabled:true,
    opacity: .4,
    Fo_activate:1,
    name:'',
    Foimg:[],
  },
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
  async onLoad(){
    this.setData({
      name: wx.getStorageSync('companyId')
      // name: '635a13deda85a5a23a16d8a7'
    })
  },
  afterRead(e) {
    console.log(e);
    let {
      FoList
    } = this.data

    FoList = [...FoList, ...e.detail.file]
    this.setData({
      FoList,
    })
  },

  deleteImg(e) {
    console.log(e);
    let {
      FoList
    } = this.data
    FoList.splice(e.detail.index, 1)
    this.setData({
      FoList,
    })
  },
  async jump(e) { // need optimize
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      isDisabled:true
    })
    for (let i = 0; i < this.data.FoList.length; i++) {
      let code = Math.random().toFixed(10).slice(-10)
      let res = await wx.cloud.uploadFile({
        cloudPath: `identity/foodLi/${this.data.name}/${code}`,
        filePath: this.data.FoList[i].url,
      })
      this.data.Foimg.push({
        url: res.fileID,
        type: "image",
        thumb: res.fileID,
      })
    }
    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/seller/sID",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        _id: this.data.name,
        FoodID:'待审核',
        Foimg:this.data.Foimg,
      },
      success:(res) => {
        console.log(res)
      setTimeout(function () {
        wx.hideLoading()
        let url = "/pages/SellerPage/check/index?title=" + e.currentTarget.dataset.title
        wx.navigateTo({
          url
        })
      }, 2000)
      },
      fail:(res) => {
        wx.showToast({
          icon: 'error',
          title: 'Uploaded Failed',
        })
      }
    })
    // wx.request({
    //   // url: 'http://localhost:1919/seller/sID',
    //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/sID',
    //   method:'POST',
    //   data:{
    //     _id: this.data.name,
    //     FoodID:'待审核',
    //     Foimg:this.data.Foimg,
    //   },
    //   success:(res) => {
    //     console.log(res)
    //   setTimeout(function () {
    //     wx.hideLoading()
    //     let url = "/pages/SellerPage/check/index?title=" + e.currentTarget.dataset.title
    //     wx.navigateTo({
    //       url
    //     })
    //   }, 2000)
    //   },
    //   fail:(res) => {
    //     wx.showToast({
    //       icon: 'error',
    //       title: 'Uploaded Failed',
    //     })
    //   }
    // })
  },
  privacy(){
    let url = "/pages/SellerPage/sla/index"
    wx.navigateTo({
      url
    })
  },
  sla(){
    let url = "/pages/SellerPage/privacy/index"
    wx.navigateTo({
      url
    })
  },
  back(e){
    wx.navigateBack({
      delta: 1,
  })
  }
});
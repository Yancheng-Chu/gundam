const computedBehavior = require('miniprogram-computed');
const db = wx.cloud.database()
const userCollection = db.collection('Company')
const _ = db.command;
Page({
  behaviors: [computedBehavior],
  watch: {
    'IDList,IDList2,checked'(e) {
      if (this.data.IDList.length == 1 && this.data.IDList2.length == 1 && this.data.checked == true) {
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
    ID: '',
    license: '',
    IDList: [],
    IDList2: [],
    isDisabled: true,
    opacity: .4,
    ID_activate: 1,
    Idimg: [],
    name: '',
    list: []
  },
  async onLoad() {
    this.setData({
      name: wx.getStorageSync('companyId')
      // name: '635a13deda85a5a23a16d8a7'
    })
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
  afterRead(e) {
    let {
      IDList
    } = this.data

    IDList = [...IDList, ...e.detail.file]
    this.setData({
      IDList
    })
  },

  deleteImg(e) {
    console.log(e);
    let {
      IDList
    } = this.data
    IDList.splice(e.detail.index, 1)
    this.setData({
      IDList,
      isDisabled: true,
      opacity: 0.4
    })
  },
  afterRead2(e) {
    console.log(e);
    let {
      IDList2
    } = this.data

    IDList2 = [...IDList2, ...e.detail.file]
    this.setData({
      IDList2
    })
  },

  deleteImg2(e) {
    let {
      IDList2
    } = this.data
    IDList2.splice(e.detail.index, 1)
    this.setData({
      IDList2,
      isDisabled: true,
      opacity: 0.4
    })
  },
  async jump(e) { // need optimize
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      isDisabled: true
    })
    this.data.list.push(
      this.data.IDList[0],
      this.data.IDList2[0]
    )
    for (let i = 0; i < this.data.IDList.length; i++) {
      let res = await wx.cloud.uploadFile({
        cloudPath: `identity/IDLi/${this.data.name}/${'Front'}`,
        filePath: this.data.IDList[i].url,
      })
      this.data.Idimg.push({
        url: res.fileID,
        type: "image",
        thumb: res.fileID,
      })
    }
    for (let i = 0; i < this.data.IDList2.length; i++) {
      let res = await wx.cloud.uploadFile({
        cloudPath: `identity/IDLi/${this.data.name}/${'Back'}`,
        filePath: this.data.IDList2[i].url,
      })
      this.data.Idimg.push({
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
        Idimg: this.data.Idimg,
        ID: '待审核'
      },
      success: (res) => {
        console.log(res)
        setTimeout(function () {
          wx.hideLoading()
          let url = "/pages/SellerPage/check/index?title=" + e.currentTarget.dataset.title
          wx.navigateTo({
            url
          })
        }, 2000)
      },
      fail: (res) => {
        wx.showToast({
          icon: 'error',
          title: 'Uploaded Failed',
        })
      }
    })
    // wx.request({
    //   // url: 'http://localhost:1919/seller/sID',
    //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/sID',
    //   method: 'POST',
    //   data: {
    //     _id: this.data.name,
    //     Idimg: this.data.Idimg,
    //     ID: '待审核'
    //   },
    //   success: (res) => {
    //     console.log(res)
    //     setTimeout(function () {
    //       wx.hideLoading()
    //       let url = "/pages/SellerPage/check/index?title=" + e.currentTarget.dataset.title
    //       wx.navigateTo({
    //         url
    //       })
    //     }, 2000)
    //   },
    //   fail: (res) => {
    //     wx.showToast({
    //       icon: 'error',
    //       title: 'Uploaded Failed',
    //     })
    //   }
    // })
  },
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
  back() {
    wx.navigateBack({
      delta: 1,
    })
  }
});

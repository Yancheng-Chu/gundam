var myDate = new Date();
const computedBehavior = require('miniprogram-computed');
const db = wx.cloud.database()
const userCollection = db.collection('Company')
const _ = db.command;
Page({
  behaviors: [computedBehavior],
  watch: {
    'LiList,code,budget,time,checked'(e) {
      if (this.data.LiList.length == 1 && this.data.code != "" && this.data.budget != "" && this.data.time != "" && this.data.checked == true) {
        this.setData({
          isDisabled: false,
          opacity: 0.9
        })
      }else{
        this.setData({
          isDisabled: true,
          opacity: 0.4
        })
      }
    },
  },
  data: {
    checked: false,
    name: '',
    Li_activate: 1,
    LiList: [],
    Liimg: [],
    ID: '',
    license: '',
    code: '',
    budget: '',
    select: '',
    time: '',
    showT: false,
    isDisabled: true,
    opacity: .4,
    currentDate: myDate.getTime(),
    minDate: new Date(2000, 0, 1).getTime(),
    maxDate: myDate.getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
  async onLoad() {
    this.setData({
      name: wx.getStorageSync('companyId')
      // name: '635a13deda85a5a23a16d8a7'
    })
  },
  afterRead(e) {
    console.log(e);
    let {
      LiList
    } = this.data

    LiList = [...LiList, ...e.detail.file]
    this.setData({
      LiList,
    })
  },

  deleteImg(e) {
    console.log(e);
    let {
      LiList
    } = this.data
    LiList.splice(e.detail.index, 1)
    this.setData({
      LiList,
      isDisabled: true,
      opacity: 0.4
    })
  },
  onInput(event) {
    let year = new Date(event.detail).getFullYear();
    let month = new Date(event.detail).getMonth() + 1;
    let date = new Date(event.detail).getDate();
    let time = year + '年' + month + '月' + date + '日'
    console.log(time)
    this.setData({
      currentDate: event.detail,
      select: time
    });
  },

  changeC(e) {
    let value;
    if (/^[1-9]{1}[0-9]*$/.test(e.detail.value)) {
      this.data.persons = true;
      value = e.detail.value;
      console.log("check for code");
    } else {
      this.data.persons = false;
      value = e.detail.value.substring(0, e.detail.value.length - 1);
      console.log("Should not be 0")
    }
    this.setData({
      code: value,
    });
  },

  changeB(e) {
    let value;
    if (/^[1-9]{1}[0-9]*$/.test(e.detail.value)) {
      this.data.persons = true;
      value = e.detail.value;
      console.log("check for budget");
    } else {
      this.data.persons = false;
      value = e.detail.value.substring(0, e.detail.value.length - 1);
      console.log("Should not be 0")
    }
    this.setData({
      budget: value,
    });
  },
  onClickT(e) {
    this.setData({
      showT: true
    });
  },
  onClose() {
    this.setData({
      showT: false,
    });
  },
  onCloseT() {
    this.setData({
      showT: false,
      time: this.data.select
    });
  },

  async jump(e) { // need optimize
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      isDisabled: true
    })
    for (let i = 0; i < this.data.LiList.length; i++) {
      let code = Math.random().toFixed(10).slice(-10)
      let res = await wx.cloud.uploadFile({
        cloudPath: `identity/storeLi/${this.data.name}/${code}`,
        filePath: this.data.LiList[i].url,
      })
      this.data.Liimg.push({
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
        License: '待审核',
        Liimg: this.data.Liimg,
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
    //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/sID',
    //   method:'POST',
    //   data:{
    //       _id: this.data.name,
    //       License:'待审核',
    //       Liimg: this.data.Liimg,
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
  privacy() {
    let url = "/pages/SellerPage/sla/index"
    wx.navigateTo({
      url
    })
  },
  sla() {
    let url = "/pages/SellerPage/privacy/index"
    wx.navigateTo({
      url
    })
  },
  back(e) {
    wx.navigateBack({
      delta: 1,
    })
  }
});

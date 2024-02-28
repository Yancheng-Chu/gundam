const db = wx.cloud.database()
const userCollection = db.collection('Company')
const _ = db.command;
Page({
  data: {
    phone: '',
    company: '',
    listId: '',
    isDisabled: true,
    opacity: .4,
    avatar: 'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/resource/images/login2.png'
  },



  jump(e) {
    const {
      company,
      phone
    } = this.data;

    wx.showLoading({
      icon: 'loading',
      title: '提交中'
    })
    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/seller/slogin",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        _openid: wx.getStorageSync('_openid'),
        company,
        phone
      },
      success: (res) => {
        wx.setStorageSync('companyId', res.data)
        setTimeout(() => {
          wx.hideLoading()
          let url = "/pages/SellerPage/Sclass/index"
          wx.navigateTo({
            url
          })
        }, 1000);
      },
      fail: (res) => {
        wx.showToast({
          icon: 'error',
          title: 'Published Failed',
        })
      }
    })
    // wx.request({
    //   // url: 'http://localhost:1919/seller/slogin',
    //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/slogin',
    //   method: 'POST',
    //   data: {
    //     _openid: wx.getStorageSync('_openid'),
    //     company,
    //     phone
    //   },
    //   success: (res) => {
    //     wx.setStorageSync('companyId', res.data)
    //     setTimeout(() => {
    //       wx.hideLoading()
    //       let url = "/pages/SellerPage/Sclass/index"
    //       wx.navigateTo({
    //         url
    //       })
    //     }, 1000);
    //   },
    //   fail: (res) => {
    //     wx.showToast({
    //       icon: 'error',
    //       title: 'Published Failed',
    //     })
    //   }
    // })
  },
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  cPhone(e) {
    let value;
    if (/^[1-9]{1}[0-9]*$/.test(e.detail.value)) {
      value = e.detail.value;
      console.log("check for phone");
    } else {
      // this.data.persons = false;
      value = e.detail.value.substring(0, e.detail.value.length - 1);
      console.log("Should not be 0")
    }
    this.setData({
      phone: value,
    });
    if (value.length == 11) {
      this.setData({
        isDisabled: false,
        opacity: 0.9
      });
    } else {
      this.setData({
        isDisabled: true,
        opacity: 0.4
      });
    }
  },
  cName(e) {
    this.setData({
      company: e.detail.value,
    });
  },

});

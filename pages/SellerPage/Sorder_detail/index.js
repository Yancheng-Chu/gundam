let app = getApp()
const db = wx.cloud.database()
const userCollection = db.collection('PartyList')
const sellerCollection = db.collection('Company')
const responseCollection = db.collection('Response')
const _ = db.command;
const computedBehavior = require('miniprogram-computed');
Page({
  behaviors: [computedBehavior],
  watch: {
    'amount'(e) {
      if (this.data.amount != "") {
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
  },
  data: {
    _id: '',
    party_type: '',
    budget: '',
    person: '',
    diy_on: '',
    orderTime: '',
    listId: '',
    status: '',
    isDisabled: false,
    opacity: 0.4,
    response: 0,
    amount: '',
    times: 0,
    response: 0,
    order_status: '',
    order_check: false,
    o_s: '',
    check: 0,
    name: '',
    checkID: '',
    company: '',
    date: ''
  },
  send(openid, party_type, budget) {
    var t = this
    wx.cloud.callFunction({
      name: 'sendBuyer',
      data: {
        openid: openid,
        party_type: party_type,
        company: this.data.company,
        budget: budget,
        // time:'2022年8月9日 2:25'
        time: this.data.orderTime,
      }
    }).then(res => {
      console.log('success22', res)
    }).catch(res => {
      console.log('fail22', res)
    })
  },
  onChange(e) {
    let value;
    if (/^[1-9]{1}[0-9]*$/.test(e.detail.value)) {
      value = e.detail.value;
      console.log("check for amount");
    } else {
      value = e.detail.value.substring(0, e.detail.value.length - 1);
      console.log("Should not be 0")
    }
    this.setData({
      amount: value,
    });
  },

  onShow() {

  },
  async onLoad(option) {
    if (option.status == '已接单' || option.status == '已完成') {
      this.setData({
        order_check: true,
        o_s: option.status
      })
    } else {
      this.setData({
        order_check: false,
      })
    }
    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/seller/userOrders",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        _id: option.id
      },
      success: (res) => {
        this.setData({
          b_openid: res.data[0]._openid,
          party_type: res.data[0].party_type,
          budget: res.data[0].budget,
          orderTime: res.data[0].orderTime,
          status: res.data[0].status,
          diy_on: res.data[0].diy_on,
          person: res.data[0].person,
          listId: option.id,
          address: res.data[0].location.rough,
          name: res.data[0].userInfo.nickName,
          date: res.data[0].e_date
        })
      },
      fail: (res) => {
        wx.showToast({
          title: 'Searched Failed',
        })
      }
    })
    // wx.request({
    //   // url: 'http://localhost:1919/seller/userOrders',
    //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/userOrders',
    //   method: "POST",
    //   data: {
    //     _id: option.id
    //   },
    //   success: (res) => {
    //     this.setData({
    //       b_openid: res.data[0]._openid,
    //       party_type: res.data[0].party_type,
    //       budget: res.data[0].budget,
    //       orderTime: res.data[0].orderTime,
    //       status: res.data[0].status,
    //       diy_on: res.data[0].diy_on,
    //       person: res.data[0].person,
    //       listId: option.id,
    //       address: res.data[0].location.rough,
    //       name: res.data[0].userInfo.nickName,
    //       date: res.data[0].e_date
    //     })
    //   },
    //   fail: (res) => {
    //     wx.showToast({
    //       title: 'Searched Failed',
    //     })
    //   }
    // })

    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/response/getResponse",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        responseId: option.id,
        _openid: wx.getStorageSync('_openid')
      },
      success: (res) => {
        if (res.data.length > 0) {
          this.setData({
            amount: res.data[0].amount,
            times: 1,
            _id: res.data[0]._id
          })
        } else {
          this.setData({
            times: 0
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          icon: 'error',
          title: 'Searched Failed',
        })
      }
    })
    // wx.request({
    //   // url: 'http://localhost:1919/response/getResponse',
    //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/response/getResponse',
    //   method: "POST",
    //   data: {
    //     responseId: option.id,
    //     _openid: wx.getStorageSync('_openid')
    //   },
    //   success: (res) => {
    //     if (res.data.length > 0) {
    //       this.setData({
    //         amount: res.data[0].amount,
    //         times: 1,
    //         _id: res.data[0]._id
    //       })
    //     } else {
    //       this.setData({
    //         times: 0
    //       })
    //     }
    //   },
    //   fail: (res) => {
    //     wx.showToast({
    //       icon: 'error',
    //       title: 'Searched Failed',
    //     })
    //   }
    // })
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
        this.setData({
          response: res.data[0].response,
          checkID: res.data[0].checkID,
          company: res.data[0].company
        })
        if (res.data[0].img.length !== 0) {
          this.setData({
            check: 1,
          })
        } else {
          this.setData({
            check: 0,
          })
        }
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
    //     this.setData({
    //       response: res.data[0].response,
    //       checkID: res.data[0].checkID,
    //       company: res.data[0].company
    //     })
    //     if (res.data[0].img.length !== 0) {
    //       this.setData({
    //         check: 1,
    //       })
    //     } else {
    //       this.setData({
    //         check: 0,
    //       })
    //     }
    //   },
    //   fail: (res) => {
    //     wx.showToast({
    //       icon: 'error',
    //       title: 'Searched Failed',
    //     })
    //   }
    // })
  },

  async jump(e) {
    if (this.data.checkID == '未完成') {
      wx.showToast({
        icon: 'error',
        title: '请先完成店铺认证',
      })
    }
    var that = this
    if (this.data.check == 1 && this.data.checkID == '已认证') { //未完成
      wx.showLoading({
        icon: 'loading',
        title: '报价中'
      })

      if (this.data.times == 0) {
        wx.cloud.callContainer({
          "config": {
            "env": "dream-party-7gp4oasy1647b3f1"
          },
          "path": "/response/sResponse",
          "header": {
            "X-WX-SERVICE": "party"
          },
          "method": "POST",
          "data": {
            _id: wx.getStorageSync('companyId'),
            response: this.data.response + 1
          },
          success: (res) => {
            console.log(res.data)
            wx.cloud.callContainer({
              "config": {
                "env": "dream-party-7gp4oasy1647b3f1"
              },
              "path": "/response/response",
              "header": {
                "X-WX-SERVICE": "party"
              },
              "method": "POST",
              "data": {
                _openid: wx.getStorageSync('_openid'),
                company: res.data.company,
                amount: this.data.amount,
                logo: res.data.logo,
                img: res.data.img,
                phone: res.data.phone,
                responseId: this.data.listId,
                party_type: this.data.party_type,
                budget: this.data.budget,
                orderTime: this.data.orderTime,
                status: this.data.status,
                diy_on: this.data.diy_on,
                person: this.data.person,
                order_status: '已报价',
                address: this.data.address,
                name: this.data.name,
              },
              success: (res) => {
                console.log(res)
                wx.hideLoading()
                that.send(that.data.b_openid, that.data.party_type, that.data.budget);
                wx.showToast({
                  title: 'Responsed Success',
                })
              },
              fail: (res) => {
                wx.showToast({
                  icon: 'error',
                  title: 'Published Failed',
                })
              }
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
        //   // url: 'http://localhost:1919/response/sResponse',
        //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/response/sResponse',
        //   method: 'POST',
        //   data: {
        //     // _openid:wx.getStorageSync('_openid'),
        //     _id: wx.getStorageSync('companyId'),
        //     response: this.data.response + 1
        //   },
        //   success: (res) => {
        //     console.log(res.data)
        //     wx.request({
        //       // url: 'http://localhost:1919/response/response',
        //       url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/response/response',
        //       method: 'POST',
        //       data: {
        //         _openid: wx.getStorageSync('_openid'),
        //         company: res.data.company,
        //         amount: this.data.amount,
        //         logo: res.data.logo,
        //         img: res.data.img,
        //         phone: res.data.phone,
        //         responseId: this.data.listId,
        //         party_type: this.data.party_type,
        //         budget: this.data.budget,
        //         orderTime: this.data.orderTime,
        //         status: this.data.status,
        //         diy_on: this.data.diy_on,
        //         person: this.data.person,
        //         order_status: '已报价',
        //         address: this.data.address,
        //         name: this.data.name,
        //       },
        //       success: (res) => {
        //         console.log(res)
        //         wx.hideLoading()
        //         that.send(that.data.b_openid, that.data.party_type, that.data.budget);
        //         wx.showToast({
        //           title: 'Responsed Success',
        //         })
        //       },
        //       fail: (res) => {
        //         wx.showToast({
        //           icon: 'error',
        //           title: 'Published Failed',
        //         })
        //       }
        //     })
        //   },
        //   fail: (res) => {
        //     wx.showToast({
        //       icon: 'error',
        //       title: 'Published Failed',
        //     })
        //   }
        // })

      } else {
        wx.cloud.callContainer({
          "config": {
            "env": "dream-party-7gp4oasy1647b3f1"
          },
          "path": "/response/update",
          "header": {
            "X-WX-SERVICE": "party"
          },
          "method": "POST",
          "data": {
            _id: this.data._id,
            amount: this.data.amount,
          },
          success: (res) => {
            console.log(res)
            wx.hideLoading()
            that.send(that.data.b_openid, that.data.party_type, that.data.budget);
            wx.showToast({
              title: 'Responsed Success',
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
        //   // url: 'http://localhost:1919/response/update',
        //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/response/update',
        //   method: 'POST',
        //   data: {
        //     _id: this.data._id,
        //     amount: this.data.amount,
        //   },
        //   success: (res) => {
        //     console.log(res)
        //     wx.hideLoading()
        //     that.send(that.data.b_openid, that.data.party_type, that.data.budget);
        //     wx.showToast({
        //       title: 'Responsed Success',
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

      setTimeout(() => {
        wx.hideLoading()
        let url = "../Sorder/index"
        wx.navigateTo({
          url
        })
      }, 2000);
    }
  },
  back() {
    wx.navigateBack({
      delta: 1,
    })
  }
});

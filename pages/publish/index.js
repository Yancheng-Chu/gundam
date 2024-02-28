let app = getApp()
let api = app.globalData.api
let fileserver = app.globalData.fileserver
import Toast from '@vant/weapp/toast/toast';
var QQMapWX = require("../../resource/lib/qqmap-wx-jssdk.min.js");
var qqmapsdk = new QQMapWX({
  key: app.globalData.mapkey
})
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
var currentDate = date.getDate();
var currentMonth = date.getMonth() + 1;

const db = wx.cloud.database()
const userCollection = db.collection('PartyList')
const sellerCollection = db.collection('Company')
const _ = db.command;
const computedBehavior = require('miniprogram-computed');
const chooseLocation = requirePlugin('chooseLocation');
const ImgLoader = require('../../Component/img-loader/img-loader.js')

function genImgListData() {
  let images = [
    'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/resource/images/home/party-on',
    'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/resource/images/home/business-on',
    'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/resource/images/home/wedding-on',
    'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/resource/images/home/party',
    'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/resource/images/home/business',
    'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/resource/images/home/wedding',
  ]
  images = images.concat(images.slice(0, 4))
  return images.map(item => {
    return {
      url: item,
      loaded: false
    }
  })
}
const allMarkers = [{
  id: 0,
  iconPath: '/resource/images/map/mylocation.png',
  width: 36 * .5,
  height: 55 * .5 | 0,
}]
Page({
  behaviors: [computedBehavior],
  watch: {
    'party': function (newVal) {
      for (let field in this.data.party) {
        console.log('Watch: Complete', this.data.party[field])
      }
    },
    'holdtime'() {
      this.setData({
        timec: true
      })
    },

    'low': function (newVal) {
      if (this.data.middle - this.data.low >= 0) {
        this.setData({
          space: Math.trunc(this.data.low),
          meal: Math.trunc(this.data.middle - this.data.low),
          entertainment: Math.trunc(this.data.budget - this.data.middle),
        })
      }
    },
    'middle': function (newVal) {
      this.setData({
        space: Math.trunc(this.data.low),
        meal: Math.trunc(this.data.middle - this.data.low),
        entertainment: Math.trunc(this.data.budget - this.data.middle),
      })
    },
    'time,date,person,budget': function (e) {
      this.setData({
        // isDisabled: !(this.data.budgets & this.data.persons & this.data.party_types & this.data.timec),
        opacity: !(this.data.budgets & this.data.persons & this.data.timec) == true ? 0.4 : 0.9
      });
    },
    'published'() {
      if (this.data.published === true) {
        this.setData({
          opacity: 0.4,
          isDisabled: true
        })
      }
    }
  },
  computed: {},
  data: {
    imgList: genImgListData(),
    upSelfSliderDefault: 10,
    downSelfSliderDefault: 10,
    selfSliderColorDown: '#e9e9e9', //第二个选中区域颜色
    test: '',
    today: '',
    thisMonth: '',
    holdtime: "请选择时间",
    arrays: [
      [],
      [],
      []
    ],
    multiIndex: [0, 0, 0],
    area: '5KM',
    areas: ['1KM', '5KM', '50KM'],
    isDisabled: true,
    opacity: .4,
    times: [
      '17:00', '18:00', '19:00', '20:00', '21:00',
    ],
    color: '',
    low: '',
    middle: '',
    high: '',
    space: '',
    meal: '',
    entertainment: '',
    space2: '',
    meal2: '',
    entertainment2: '',

    dates: false,
    timec: false,
    persons: false,
    budgets: false,
    diy_objs: false,
    party_type: '生日派对',
    diy_on: '',
    published: false,
    user: '',
    num: 0,
    id: '',
    hasUserInfo: false, //merge
    listId: '',
    orderTime: '',
    img: 'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/resource/images/home/party-on.png',
    address: ''
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
  },
  loadImages() {
    //同时发起全部图片的加载
    this.data.imgList.forEach(item => {
      this.imgLoader.load(item.url)
    })
  },
  imageOnLoad(err, data) {
    console.log('图片加载完成', err, data.src)

    const imgList = this.data.imgList.map(item => {
      if (item.url == data.src)
        item.loaded = true
      return item
    })
    this.setData({
      imgList
    })
  },
  onLoad() {
    console.log('Location', wx.getStorageSync('location').rough)
    this.imgLoader = new ImgLoader(this, this.imageOnLoad.bind(this))
    this.loadImages();
  

    var t = this
    t.setData({
      hasUserInfo: true,
      address: wx.getStorageSync('location').rough
    })
    api.getId().then(res => {
      this.getMyneed()
    })

    var t = this;
    api.getDiys().then(res => {
      t.setData({
        diys: res
      })
    })
    api.getDiysprice().then(res => {
      t.setData({
        diyss: res
      })
    })

  },
  // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
  onShow() {
    console.log("Open ID: ", wx.getStorageSync('_openid'))
    console.log("UserInfo: ", wx.getStorageSync('userInfo'))
  },
  handleInput(e) {
    let value;
    if (/^([1-9])+(\.\d{0,2})?$/.test(e.detail.value)) {
      value = e.detail.value;
    } else {
      value = e.detail.value.substring(0, e.detail.value.length - 1);
    }
    this.setData({
      value
    })
  },
  getMyneed() {

  },
  getOffers() {
   
  },
  chooseArea(event) {
    this.setData({
      showArea: true
    })
    console.log(this.data.showArea)
  },
  selectParty(event) {
    this.setData({
      party_type: event.currentTarget.dataset.party_type,
    })
    if (event.currentTarget.dataset.party_type === '生日派对') {
      this.setData({
        img: 'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/resource/images/home/party-on.png'
      })
    } else if (event.currentTarget.dataset.party_type === '商务派对') {
      this.setData({
        img: 'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/resource/images/home/business-on.png'
      })
    } else {
      this.setData({
        img: 'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/resource/images/home/wedding-on.png'
      })
    }

  },
  goBack() {
    let url = "/pages/index/index"
    console.log(url)
    wx.switchTab({
      url
    })
  },
  onClickBG(event) {
    this.setData({
      showBG: true
    });
  },
  onClickPS(event) {
    this.setData({
      showPS: true
    });
  },
  onClickDT(event) {
    this.setData({
      showDT: true
    });
  },
  onClickDY(event) {
    this.setData({
      showDY: true
    });
  },

  onCloseArea() {
    this.setData({
      showArea: false
    });
  },
  onCloseBG() {
    this.setData({
      showBG: false
    });
  },
  onClosePS() {
    this.setData({
      showPS: false
    });
  },
  onCloseDT() {
    this.setData({
      showDT: false
    });
  },
  onCloseDT2() {
    this.setData({
      showDT2: false
    });
  },
  onCloseDY() {
    this.setData({
      showDY: false
    });
  },
  onCloseCF() {
    this.setData({
      showCF: false
    });
  },

  onChangeArea(e) {
    const {
      picker,
      value,
      index
    } = e.detail;
    this.setData({
      area: value,
      showArea: false
    });
  },
  changeBudget(e) {
    let value;
    if (/^[1-9]{1}[0-9]*$/.test(e.detail.value)) {
      this.data.budgets = true;
      value = e.detail.value;
      console.log("check for budget");
    } else {
      this.data.budgets = false;
      value = e.detail.value.substring(0, e.detail.value.length - 1);
      console.log("Should not be 0")
    }
    let o = value * 0.3
    let r = Math.round(o)
    let n = Math.trunc(o)
    let a = o.toFixed(1)
    let b = 0
    let c = 0
    if (a - n < 0.5) {
      b = n,
        c = value - 2 * b
    } else if (a - n == 0.5) {
      b = o - 0.5,
        c = value - 2 * b
    } else if (a - n > 0.5 && (value - 2 * r) === 0) {
      b = n,
        c = value - 2 * b
    } else {
      b = r,
        c = value - 2 * b
    }

    this.setData({
      budget: value,
      low: b,
      middle: b * 2,
      high: c,
      space: b,
      meal: b,
      entertainment: c
    });

  },
  changePerson(e) {
    let value;
    if (/^[1-9]{1}[0-9]*$/.test(e.detail.value)) {
      this.data.persons = true;
      value = e.detail.value;
      console.log("check for person");
    } else {
      this.data.persons = false;
      value = e.detail.value.substring(0, e.detail.value.length - 1);
      console.log("Should not be 0")
    }
    this.setData({
      person: value,
    });
  },

  formatDate(date) {
    date = new Date(date);
    let day = date.getDay();
    let week = ('日一二三四五六'.split(''))[day]
    this.setData({
      today: date.getDate(),
      thisMonth: date.getMonth() + 1
    })
    return `${date.getMonth() + 1}月${date.getDate()}日,星期${week}`;
  },
  formatDate2(date) {
    date = new Date(date);
    this.setData({
      today: date.getDate(),
      thisMonth: date.getMonth() + 1
    })
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  },
  onConfirmDate(event) {
    let date = event.detail
    console.log(this.formatDate(date))
    console.log(this.formatDate2(date))
    if (date != null) {
      this.data.dates = true;
      console.log("check for date");
    } else {
      this.data.dates = false;
      console.log("date null");
    }
    this.setData({
      date: this.formatDate(date),
      sdate: this.formatDate2(date),
      showDT: false,
      showDT2: true
    });
  },
  onSelectDT(event) {
    this.data.timec = true;
    this.setData({
      time: event.target.dataset.time,
    });
  },
  get() {
    wx.requestSubscribeMessage({
      tmplIds: ['WxRHbhG35xdCevHLmgbGaVZfW8EGOAHO2p7X3gpsm0s'],
      success(res) {
        console.log('success', res)
      },
      fail(res) {
        console.log('fail', res)
      }
    })
  },
  send(openid, status, party_type, budget, time) {
    console.log("123123123123", this.data.address)
    wx.cloud.callFunction({
      name: 'sendSeller',
      data: {
        openid: openid,
        status: status,
        party_type: party_type,
        budget: budget,
        address: this.data.address,
        // time:'2022年8月9日 2:25'
        time: time,
      }
    }).then(res => {
      console.log('success2', res)
    }).catch(res => {
      console.log('fail2', res)
    })
  },

  sql() {
    this.get();
    var curent = new Date();
    const {
      party_type,
      date,
      person,
      budget,
      diy_on,
      space,
      meal,
      entertainment,
      img
    } = this.data;
    var that = this
    if (!this.data.party_type) {
      Toast('请选择派对类型');
    } else if (!this.data.budget) {
      Toast('请输入预估费用');
    } else if (!this.data.person) {
      Toast('请输入到场人数');
    } else if (!this.data.time) {
      Toast('请选择举办时间');
    } else {
      wx.showLoading({
        icon: 'loading',
        title: '发布中'
      })
      wx.cloud.callContainer({
        "config": {
          "env": "dream-party-7gp4oasy1647b3f1"
        },
        "path": "/customer/publish",
        "header": {
          "X-WX-SERVICE": "party"
        },
        "method": "POST",
        "data": {
          _openid: wx.getStorageSync('_openid'),
          userInfo: wx.getStorageSync('userInfo'),
          location: wx.getStorageSync('location'),
          orderTime: curent.getFullYear() + "年" + (curent.getMonth() + 1) + "月" + curent.getDate() + "日 " + curent.getHours() + ":" + curent.getMinutes(),
          party_type,
          date,
          person,
          budget,
          diy_on,
          space,
          meal,
          entertainment,
          e_date: this.data.selectTime,
          img
        },
        success: (res) => {
          wx.setStorageSync('id', res)
          setTimeout(() => {
            wx.hideLoading()
            wx.showToast({
              title: '发布成功',
            })
            let url = "/pages/offer/index"
            wx.navigateTo({
              url
            })
            wx.cloud.callContainer({
              "config": {
                "env": "dream-party-7gp4oasy1647b3f1"
              },
              "path": "/response/report",
              "header": {
                "X-WX-SERVICE": "party"
              },
              "method": "POST",
              "data": {
                "action": "inc"
              },
              success: (r) => {
                console.log(r.data)
                for (let i in r.data) {
                  that.send(r.data[i]._openid, '待报价', that.data.party_type, that.data.budget, that.data.selectTime);
                }
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
            that.jumpToPlan();
          }, 2000);
        },
        fail: (res) => {
          wx.showToast({
            icon: 'error',
            title: 'Published Failed',
          })
        }
      })
      // wx.request({
      //   // url: 'http://localhost:1919/customer/publish',
      //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/customer/publish',
      //   method: 'POST',
      //   data: {
      //     _openid: wx.getStorageSync('_openid'),
      //     userInfo: wx.getStorageSync('userInfo'),
      //     location: wx.getStorageSync('location'),
      //     orderTime: curent.getFullYear() + "年" + (curent.getMonth() + 1) + "月" + curent.getDate() + "日 " + curent.getHours() + ":" + curent.getMinutes(),
      //     party_type,
      //     date,
      //     person,
      //     budget,
      //     diy_on,
      //     space,
      //     meal,
      //     entertainment,
      //     e_date: this.data.selectTime,
      //     img
      //   },
      //   success: (res) => {
      //     wx.setStorageSync('id', res)
      //     setTimeout(() => {
      //       wx.hideLoading()
      //       wx.showToast({
      //         title: '发布成功',
      //       })
      //       let url = "/pages/offer/index"
      //       wx.navigateTo({
      //         url
      //       })
      //       wx.request({
      //         // url: 'http://localhost:1919/response/report',
      //         url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/response/report',
      //         method:"POST",
      //         success: (r) => {
      //           console.log(r.data)
      //           for (let i in r.data) {
      //             that.send(r.data[i]._openid, '待报价', that.data.party_type, that.data.budget, that.data.selectTime);
      //           }
      //           wx.showToast({
      //             title: 'Responsed Success',
      //           })
      //         },
      //         fail: (res) => {
      //           wx.showToast({
      //             icon: 'error',
      //             title: 'Published Failed',
      //           })
      //         }
      //       })
      //       that.jumpToPlan();
      //     }, 2000);
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
  publishParty() {
  
  },

  onSelectDY(e) {
    let diy_obj = this.data.diy_obj || {}
    let diy = e.target.dataset.diy
    if (diy_obj[diy]) {
      delete diy_obj[diy]
    } else {
      diy_obj[diy] = 1
    }

    let diy_on = Object.keys(diy_obj).join(', ')
    this.setData({
      diy_on,
      diy_obj
    })
  },
  back() {
    this.setData({
      showDT: true,
      showDT2: false
    })
  },
  jumpToPlan(e) {
    let url = "/pages/offer/index"
    wx.navigateTo({
      url
    })
  },
  jumpToLog(e) {
    let url = "/pages/mine/index"
    wx.switchTab({
      url
    })
  },
  picker() {
    date = new Date();
    var hours = [];
    var minute = [];
    currentHours = date.getHours();
    currentMinute = date.getMinutes();
    var data = {
      arrays: this.data.arrays,
    };
    if (currentMonth === currentMonth && currentDate === this.data.today) {
      this.checkData(hours, minute);
    } else {
      this.defalutTime(hours, minute)
    }
    data.arrays[0] = [this.data.date];
    data.arrays[1] = hours;
    data.arrays[2] = minute;
    this.setData(data);
  },
  defalutTime(hours, minute) {
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    minute.push("00")
    for (var i = 10; i < 60; i += 10) {
      minute.push(i);
    }
  },
  checkData(hours, minute) {
    var index;
    if (currentMinute > 0 && currentMinute <= 10) {
      index = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      index = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      index = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      index = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      index = 50;
    } else {
      index = 60;
    }
    if (index === 60) {
      if (currentHours + 1 === 24) {
        wx.showModal({
          title: 'Please Choose another day',
          success(res) {
            if (res.confirm) {
              this.back()
            } else {

            }
          }
        })
      } else {
        for (var i = currentHours + 1; i < 24; i++) {
          hours.push(i);
        }
        minute.push("00")
        for (var i = 10; i < 60; i += 10) {
          minute.push(i);
        }
      }
    } else {
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
      for (var i = index; i < 60; i += 10) {
        minute.push(i);
      }
    }
  },

  checkColumn(e) {
    date = new Date();
    var hours = [];
    var minute = [];
    currentHours = date.getHours();
    currentMinute = date.getMinutes();
    var data = {
      arrays: this.data.arrays,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    if (currentMonth === currentMonth && currentDate === this.data.today) {
      if (e.detail.value === 0) {
        this.checkData(hours, minute);
      } else {
        for (var i = currentHours; i < 24; i++) {
          hours.push(i);
        }
        minute.push("00")
        for (var i = 10; i < 60; i += 10) {
          minute.push(i);
        }
      }
    } else {
      this.defalutTime(hours, minute)
    }
    data.arrays[1] = hours;
    data.arrays[2] = minute;
    this.setData(data);
  },

  pickerChange(e) {
    var hours = this.data.arrays[1][e.detail.value[1]];
    var minute = this.data.arrays[2][e.detail.value[2]];
    this.setData({
      time: hours + ":" + minute,
      holdtime: this.data.date + " " + hours + ":" + minute,
      selectTime: this.data.sdate + " " + hours + ":" + minute
    })
    console.log(this.data.selectTime)
  },
  lowValueChangeAction: function (e) {
    this.setData({
      low: Math.round(e.detail.lowValue * this.data.budget * 0.01)
    })
  },
  heighValueChangeAction: function (e) {
    this.setData({
      middle: Math.round(e.detail.heighValue * this.data.budget * 0.01)
    })
  },
});

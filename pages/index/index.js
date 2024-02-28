let app = getApp()
const computedBehavior = require('miniprogram-computed');
Page({
  behaviors: [computedBehavior],
  watch: {

  },
  data: {
    option1: [
      { text: '高达曾给了我尊重', value: 0 },
      { text: '尊重2.0', value: 1 },
      { text: '尊重3.0', value: 2 },
    ],
    value1: 0,
    option2: [
      { text: '水星的魔女', value: 0 },
      { text: '风铃是我可爱的女儿', value: 1 },
      { text: '因为风铃是我的家人', value: 2 },
    ],
    value2: 0,
    x: 0,
    popupshow: false,
    src: "",
    src2: "",
    src3: "",
    src4: "",
    s:0,
  },
  close(e){
    this.setData({
      popupshow: false
    })
  },
  popup(e) {
    let y = 0
    let ss = 0
    if (e.currentTarget.dataset.s == "2") {
      y = 140
      ss = 2
    }else if(e.currentTarget.dataset.s == "3") {
      y = 0
      ss = 3
    }else if(e.currentTarget.dataset.s == "4") {
      y = 140
      ss = 4
    }
    this.setData({
      s: ss,
      x: y,
      popupshow: !this.data.popupshow
    })
  },
  select(e) {
  let url = '/resource/11.png'
  if(e.currentTarget.dataset.ss == 2){
    setTimeout(() => {
      this.setData({
        src2: url,
        popupshow: !this.data.popupshow
      })
    }, 100);
  }else if(e.currentTarget.dataset.ss == 3){
    setTimeout(() => {
      this.setData({
        src3: '/resource/11.png',
        popupshow: !this.data.popupshow
      })
    }, 100);
  }else if(e.currentTarget.dataset.ss == 4){
    setTimeout(() => {
      this.setData({
        src4: '/resource/11.png',
        popupshow: !this.data.popupshow
      })
    }, 100);
  }else{
    setTimeout(() => {
      this.setData({
        src: '/resource/11.png',
        popupshow: !this.data.popupshow
      })
    }, 100);
  }
  },
  onLoad: async function () {

  },
  async onShow() {

  },
  getSeller() {
    wx.requestSubscribeMessage({
      tmplIds: ['xbYExegGKYxM0B0DayNLaLLcQ1n9PKKHhxI0vJm3xFQ'],
      success(res) {
        console.log('success', res)
      },
      fail(res) {
        console.log('fail', res)
      }
    })
  },


});

let app = getApp()

Page({
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

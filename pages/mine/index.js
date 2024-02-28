let app = getApp()

Page({
  data: {
    log: true,
    birth: '',
    color: 'background-image:-webkit-linear-gradient(left,#FFBC7B,#FF8F1F,yellow); -webkit-background-clip:text; -webkit-text-fill-color:transparent;',
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
  birthday(e) {
    this.setData({
      birth: e.detail.value
    })
  },
  jump(e) {
    // console.log(e.currentTarget.dataset.birth)
    let url
    if (e.currentTarget.dataset.birth == "114514") {
      this.setData({
        log: false
      })
    }
    // if (e.currentTarget.dataset.birth == "114514") {
    //   url = "/pages/Adminn/check/index?birth=" + e.currentTarget.dataset.birth
    // }

    // wx.navigateTo({
    //   url
    // })
  },

});

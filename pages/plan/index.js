let app = getApp()
let api = app.globalData.api
const fileserver = app.globalData.fileserver

Page({
  data: {},
  onLoad() {
    var t = this
    let diy_obj = {}
    app.globalData.offer.diy_on.split(',').map(item => {
      item = item.trim()
      diy_obj[item] = 1
    })

    api.getPlans().then(res => {
      var plans = {}

      if (Array.isArray(res.data)) {
        res.data.map(item => {
          if (!plans[item.type]) {
            plans[item.type] = []
          }

          if (diy_obj[item.title]) {
            plans[item.type].push({
              logo: fileserver + 'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/resource/images/plan/' + item.img,
              price: item.price,
              title: item.title,
              detail: item.desc,
              duration: item.duration //'12:00 - 12:20'
            })
          }
        })

        for(let type in plans){
          if(!plans[type].length){
            delete plans[type]
          }
        }
      }

      console.log(plans, app.globalData.offer)
      t.setData({
        plans,
        offer: app.globalData.offer
      })
    })
  },
  jumpBack() {
    wx.navigateBack({
      delta: 0,
    })
  },
  payment() {
    let offer = this.data.offer
    let offer_id = offer.id
    let openid = app.globalData.openid
    let amount = 1 //offer.price
    let description = offer.title
    let out_trade_no = '' + Date.now()
    console.log('payment', openid, amount, description, out_trade_no, offer_id)
    api.getPayment(openid, amount, description, out_trade_no, offer_id).then(res => {
      let options = res.data
      wx.requestPayment({
        package: options._package,
        ...options,
        success: function (res) {
          console.log('requestPayment success', res)
          let url = "/pages/order/index"
          console.log(url)
          wx.navigateTo({
            url
          })
        },
        fail: function (res) {
          console.log('requestPayment fail', res)
        }
      })
    })
  }
});

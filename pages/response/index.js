let app = getApp()
let api = app.globalData.api
let fileserver = app.globalData.fileserver
Page({
  data: {
    tab: "全部"
  },
  onLoad: function () {
    api.getId().then(res => {
      app.globalData.openid = res.data['x-wx-openid'] || 'oNfXF5N5fJpccnHaS3YSUktFRO3U'
      app.globalData.unionid = res.data['x-wx-unionid'] || 'oS7kY6zzer2GwrOgUoPIjXu9zAXA'
    })
  },
  onShow: function () {
    this.getNeed()
  },
  getNeed(){
    let t = this
    if(!app.globalData.unionid){
      setTimeout(function(){
        t.getNeed()
      },1000)
      return
    }
    api.getNeeds(app.globalData.unionid).then(res => {
      let needs = []
      if (Array.isArray(res.data)) {
        res.data.map(need => {
          needs.push({
            id: need.id,
            unionid: need.unionid,
            party_type: need.party_type,
            budget: need.budget,
            person: need.person,
            diy_on: need.diy_on,
            date: need.date,
            time: need.time,
            name: need.name,
            offer_id: need.offer_id,
            title: need.title,
            price: need.price,
            duration:need.duration,
            location: need.location,
            diy_on_offer: need.diy_on_offer,
            transaction_id: need.transaction_id,
            success_time: need.success_time ? need.success_time.slice(0, 10) +' '+need.success_time.slice(11, 19) : '',

            status: 
              need.status ==1 ? '已完成' :
              need.status ==2 ? '要退款' :
              need.status ==3 ? '已取消' :
              need.transaction_id ? '待服务' : 
              need.price ? '待支付' : '待报价',
          
            // logo: fileserver + '/resource/images/mine/order1.png',
            logo: fileserver + 'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/resource/images/mine/order.png',
          })
        })
      }

      t.setData({
        needs
      })
      app.globalData.needs = needs
    })
  },
  tab: function (e) {
    this.setData({
      tab: e.target.dataset.name
    })
  },
  jumpToDetail(e) {
    let needkey = e.currentTarget.dataset.needkey
    let url = "/pages/offer/index"
    app.globalData.needkey = needkey
    console.log('orderkey', app.globalData.needkey)
    wx.navigateTo({
      url
    })
  },
});


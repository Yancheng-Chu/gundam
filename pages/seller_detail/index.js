let app = getApp()
const db = wx.cloud.database()
const userCollection = db.collection('SellerList')
const _ = db.command;
Page({
  data: {
    showQRCode: false,
    listId:'',
  },
  onLoad(option){
    console.log("ID",option.id)
    this.setData({
      listId: option.id
    })
    userCollection.where({
      _id: this.data.listId
    }).get().then(res => {
      this.setData({
        title: res.data[0].title,
        am:res.data[0].time.am,
        pm:res.data[0].time.pm,
        evaluate: res.data[0].evaluate,
        star:parseFloat(res.data[0].evaluate),
        person: res.data[0].people,
        place: res.data[0].locations.location,
      })
    }).catch(err => {
      console.log('Search Failed', err)
    })
  },
  goBack() {
    wx.navigateBack({
      delta: 1,
    })
  },
  toPlanDetail() {
    wx.navigateTo({
      url: "/pages/planDetail/index"
    })
  },
  handlePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: '138-1767-4031',
    })
  },
  showQRCodePopup() {
    this.setData({
      showQRCode: true
    });
  },

  onCloseQRCode() {
    this.setData({
      showQRCode: false
    });
  },
});

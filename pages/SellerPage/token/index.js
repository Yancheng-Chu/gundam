Page({
  data: {
  },

  jump(e) {
    let url = "/pages/SellerPage/changePass/index"
    wx.navigateTo({
      url
    })
  },
  back(){
    wx.navigateBack({
      delta: 1,
  })
  }
});
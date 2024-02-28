Page({
  data: {
  },

  jump(e) {
    let url = "/pages/SellerPage/complete/index?check=1"
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
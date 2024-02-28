Page({
  data: {
    text:''
  },
  onLoad(option){
    console.log(option.check)
    if(option.check=='0'){
      this.setData({
        text:'注册完成'
      })
    }else if(option.check =='1'){
      this.setData({
        text:'修改完成'
      })
    }
  },
  jump(e) {
    let url = "/pages/SellerPage/Sclass/index"
    wx.navigateTo({
      url
    })
  },
  back(){
    wx.navigateBack({
      delta: 6,
  })
  }
});
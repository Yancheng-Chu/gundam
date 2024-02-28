Page({
  data: {
    statusBarHeight: wx.getStorageSync('statusBarHeight'),
    navigationBarHeight: wx.getStorageSync('navigationBarHeight'),
    menuButtonHeight: wx.getStorageSync('menuButtonHeight'),
    navigationBarAndStatusBarHeight: wx.getStorageSync('statusBarHeight') + wx.getStorageSync('navigationBarHeight')
  },
  back() {
    wx.navigateBack({
      delta: 1,
    })
  }
});

const app = getApp();
Component({
  /**
   * 组件的初始数据
   */
  data: {
    selected: -1,
    color: "#333333",
    list: [{
        pagePath: "/pages/index/index",
        text: "高贵的主办方",
        iconPath: "/resource/5.png",
        selectedIconPath: "/resource/5.png"
    }, {
        pagePath: "/pages/mine/index",
        text: "小队入口",
        iconPath: "/resource/6.png",
        selectedIconPath: "/resource/6.png"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      wx.switchTab({
        url: data.path,
      })
    },
    close(){
      app.globalData.popupshow = false
    }
  }
})

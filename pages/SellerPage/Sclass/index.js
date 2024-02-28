const db = wx.cloud.database()
const userCollection = db.collection('Company')
const _ = db.command;
Page({
  data: {
    categories: '',
    listId: '',
    list: [],
    check: [],
    src: ['/resource/images/classfi/area.png', '/resource/images/classfi/activity.png', '/resource/images/classfi/decoration.png', '/resource/images/classfi/meal.png', '/resource/images/classfi/show.png', '/resource/images/classfi/photo.png'],
  },
  async onLoad() {
    var that = this
    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/seller/seller",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        _openid: wx.getStorageSync('_openid')
      },
      success: (res) => {
        this.setData({
          list: res.data[0].list,
          check: res.data[0].check,
        })
        if (res.data[0].list != []) {
          this.data.list.filter(function (cate) {
            that.data.src.forEach((item, index, arr) => {
              if (item.indexOf(cate) !== -1) {
                let i = item.split("/")[item.split("/").length - 1]
                let ii = i.substr(0, i.length - 4)
                let iii = item.replace(ii, ii + '-on')
                arr[index] = iii
              }
              that.setData({
                src: arr,
              })
            })
          });
        }
      },
      fail: (res) => {
        console.log("Search Failed", res)
        wx.showToast({
          icon: 'error',
          title: '请重新加载',
        })
      }
    })
    // wx.request({
    //   // url: 'http://localhost:1919/seller/seller',
    //   url:'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/seller',
    //   method:'POST',
    //   data: {
    //     _openid: wx.getStorageSync('_openid')
    //   },
    //   success: (res) => {
    //       this.setData({
    //       list: res.data[0].list,
    //       check: res.data[0].check,
    //       })
    //       if(res.data[0].list != []){
    //         this.data.list.filter(function(cate) {
    //           that.data.src.forEach((item, index, arr) => {
    //             if(item.indexOf(cate) !== -1){
    //               let i = item.split("/")[item.split("/").length - 1]
    //               let ii = i.substr(0, i.length - 4)
    //               let iii = item.replace(ii,ii + '-on')
    //               arr[index] = iii
    //             }
    //             that.setData({
    //               src: arr,
    //             })
    //           })
    //         });
    //       }
    //   },
    //   fail: (res) => {
    //     console.log("Search Failed", res)
    //     wx.showToast({
    //       icon: 'error',
    //       title: '请重新加载',
    //     })
    //   }
    // })

    this.setData({
      listId: wx.getStorageSync('companyId').toString()
    })
  },
  jump(e) {
    const {
      list,
      check,
      listId
    } = this.data;

    wx.showLoading({
      icon: 'loading',
      title: '提交中'
    })
    wx.cloud.callContainer({
      "config": {
        "env": "dream-party-7gp4oasy1647b3f1"
      },
      "path": "/seller/sClass",
      "header": {
        "X-WX-SERVICE": "party"
      },
      "method": "POST",
      "data": {
        _id: listId,
        list:list,
        check:check
      },
      success: (res) => {
        // problem:parse response body as JSON failed
        setTimeout(() => {
          wx.hideLoading()
          let url = "/pages/SellerPage/Spage/index"
          wx.navigateTo({
            url
          })
        }, 300);
      },
      fail: (res) => {
        console.log(res)
        wx.showToast({
          icon: 'error',
          title: 'Published Failed',
        })
      }
    })

    // wx.request({
    //   // url: 'http://localhost:1919/seller/sClass',
    //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/sClass',
    //   method: 'POST',
    //   data: {
    //     _id: this.data.listId,
    //     list,
    //     check
    //   },
    //   success: (res) => {
    //     setTimeout(() => {
    //       wx.hideLoading()
    //       let url = "/pages/SellerPage/Spage/index"
    //       wx.navigateTo({
    //         url
    //       })
    //     }, 300);
    //   },
    //   fail: (res) => {
    //     wx.showToast({
    //       icon: 'error',
    //       title: 'Published Failed',
    //     })
    //   }
    // })
  },
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  category(e) {
    let c = e.currentTarget.dataset.category
    this.data.src.forEach((item, index, arr) => {
      if (item == c) {
        let i = item.split("/")[item.split("/").length - 1]
        let ii = i.substr(0, i.length - 4)
        if (ii.indexOf('-on') === -1) {
          let iii = item.replace(ii, ii + '-on')
          arr[index] = iii
          this.data.list.push(ii)
          let c
          if (ii == 'meal') {
            c = '餐品'
          } else if (ii == 'show') {
            c = '表演'
          } else if (ii == 'photo') {
            c = '拍摄'
          } else if (ii == 'activity') {
            c = '活动'
          } else if (ii == 'area') {
            c = '场地'
          } else if (ii == 'decoration') {
            c = '装饰'
          }
          this.data.check.push(c + "上传")
        } else {
          let iii = item.replace(ii, ii.substr(0, ii.length - 3))
          arr[index] = iii
          this.data.list = this.data.list.filter(function (item) {
            return item != ii.substr(0, ii.length - 3)
          });
          this.data.check.pop()
        }
        this.setData({
          src: arr,
          list: this.data.list,
          check: this.data.check
        })
      }
    })
  },
});

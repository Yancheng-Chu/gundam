let app = getApp()
const db = wx.cloud.database()
const userCollection = db.collection('Company')
const _ = db.command;
const computedBehavior = require('miniprogram-computed');
var QQMapWX = require("../../../resource/lib/qqmap-wx-jssdk.min.js");
var qqmapsdk = new QQMapWX({
  key: app.globalData.mapkey
})
let staticImg = []
let staticLogo = []
let staticBg = []
Page({
  behaviors: [computedBehavior],
  watch: {
    'name,img,startdate,enddate,startdate2,enddate2,address,bg,logo'(e) {
      if (this.data.name != "" && this.data.img != "" && this.data.startdate != "" && this.data.startdate2 != "" &&
        this.data.enddate != "" && this.data.enddate2 != "" && this.data.address != "" && this.data.bg != "" && this.data.logo != "") {
        this.setData({
          isDisabled: false,
          opacity: 0.9
        });
      }
    },
  },
  data: {
    listId: '',
    error: '',
    ID: '',
    license: '',
    person: '',
    time: '',
    duration: '',
    address: '',
    img: [],
    bg: [],
    logo: [],
    imgList: [],
    bgList: [],
    logoList: [],
    name: '店铺名称',
    startdate: '开始时间',
    enddate: '结束时间',
    startdate2: '开始时间',
    enddate2: '结束时间',
    isDisabled: true,
    opacity: .4,
    locations: {
      'lat': 0,
      'lng': 0,
      'location': ''
    },
    dBg:false,
    dLogo:false
  },
  async onLoad(option) {
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
        console.log(res)
        if (res.data[0].img.length !== 0) {
          for(let i =0;i<res.data[0].img.length;i++){
            staticImg.push(
              res.data[0].img[i].url
            )  
          }
          staticBg.push(res.data[0].bg[0].url),
          staticLogo.push(res.data[0].logo[0].url),

          this.setData({
            edit: true,
            name: res.data[0].company,
            listId: res.data[0]._id,
            startdate: res.data[0].startdate,
            enddate: res.data[0].enddate,
            startdate2: res.data[0].startdate2,
            enddate2: res.data[0].enddate2,
            person: res.data[0].person,
            address: res.data[0].locations.location,
            img: res.data[0].img,
            bg: res.data[0].bg,
            logo: res.data[0].logo
          })
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
    //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/seller',
    //   method: "POST",
    //   data: {
    //     _openid: wx.getStorageSync('_openid')
    //     // _openid: "oNfXF5KGYSWjVMmWCpMcqov95q8U"
    //   },
    //   success: (res) => {
    //     console.log(res)
    //     if (res.data[0].img.length !== 0) {
    //       for(let i =0;i<res.data[0].img.length;i++){
    //         staticImg.push(
    //           res.data[0].img[i].url
    //         )  
    //       }
    //       staticBg.push(res.data[0].bg[0].url),
    //       staticLogo.push(res.data[0].logo[0].url),

    //       this.setData({
    //         edit: true,
    //         name: res.data[0].company,
    //         listId: res.data[0]._id,
    //         startdate: res.data[0].startdate,
    //         enddate: res.data[0].enddate,
    //         startdate2: res.data[0].startdate2,
    //         enddate2: res.data[0].enddate2,
    //         person: res.data[0].person,
    //         address: res.data[0].locations.location,
    //         img: res.data[0].img,
    //         bg: res.data[0].bg,
    //         logo: res.data[0].logo
    //       })
    //     }
    //   },
    //   fail: (res) => {
    //     console.log("Search Failed", res)
    //     wx.showToast({
    //       icon: 'error',
    //       title: '请重新加载',
    //     })
    //   }
    // })
  },

  bindDateChange(e) {
    let that = this;
    that.setData({
      startdate: e.detail.value,
    })
  },
  bindDateChange2(e) {
    let that = this;
    that.setData({
      enddate: e.detail.value,
    })
  },
  bindDateChange3(e) {
    let that = this;
    that.setData({
      startdate2: e.detail.value,
    })
  },
  bindDateChange4(e) {
    let that = this;
    that.setData({
      enddate2: e.detail.value,
    })
  },
  changeP(e) {
    let value;
    if (/^[1-9]{1}[0-9]*$/.test(e.detail)) {
      this.data.persons = true;
      value = e.detail;
      console.log("check for person");
    } else {
      this.data.persons = false;
      value = e.detail.substring(0, e.detail.length - 1);
      console.log("Should not be 0")
    }
    this.setData({
      person: value,
    });
  },
  changeN(e) {
    this.setData({
      name: e.detail,
    });
    if (this.data.name == '') {
      this.setData({
        isDisabled: true,
        opacity: .4,
      })
    }
  },
  changeA(e) {
    this.setData({
      address: e.detail,
    });
    if (this.data.address == '') {
      this.setData({
        isDisabled: true,
        opacity: .4,
      })
    }
  },
  

  afterRead(e) {
    console.log(e);
    let {
      img
    } = this.data
    img = [...img, ...e.detail.file]
    this.setData({
      img
    })
  },

  deleteImg(e) {
    console.log(e);
    let {
      img
    } = this.data
    img.splice(e.detail.index, 1)
    this.setData({
      img
    })
    if (this.data.img == '') {
      this.setData({
        isDisabled: true,
        opacity: .4,
      })
    }
  },
  readLogo(e) {
    console.log(e);
    let {
      logo
    } = this.data
    logo = [...logo, ...e.detail.file]
    this.setData({
      logo
    })
  },

  deleteLogo(e) {
    console.log(e);
    let {
      logo
    } = this.data
    logo.splice(e.detail.index, 1)
    this.setData({
      logo,
      dLogo:true
    })
    if (this.data.logo == '') {
      this.setData({
        isDisabled: true,
        opacity: .4,
      })
    }
  },
  readBg(e) {
    console.log(e);
    let {
      bg
    } = this.data
    bg = [...bg, ...e.detail.file]
    this.setData({
      bg
    })
  },

  deleteBg(e) {
    console.log(e);
    let {
      bg
    } = this.data
    bg.splice(e.detail.index, 1)
    this.setData({
      bg,
      dBg:true
    })
    if (this.data.bg == '') {
      this.setData({
        isDisabled: true,
        opacity: .4,
      })
    }
  },
  async jump(e) {
    let {
      img,
      bg,
      logo,
    } = this.data
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.edit) {
      let b = []
      let im = []
      let lo = []
      let Img = []
      let Bg = []
      let Logo = []
      for (let i = 0; i < img.length; i++) {
        if (img[i].url.startsWith('cloud')) {
          im.push({
            url: img[i].url,
            type: "image",
            thumb: img[i].url,
          })
          Img.push(img[i].url)
        } else {
          let code = Math.random().toFixed(10).slice(-10)
          let res = await wx.cloud.uploadFile({
            cloudPath: `seller_store_imgs/imgs/${this.data.name}/${code}`,
            filePath: img[i].url,
          })
          im.push({
            url: res.fileID,
            type: "image",
            thumb: res.fileID,
          })
          Img.push(res.fileID)
        }
      }


      if(this.data.dBg){
        for (let i = 0; i < bg.length; i++) {
          let code = Math.random().toFixed(10).slice(-10)
          let res = await wx.cloud.uploadFile({
            cloudPath: `seller_store_imgs/bg/${this.data.name}/${code}`,
            filePath: bg[i].url,
          })
          b.push({
            url: res.fileID,
            type: "image",
            thumb: res.fileID,
          })
          Bg.push(res.fileID)
          let deleteBg = deleteBg
          await wx.cloud.deleteFile({
            fileList: deleteBg
          })
      }
      }else{
        b = bg
      }
    
      if(this.data.dLogo){
      for (let i = 0; i < logo.length; i++) {
        let code = Math.random().toFixed(10).slice(-10)
        let res = await wx.cloud.uploadFile({
          cloudPath: `seller_store_imgs/logo/${this.data.name}/${code}`,
          filePath: logo[i].url,
        })
        lo.push({
          url: res.fileID,
          type: "image",
          thumb: res.fileID,
        })
        Logo.push(res.fileID)
        let deleteLogo = staticLogo
        await wx.cloud.deleteFile({
          fileList: deleteLogo
        })
    }
  }else{
    lo = logo
  }
      let deleteImg = []
      staticImg.forEach(item => {
        if (!Img.includes(item)) {
          deleteImg.push(item)
        }
      })
      await wx.cloud.deleteFile({
        fileList: deleteImg
      })


      await qqmapsdk.geocoder({
        address: this.data.address,
        complete: res => {
          console.log(res)
          let l = {
            'lat': res.result.location.lat,
            'lng': res.result.location.lng,
            'location': this.data.address
          }
          this.setData({
            locations: l
          })
          wx.cloud.callContainer({
            "config": {
              "env": "dream-party-7gp4oasy1647b3f1"
            },
            "path": "/seller/sInfo",
            "header": {
              "X-WX-SERVICE": "party"
            },
            "method": "POST",
            "data": {
              _id: wx.getStorageSync('companyId'),
              // _id:'635a13deda85a5a23a16d8a7',
              company: this.data.name,
              locations: l,
              person: this.data.person,
              startdate: this.data.startdate,
              enddate: this.data.enddate,
              startdate2: this.data.startdate2,
              enddate2: this.data.enddate2,
              bg: b,
              img: im,
              logo: lo
            },
            success: (res) => {
              console.log(res)
              setTimeout(function () {
                wx.hideLoading()
                let url = "/pages/SellerPage/Spage/index"
                wx.navigateTo({
                  url
                })
              }, 2000)
            },
            fail: (res) => {
              wx.showToast({
                icon: 'error',
                title: 'Searched Failed',
              })
            }
          })
          // wx.request({
          //   // url: 'http://localhost:1919/seller/sInfo',
          //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/sInfo',
          //   method: 'POST',
          //   data: {
          //     _id: wx.getStorageSync('companyId'),
          //     // _id:'635a13deda85a5a23a16d8a7',
          //     company: this.data.name,
          //     locations: l,
          //     person: this.data.person,
          //     startdate: this.data.startdate,
          //     enddate: this.data.enddate,
          //     startdate2: this.data.startdate2,
          //     enddate2: this.data.enddate2,
          //     bg: b,
          //     img: im,
          //     logo: lo
          //   },
          //   success: (res) => {
          //     console.log(res)
          //     setTimeout(function () {
          //       wx.hideLoading()
          //       let url = "/pages/SellerPage/Spage/index"
          //       wx.navigateTo({
          //         url
          //       })
          //     }, 2000)
          //   },
          //   fail: (res) => {
          //     wx.showToast({
          //       icon: 'error',
          //       title: 'Searched Failed',
          //     })
          //   }
          // })
        }
      })
    } else {
      for (let i = 0; i < this.data.img.length; i++) {
        let code = Math.random().toFixed(10).slice(-10)
        let res = await wx.cloud.uploadFile({
          cloudPath: `seller_store_imgs/imgs/${this.data.name}/${code}`,
          filePath: this.data.img[i].url,
        })
        this.data.imgList.push({
          url: res.fileID,
          type: "image",
          thumb: res.fileID,
        })
      }
      for (let i = 0; i < this.data.bg.length; i++) {
        let code = Math.random().toFixed(10).slice(-10)
        let res = await wx.cloud.uploadFile({
          cloudPath: `seller_store_imgs/bg/${this.data.name}/${code}`,
          filePath: this.data.bg[i].url,
        })

        this.data.bgList.push({
          url: res.fileID,
          type: "image",
          thumb: res.fileID,
        })
      }
      for (let i = 0; i < this.data.logo.length; i++) {
        let code = Math.random().toFixed(10).slice(-10)
        let res = await wx.cloud.uploadFile({
          cloudPath: `seller_store_imgs/logo/${this.data.name}/${code}`,
          filePath: this.data.logo[i].url,
        })

        this.data.logoList.push({
          url: res.fileID,
          type: "image",
          thumb: res.fileID,
        })
      }
      await qqmapsdk.geocoder({

        address: this.data.address,
        complete: res => {
          console.log(res)
          let l = {
            'lat': res.result.location.lat,
            'lng': res.result.location.lng,
            'location': this.data.address
          }
          this.setData({
            locations: l
          })
          wx.cloud.callContainer({
            "config": {
              "env": "dream-party-7gp4oasy1647b3f1"
            },
            "path": "/seller/sInfo",
            "header": {
              "X-WX-SERVICE": "party"
            },
            "method": "POST",
            "data": {
              _id: wx.getStorageSync('companyId'),
              // _id:'635a13deda85a5a23a16d8a7',
              company: this.data.name,
              locations: l,
              person: this.data.person,
              startdate: this.data.startdate,
              enddate: this.data.enddate,
              startdate2: this.data.startdate2,
              enddate2: this.data.enddate2,
              bg: this.data.bgList,
              img: this.data.imgList,
              logo: this.data.logoList
            },
            success: (res) => {
              console.log(res)
              setTimeout(function () {
                wx.hideLoading()
                let url = "/pages/SellerPage/Spage/index"
                wx.navigateTo({
                  url
                })
              }, 2000)
            },
            fail: (res) => {
              wx.showToast({
                icon: 'error',
                title: 'Searched Failed',
              })
            }
          })
          // wx.request({
          //   // url: 'http://localhost:1919/seller/sInfo',
          //   url: 'https://party-1850492-1302634362.ap-shanghai.run.tcloudbase.com/seller/sInfo',
          //   method: 'POST',
          //   data: {
          //     _id: wx.getStorageSync('companyId'),
          //     // _id:'635a13deda85a5a23a16d8a7',
          //     company: this.data.name,
          //     locations: l,
          //     person: this.data.person,
          //     startdate: this.data.startdate,
          //     enddate: this.data.enddate,
          //     startdate2: this.data.startdate2,
          //     enddate2: this.data.enddate2,
          //     bg: this.data.bgList,
          //     img: this.data.imgList,
          //     logo: this.data.logoList
          //   },
          //   success: (res) => {
          //     console.log(res)
          //     setTimeout(function () {
          //       wx.hideLoading()
          //       let url = "/pages/SellerPage/Spage/index"
          //       wx.navigateTo({
          //         url
          //       })
          //     }, 2000)
          //   },
          //   fail: (res) => {
          //     wx.showToast({
          //       icon: 'error',
          //       title: 'Searched Failed',
          //     })
          //   }
          // })
        }
      })
    }
  },


  back() {
    wx.navigateBack({
      delta: 1,
    })
  }
});

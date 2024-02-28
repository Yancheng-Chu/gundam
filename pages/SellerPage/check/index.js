var myDate = new Date();
var month = myDate.getMonth()+1
Page({
  data: {
    ID:'',
    license:'',
    year:myDate.getFullYear() + '-' + month + '-' + myDate.getDate(),
    time:myDate.toLocaleTimeString(),
    title:'',
    check:'',
    active:1,
    steps: [
      {
        text: '上传资料',
        desc: '申请人上传资料',
        inactiveIcon: 'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/seller/login/checked.png',
        activeIcon: 'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/seller/login/checked.png',
      },
      {
        text: '审核中',
        desc: '系统审核申请人信息',
        inactiveIcon: 'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/seller/login/checked.png',
        activeIcon: 'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/seller/login/now.png',
      },
      {
        text: '审核报告',
        desc: '系统已审核',
        inactiveIcon: 'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/seller/login/loading.png',
        activeIcon: 'cloud://dancer-dev-3gke67tld8fbc9b8.6461-dancer-dev-3gke67tld8fbc9b8-1302634362/party/seller/login/checked.png',
      },
    ],
  },
  onLoad(option){
    console.log(option)
    this.setData({
      title: option.title,
      check: option.check,
      active:option.activate
    })
  },
  checkID(){
    console.log('111')
  },
  checkLi(){
    console.log('222')
  },

  back(e){
    wx.navigateBack({
      delta: 2,
  })
  }
});
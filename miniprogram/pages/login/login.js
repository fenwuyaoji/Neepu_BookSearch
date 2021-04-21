// miniprogram/pages/login/login.js
var util = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin : false,
    imagewidth: 0,//缩放后的宽
    imageheight: 0,//缩放后的高
  },


  formSubmit: function (e) {
    var that = this;
    console.log(e.detail.value);
    wx.request({
      url: 'http://127.0.0.1:8080/portal/login',
      data: {
        username: e.detail.value.usr,
        password: e.detail.value.pwd,
        isAdmin: e.detail.value.isAdmin
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 200) {
          //访问正常
          if (res.data.error == true) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
            })
          } else {
            //缓存
            wx.setStorage({
              key: "student",
              data: res.data
            });
            that.data.isAdmin = e.detail.value.isAdmin == "true"
            wx.setStorage({
              key: "isAdmin",
              data: that.data.isAdmin
            });

            wx.showToast({
              title: "登陆成功",
              icon: 'success',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.switchTab({
                    url: '../book/book',
                  })
                  if (that.data.isAdmin) {
                    wx.setTabBarItem({
                      index: 3, 
                      text: '管理员',
                      })
                  }
                }, 500)
              }
            })
          }
        }
 
      },
      fail: function (res) {
        console.log("failed")
        wx.showToast({ 
          title: "登陆失败",
          icon: 'failed',
          duration: 2000,
        })
      }
    })
  },

  radioChange(e) {
    this.setData({
      isAdmin:!this.data.isAdmin
    })
 
    console.log('radio发生change事件，当前value值为：', this.data.isAdmin)
  },

  imageLoad: function (e) {
    var imageSize = util.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },



})
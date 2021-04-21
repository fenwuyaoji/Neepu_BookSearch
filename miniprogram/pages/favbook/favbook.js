// miniprogram/pages/favbook/favbook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagewidth: 0,//缩放后的宽
    imageheight: 0,//缩放后的高
    isAdmin: wx.getStorageSync('isAdmin'),
    favorList: [],
    reverseList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      "isAdmin": wx.getStorageSync('isAdmin')
    })
    console.log("onLoad:  ", that.data.isAdmin)
    if (wx.getStorageSync('isAdmin') == false) {
      init(that);
    }
  },

  addBook: function (params) {
    wx.navigateTo({
      url: '/pages/edit/editBook'
    })
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
    var that = this;
    console.log("onShow:  ", that.data.isAdmin)
    if (wx.getStorageSync('isAdmin') == false) {
      init(that);
    } 
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

function init(that) {
  var usr = wx.getStorageSync('student')
  wx.request({
    url: 'http://127.0.0.1:8080/portal/book/listFavor',
    success: function (res) {
      console.log("favorList  ", res.data)
      that.setData({
        favorList: res.data
      })
    }
  })
  wx.request({
    url: 'http://127.0.0.1:8080/portal/book/listReverse',
    method: "get",
    data: {
      usr_id: usr.id
    },
    success: function (res) {
      console.log("reverseList  ", res.data)
      that.setData({
        reverseList: res.data
      })
    }
  })
}
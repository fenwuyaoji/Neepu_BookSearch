// miniprogram/pages/edit/editBook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info_data: {},
    info_location: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = getApp().globalData.bookid;
    var that = this;
    wx.request({
      url: 'https://neepupro.mynatapp.cc/book_content',
      data: {
        book_index: id
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var dic = res['data'][res['data'].length - 1]
        var isbn_time = dic["ISBN及定价:"].split('/', 2);
        dic["isbn"] = isbn_time[0];
        dic["price"] = isbn_time[1];
        dic["theme"] = dic["学科主题:"].split('-');
        var name_author = dic["题名/责任者:"].split('/', 2);
        dic['name'] = name_author[0];
        dic['author'] = name_author[1];
        var length = res['data'].length - 1
        var book_item = res['data']
        book_item.splice(length, 1); //删除一个元素
        console.log(dic)
        console.log(book_item)
        //var info_data = that.data.info_data;
        var verify = ["学科主题:", "丛编项:", "中图法分类号:"]
        for (var i in verify) {
          if (!dic.hasOwnProperty(verify[i])) {
            dic[verify[i]] = "Null";
          }
        }

        that.setData({
          info_data: dic,
          info_location: book_item[0],
          info_list: dic["theme"]
        })
      }
    })
  },

  saveEdit: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要保存吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.showToast({
            title: "保存成功",
            icon: 'success',
            duration: 2000,
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../book/book',
            })
        }, 2000)
          
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
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
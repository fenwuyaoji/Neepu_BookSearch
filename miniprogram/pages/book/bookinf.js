var util = require('../../utils/util')

Page({
  data: {
    fav_text: "添加收藏",
    isAdmin: false,
    imagewidth: 0,//缩放后的宽
    imageheight: 0,//缩放后的高
    info_data: {},
    info_location: [],
    info_list: []
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      "isAdmin": wx.getStorageSync('isAdmin')
    })
    console.log("aa ", wx.getStorageSync('isAdmin'), "   ",this.data.isAdmin);
    console.log(this.data.info_location);
    var id = getApp().globalData.bookid;
    //判断当前是否为收藏图书
    var id_list = getApp().globalData.fav_list_id;
    wx.request({
      url: 'http://127.0.0.1:8080/portal/book/getFavor',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        book_id: id
      },
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            fav_text: 
            "已添加收藏"})
          that.setData({
            "fav_url": "../../images/h1.png"
          });
        } else {
          that.setData({
            "fav_url": "../../images/h2.png"
          });
        }
      },
      fail: function (res) {
        that.setData({
          "fav_url": "../../images/h2.png"
        });
      }
    })

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

        //判断是否已预约
        var usr = wx.getStorageSync('student');
        var info_location = that.data.info_location
        wx.setStorageSync('info_location', info_location)
        for (var index in info_location) {
          setReverse(that, id, usr, index, info_location)
        }
      }
    })
  },
  favor_book: function (e) {
    var that = this
    var id = getApp().globalData.bookid;
    var bookName = e.target.id;
    if (that.data.fav_text == "添加收藏") {
      wx.request({
        url: 'http://127.0.0.1:8080/portal/book/addFavor',
        method: "post",
        data: {
          book_id: parseInt(id),
          book_name: bookName,
          author: that.data.info_data['author']
        },
        success: function (res) {
          if (res.statusCode == 200) {
            that.setData({
              fav_text: 
              "已添加收藏"})
            that.setData({
              "fav_url": "../../images/h1.png"
            });
            wx.showToast({
              title: "收藏成功",
              icon: 'success',
              duration: 2000,
            })
          }
        },
        fail: function (res) {
          that.setData({
            "fav_url": "../../images/h2.png"
          });
          wx.showToast({
            title: "收藏失败",
            icon: 'failed',
            duration: 2000,
          })
        }
      })
    } else {
      wx.request({
        url: 'http://127.0.0.1:8080/portal/book/deleteFavor?book_id='+id,
        method: "delete",
        success: function (res) {
          if (res.statusCode == 200) {
            that.setData({
              fav_text: 
              "添加收藏"})
            that.setData({
              "fav_url": "../../images/h2.png"
            });
            wx.showToast({
              title: "取消收藏成功",
              icon: 'success',
              duration: 2000,
            })
          }
        },
        fail: function (res) {
          that.setData({
            "fav_url": "../../images/h1.png"
          });
          wx.showToast({
            title: "取消收藏失败",
            icon: 'failed',
            duration: 2000,
          })
        }
      })
    }
  },

  reserve_book: function(e) {
    var usr = wx.getStorageSync('student')
    // console.log(usr);
    var bookId = getApp().globalData.bookid;
    var bookInfo = this.data.info_location[e.target.id];
    wx.request({
      url: 'http://127.0.0.1:8080/portal/book/addReverse',
      method: "post",
      data: {
        usr_id: usr.id,
        book_id: parseInt(bookId),
        code: bookInfo.tm_mun,
        location: bookInfo.location,
        ss_num: bookInfo.ss_num
      },
      success: function (res) {
        if (res.statusCode == 200) {
          
          wx.showToast({
            title: "预约成功",
            icon: 'success',
            duration: 2000,
          })
        } else {
          wx.showToast({
            title: "预约失败",
            icon: 'failed',
            duration: 2000,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "预约失败",
          icon: 'failed',
          duration: 2000,
        })
      }
    })
  },

  deleteBook: function(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          that.setData({
            info_location: that.data.info_location.splice(e.target.dataset.index, 1)
          })
          wx.showToast({
            title: "删除成功",
            icon: 'success',
            duration: 2000,
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  editBook: function(e) {
    wx.navigateTo({
      url: '/pages/edit/editBook'
    })
  },

  imageLoad: function (e) {
    var imageSize = util.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth/10,
      imageheight: imageSize.imageHeight/10
    })
  },

  onReady: function () {
    // Do something when page ready. 
  },
  onShow: function () {
    // Do something when page show. 
  },
  onHide: function () {
    // Do something when page hide. 
  },
  onUnload: function () {
    // Do something when page close. 
  },
  onPullDownRefresh: function () {
    // Do something when pull down 
  },
  // Event handler. 
})

 function setReverse (that, id, usr, i, info_location) {
  var bookMun = info_location[i].tm_mun
  wx.request({
    url: 'http://127.0.0.1:8080/portal/book/getReverse',
    method: "get",
    data: {
      usr_id: usr.id,
      book_id: parseInt(id),
      code: bookMun
    },
    success: function (res) {
      var info_location = wx.getStorageSync('info_location')
      if (res.statusCode == 200) {
        info_location[i].text = "已预约"
        wx.setStorageSync('info_location', info_location)
        // info_location[i].text = "已预约"
      } else {
        info_location[i].text = "预约"
        wx.setStorageSync('info_location', info_location)
        // info_location[i].text = "预约"
      }
      that.setData({
        info_location: wx.getStorageSync('info_location'),
      })
    },
    fail: function(res) {
      var info_location = wx.getStorageSync('info_location')
      info_location[i].text = "预约"
      wx.setStorageSync('info_location', info_location)
      // info_location[i].text = "预约"
      that.setData({
        info_location: wx.getStorageSync('info_location'),
      })
    }
  })
}
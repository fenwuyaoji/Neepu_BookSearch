const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  imageUtil: imageUtil
}

function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽
  var originalHeight = e.detail.height;//图片原始高
  var originalScale = originalHeight/originalWidth;//图片高宽比
  //获取屏幕宽高
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight/windowWidth;//屏幕高宽比
      // console.log('windowWidth: ' + windowWidth)
      // console.log('windowHeight: ' + windowHeight)
      if(originalScale < windowscale){//图片高宽比小于屏幕高宽比
        //图片缩放后的宽为屏幕宽
         imageSize.imageWidth = windowWidth;
         imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      }else{//图片高宽比大于屏幕高宽比
        //图片缩放后的高为屏幕高
         imageSize.imageHeight = windowHeight;
         imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
      }
     
    }
  })
  return imageSize;
}

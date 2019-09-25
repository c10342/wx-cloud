// pages/edit-blog/edit-blog.js
// 评论内容最大数量
const MAX_WORDS_LENGTH = 50
// 图片最大数量
const MAX_IMAGES_LENGTH = 9
// 评论内容
let content = ''
// 用户信息
let userInfo = {}
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    bottom: 0,
    images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = options
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

  },

  onInput(event) {
    content = event.detail.value
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_LENGTH) {
      wordsNum = `最大字数为${wordsNum}`
    }
    this.setData({
      wordsNum
    })
  },

  onBlur(event) {
    this.setData({
      bottom: 0
    })
  },
  onFocus(event) {
    // event.detail.height  键盘高度
    this.setData({
      bottom: event.detail.height
    })
  },
  // 选择图片
  onChooseImages() {
    let num = MAX_IMAGES_LENGTH - this.data.images.length
    num = num <= 0 ? 0 : num
    wx.chooseImage({
      count: num,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
      },
    })
  },
  // 删除图片
  onDeleteImage(event) {
    const index = event.target.dataset.index
    const images = this.data.images
    images.splice(index, 1)
    this.setData({
      images
    })
  },
  // 点击图片进行预览
  onPrevviewImage(event) {
    const currentUrl = event.target.dataset.imgurl
    wx.previewImage({
      urls: this.data.images,
      current: currentUrl
    })
  },
  // 发布
  send() {
    if (!content.trim()) {
      wx.showModal({
        title: '内容不能为空'
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask:true
    })
    // 上传图片到云存储中
    const images = this.data.images
    let promiseArr = []
    // 上传的图片id
    let imagesId = []
    for (let i = 0, len = images.length; i < len; i++) {
      const p = new Promise((resolve, reject) => {
        // 获取后缀名
        const suffix = /\.\w+$/.exec(images[i])
        wx.cloud.uploadFile({
          cloudPath: `blog/${Date.now()}-${Math.random() * 1000 + 1}.${suffix}`, // 上传至云端的路径
          filePath: images[i], // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            imagesId.push(res.fileID)
            resolve()
          },
          fail: (err) => {
            reject()
          }
        })
      })
      promiseArr.push(p)
    }

    Promise.all(promiseArr).then(() => {
      // 往数据库中插入数据
      // 客户端操作数据库会自动插入用户的openid字段
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          img: imagesId,
          createTime: db.serverDate() //服务器时间
        }
      }).then(() => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        // 返回上一级页面
        wx.navigateBack()
        const pages = getCurrentPages()
        const prevPages = pages[0]
        prevPages.onPullDownRefresh()
      }).catch(() => {
        wx.hideLoading()
        wx.showToast({
          title: '发布失败',
          icon:'none'
        })
      })
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
        icon: 'none'
      })
    })
  }
})
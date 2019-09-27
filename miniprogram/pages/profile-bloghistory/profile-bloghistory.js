// pages/profile-bloghistory/profile-bloghistory.js

const dbCollection = wx.cloud.database().collection('blog')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBlogList()
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
    this.getBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    if (event.from == 'button') {
      const ds = event.target.dataset.blog
      const content = ds.content
      const blogId = ds._id
      return {
        title: content,
        path: `/pages/blog-comment/blog-comment?blogId=${blogId}`
      }
    }
  },

  async getBlogList(start = 0) {
    try {
      if(this.data.total === this.data.blogList.length && start != 0){
        return
      }
      wx.showLoading({
        title: '加载中'
      })
      const res = await dbCollection.skip(start).limit(10).orderBy('createTime', 'desc').get()
      const total = await dbCollection.count().then(res=>res.total)
      let result = res.data
      for (let i = 0, len = result.length; i < len; i++) {
        result[i].createTime = result[i].createTime.toString()
      }
      if (start == 0) {
        this.setData({
          blogList: result,
          total
        })
      } else {
        this.setData({
          blogList: this.data.blogList.concat(result),
          total
        })
      }
    } catch (err) {
      wx.showToast({
        title: '加载出错',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }
  },
  gotoBlogComment(event) {
    const id = event.target.dataset.id
    wx.navigateTo({
      url: `/pages/blog-comment/blog-comment?blogId=${id}`,
    })
  }
})
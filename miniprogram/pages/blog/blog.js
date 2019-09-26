// const db = wx.cloud.database()
let count = 10
let input = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false,
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
    if (event.from == 'button'){
      const ds = event.target.dataset.blog
      const content = ds.content
      const blogId = ds._id
      return {
        title:content,
        path: `/pages/blog-comment/blog-comment?blogId=${blogId}`
      }
    }
  },

  onPublish() {
    // 判断用户是否授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权获取用户信息
          // 获取用户信息
          wx.getUserInfo({
            success: (info) => {
              const userInfo = info.userInfo
              this.loginSuccess({
                detail: {
                  nickName: userInfo.nickName,
                  avatarUrl: userInfo.avatarUrl
                }
              })
            }
          })
        } else {
          this.setData({
            modalShow: true
          })
        }
      }
    })
  },
  loginFail() {
    wx.showModal({
      title: '授权用户才能发布'
    })
  },
  loginSuccess(event) {
    const nickName = event.detail.nickName
    const avatarUrl = event.detail.avatarUrl
    wx.navigateTo({
      url: `/pages/edit-blog/edit-blog?nickName=${nickName}&avatarUrl=${avatarUrl}`,
    })
  },
  getBlogList(start = 0) {
    wx.showLoading({
      title: '查询中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'bloglist',
        count,
        start,
        keyWord:input
      }
    }).then(res => {
      if (start == 0) {
        this.setData({
          blogList: res.result
        })
      } else {
        this.setData({
          blogList: this.data.blogList.concat(res.result)
        })
      }

    }).catch(() => {
      wx.showToast({
        title: '获取博客列表失败',
        icon: 'none'
      })
    }).finally(() => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  gotoBlogComment(event) {
    const id = event.target.dataset.id
    wx.navigateTo({
      url: `/pages/blog-comment/blog-comment?blogId=${id}`,
    })
  },
  doSearch(event){
    input = event.detail.input
    this.getBlogList(0)
  }
})
// miniprogram/pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow:false
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

  onPublish(){
    // 判断用户是否授权
    wx.getSetting({
      success:(res)=>{
        if (res.authSetting['scope.userInfo']){
          // 已经授权获取用户信息
          // 获取用户信息
          wx.getUserInfo({
            success:(info)=>{
              const userInfo = info.userInfo
              this.loginSuccess({
                detail:{
                  nickName: userInfo.nickName,
                  avatarUrl: userInfo.avatarUrl
                }
              })
            }
          })
        }else{
          this.setData({
            modalShow:true
          })
        }
      }
    })
  },
  loginFail(){
    wx.showModal({
      title: '授权用户才能发布'
    })
  },
  loginSuccess(event){
    const nickName = event.detail.nickName
    const avatarUrl = event.detail.avatarUrl
    wx.navigateTo({
      url: `/pages/edit-blog/edit-blog?nickName=${nickName}&avatarUrl=${avatarUrl}`,
    })
  }
})
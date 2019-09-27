// pages/profile-playhistory/profile-playhistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicListHistory:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const musicListHistory = wx.getStorageSync('musicListHistory') || []
    if(musicListHistory.length == 0){
      wx.showModal({
        title: '暂无播放歌曲'
      })
      return
    }
    this.setData({
      musicListHistory
    })
    wx.setStorageSync('musiclist', musicListHistory)
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
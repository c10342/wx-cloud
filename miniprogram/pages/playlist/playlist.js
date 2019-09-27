// miniprogram/pages/playlist/playlist.js

const MAX_LIMIT = 15

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImageUrls: [
      {
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    playlist: [],
    total: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getPlaylist()
    // 用户扫描二维码进来小程序会携带该参数
    console.log(options.scene)
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
   * 需要在json文件中开启
   * "enablePullDownRefresh": true
   */
  onPullDownRefresh: function () {
    this._getPlaylist('down')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  _getPlaylist(type = 'up') {
    if (this.data.total === this.data.playlist.length && type === 'up') {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    const start = type === 'up' ? this.data.playlist.length : 0
    wx.cloud.callFunction({
      name: 'music',
      data: {
        count: MAX_LIMIT,
        start,
        $url:'playlist'
      }
    }).then(res => {
      let playlist = []
      if (type === 'up') {
        playlist = this.data.playlist.concat(res.result.list)
      } else if (type === 'down') {
        playlist = res.result.list
      }
      this.setData({
        playlist: playlist,
        total: res.result.total
      })
    }).catch(err=>{
      wx.showToast({
        title: err.toString(),
        icon:'none'
      })
    }).finally(() => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  }
})
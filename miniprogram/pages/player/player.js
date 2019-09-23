// pages/player/player.js
let musiclist = []
let currentIndex = 0
// 获取全局唯一的背景音乐播放管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
    lyric:'',
    isShowLyric:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    musiclist = wx.getStorageSync('musiclist')
    currentIndex = options.index
    this._loadMusicDetail()
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

  // 加载歌曲相关信息
  _loadMusicDetail() {
    // 切换歌曲前先暂停
    backgroundAudioManager.stop()
    let music = musiclist[currentIndex]
    const musicId = music.id
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false
    })
    wx.showLoading({
      title: '歌曲加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl',
      }
    }).then(res => {
      const musicUrl = res.result.data[0].url
      const title = music.name
      const epname = music.al.name
      const coverImgUrl = music.al.picUrl
      const singer = music.ar[0].name
      backgroundAudioManager.src = musicUrl
      backgroundAudioManager.title = title
      backgroundAudioManager.epname = epname
      backgroundAudioManager.coverImgUrl = coverImgUrl
      backgroundAudioManager.singer = singer
      this.setData({
        isPlaying: true
      })
      this.getLyric(musicId)
    }).finally(() => {
      wx.hideLoading()
    })
  },

  // 切换播放状态
  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  // 上一首
  onPrev() {
    if (currentIndex == 0) {
      currentIndex = musiclist.length - 1
    } else {
      currentIndex--
    }
    this._loadMusicDetail()
  },
  // 下一首
  onNext() {
    if (currentIndex == musiclist.length - 1) {
      currentIndex = 0
    } else {
      currentIndex++
    }
    this._loadMusicDetail()
  },
  getLyric(musicId){
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url:'lyric',
        musicId
      }
    }).then(res=>{
      this.setData({
        lyric: res.result.lrc.lyric
      })
    })
  },
  toggleLyric(){
    this.setData({
      isShowLyric:!this.data.isShowLyric
    })
  }
})
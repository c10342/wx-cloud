// pages/player/player.js
let musiclist = []
let currentIndex = 0
// 获取全局唯一的背景音乐播放管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
    lyric: '',
    isShowLyric: false,
    isSame: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    musiclist = wx.getStorageSync('musiclist')
    if (options.musicId == app.getPlayingMusicId()) {
      // 同一首歌曲就还原上一次状态
      this.initState()
      return
    }
    currentIndex = options.index
    // 加载音乐详情
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
    wx.setStorageSync('currentIndex', currentIndex)
    wx.setStorageSync('lyric', this.data.lyric)
    wx.setStorageSync('picUrl', this.data.picUrl)
    wx.setStorageSync('isShowLyric', this.data.isShowLyric)
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
    // 获取要播放的哪一首歌曲
    let music = musiclist[currentIndex]
    const musicId = music.id
    // 设置标题
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false,
      lyric: ''
    })
    // 把当前播放的音乐id保存到全局
    app.setPlayingMusicId(musicId)
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
      // musicUrl为空说明没有权限，需要vip
      if (!musicUrl) {
        wx.showToast({
          title: '歌曲无权限',
          icon: 'none'
        })
        return
      }
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
      // 保存图片地址和音乐索引到本地
      wx.setStorageSync('picUrl', coverImgUrl)
      wx.setStorageSync('currentIndex', currentIndex)
      // 获取歌词
      this.getLyric(musicId)
    }).catch(err => {
      wx.showToast({
        title: err.toString(),
        icon: 'none'
      })
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
  getLyric(musicId) {
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'lyric',
        musicId
      }
    }).then(res => {
      // 可能会没有歌词的情况
      let lrc = res.result.lrc.lyric ? res.result.lrc.lyric : ''
      this.setData({
        lyric: lrc
      })
      // 保存歌词到本地
      wx.setStorageSync('lyric', lrc)
    }).catch(err => {
      console.log(res)
      this.setData({
        lyric: ''
      })
      wx.setStorageSync('lyric', '')
    })
  },
  toggleLyric() {
    this.setData({
      isShowLyric: !this.data.isShowLyric
    })
  },
  onTimeUpdate(event) {
    if (!event.detail.currentTime) {
      return
    }
    // this.selectComponent('#lyric')  选中组件   返回组件实例
    this.selectComponent('#lyric').update(event.detail.currentTime)
  },
  musicPause() {
    this.setData({
      isPlaying: false
    })
  },
  musicPlay() {
    this.setData({
      isPlaying: true
    })
  },
  // 初始化状态
  initState() {
    currentIndex = wx.getStorageSync('currentIndex')
    const picUrl = wx.getStorageSync('picUrl')
    const lyric = wx.getStorageSync('lyric')
    const isShowLyric = wx.getStorageSync('isShowLyric')
    this.setData({
      picUrl: picUrl,
      isPlaying: !backgroundAudioManager.paused,
      lyric: lyric,
      isShowLyric: isShowLyric,
      isSame: true
    })
  }
})
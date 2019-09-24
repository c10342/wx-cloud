// components/lyric/lyric.js
// 每条歌词的高度
let lyricHeight = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示歌词
    isShowLyric: {
      type: Boolean,
      value: false
    },
    // 歌词
    lyric: String,
    // 是否为同一首歌
    isSame: Boolean
  },

  observers: {
    lyric(newVal) {
      if (!newVal) {
        this.setData({
          lyricList: [{
            time: 0,
            lrc: '暂无歌词'
          }],
          highLightIndex: -1,
        })
      } else {
        // 解析歌词
        this._parseLyric(newVal)
        if (this.properties.isSame) {  //同一首歌
          // 还原状态
          this.initPrevState()
        }
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 歌词数组，每个时间段对应一条歌词
    lyricList: [],
    // 当前第几个歌词高亮
    highLightIndex: -1,
    // 列表滚动高度
    scrollTop: 0
  },

  lifetimes: {
    ready() {
      wx.getSystemInfo({
        success: function (res) {
          // 获取屏幕宽度
          const screenWidth = res.screenWidth
          // 换算1rpx等于多少px  750为基准
          const rpx2px = screenWidth / 750
          lyricHeight = rpx2px * 64
        },
      })
    },
    detached() {
      // 组件销毁是保存歌词高度
      wx.setStorageSync('lyricHeight', lyricHeight)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 解析歌词
    _parseLyric(lyric) {
      const lryicArr = lyric.split('\n')
      let _lyricList = []
      lryicArr.forEach(eleme => {
        // 提取时间
        const time = eleme.match(/\[(\d{2,}):(\d{2})(?:.(\d{2,3}))?]/g)
        if (time) {
          // 提取歌词
          const lrc = eleme.split(time[0])[1]
          // 提取时间,分，秒，毫秒 [00:00:00]
          const timeReg = time[0].match(/(\d{2,}):(\d{2})(?:.(\d{2,3}))?/)
          // 时间转化成s
          const time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          _lyricList.push({
            time: time2Seconds,
            lrc
          })
        }
      })
      this.setData({
        lyricList: _lyricList
      })
    },
    // 更新高亮的歌词和滚动的距离
    update(currentTime) {
      const lyricList = this.data.lyricList
      // 歌曲最后面的时间没歌词
      if (currentTime > lyricList[lyricList.length - 1].time) {
        // 不高亮歌词，歌词滚动到最底部
        this.setData({
          highLightIndex: - 1,
          scrollTop: lyricList.length * lyricHeight
        })
        return
      }
      // 遍历歌词
      for (let i = 0, len = lyricList.length; i < len; i++) {
        if (currentTime <= lyricList[i].time) {
          this.setData({
            highLightIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break;
        }
      }
    },
    // 初始化状态
    initPrevState() {
      lyricHeight = wx.getStorageSync('lyricHeight')
      // 获取当前播放的时间
      const currentTime = backgroundAudioManager.currentTime
      // 更新歌词
      this.update(currentTime)
    }
  },
})

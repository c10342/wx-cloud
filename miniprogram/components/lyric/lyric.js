// components/lyric/lyric.js
let lyricHeight = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowLyric: {
      type: Boolean,
      value: false
    },
    lyric: String,
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
        console.log(newVal)
        this._parseLyric(newVal)
        if (this.properties.isSame) {
          this.initPrevState()
        }
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
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
      wx.setStorageSync('lyricHeight', lyricHeight)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _parseLyric(lyric) {
      const lryicArr = lyric.split('\n')
      let _lyricList = []
      lryicArr.forEach(eleme => {
        // 提取时间
        const time = eleme.match(/\[(\d{2,}):(\d{2})(?:.(\d{2,3}))?]/g)
        if (time) {
          // 提取歌词
          const lrc = eleme.split(time[0])[1]
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
    update(currentTime) {
      const lyricList = this.data.lyricList
      // 歌曲后面没歌词
      if (currentTime > lyricList[lyricList.length - 1].time) {
        this.setData({
          highLightIndex: - 1,
          scrollTop: lyricList.length * lyricHeight
        })
        return
      }
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
    initPrevState() {
      lyricHeight = wx.getStorageSync('lyricHeight')
      const currentTime = backgroundAudioManager.currentTime
      this.update(currentTime)
    }
  },
})

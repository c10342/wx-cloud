// 进度条长度
let movableAreaWidth = 0
// 进度条小球长度
let movableViewWidth = 0
// 背景音乐管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
// 当前音乐播放时长
let currentSec = -1
// 音乐总时长  s
let duration = 0
// 是否正在拖动进度条
let isMoving = false
// 进度条距离左边的距离
let movableAreaOffsetLeft = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 进度条左右2边的文本
    showTime: {
      currentTime: '00:00', //当前时长
      totalTime: '00:00' //总时长
    },
    percent: 0, //progress 组件的进度  0-100
    moveX: 0 //movable-view 组件移动的距离
  },
  // 组件生命周期函数写在里面
  lifetimes: {
    ready() {
      if (this.properties.isSame) {
        this.initPrevState()
      } else {
        this._getMoveableDis()
      }
      this.bindBGMEvent()
    },
    detached() {
      wx.setStorageSync('movableAreaWidth', movableAreaWidth)
      wx.setStorageSync('movableViewWidth', movableViewWidth)
      wx.setStorageSync('movableAreaOffsetLeft', movableAreaOffsetLeft)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 绑定进度条点击事件
    onClick(event) {
      isMoving = true
      // 点击的距离
      // event.detail.x相当于 PageX
      this.data.moveX = event.detail.x - movableAreaOffsetLeft - movableViewWidth / 2
      this.onTouchEnd()
    },
    // 绑定进度条变化事件
    onChange(event) {
      // 拖拽产生的变动
      if (event.detail.source === 'touch') {
        isMoving = true
        // 变动的距离
        this.data.moveX = event.detail.x
      }
    },
    onTouchEnd() {
      const moveX = this.data.moveX
      const percent = moveX / (movableAreaWidth - movableViewWidth) * 100
      const currentTime = percent * duration / 100
      const currentFmt = this._dataFormat(currentTime)
      this.setData({
        moveX,
        percent,
        ['showTime.currentTime']: `${currentFmt.min}:${currentFmt.sec}`
      })
      backgroundAudioManager.seek(currentTime)
      isMoving = false
    },
    _getMoveableDis() {
      // component里面使用this,page里面使用wx
      // 查询元素宽高
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec(function(res) {
        movableAreaOffsetLeft = res[0].left
        movableAreaWidth = res[0].width
        movableViewWidth = res[1].width
      })
    },
    // 绑定事件
    bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        isMoving = false
        this.triggerEvent('musicPlay')
      })
      backgroundAudioManager.onPause(() => {
        this.triggerEvent('musicPause')
      })
      backgroundAudioManager.onCanplay(() => {
        // 微信小坑  backgroundAudioManager.duration可能会出现undefined情况
        const duration = backgroundAudioManager.duration
        if (typeof duration != 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })
      backgroundAudioManager.onTimeUpdate(() => {
        if (isMoving) {
          return
        }
        const currentTime = backgroundAudioManager.currentTime
        let sec = currentTime.toString().split('.')[0]
        // 1s可能会触发多次onTimeUpdate事件
        if (sec != currentSec) { //1s只触发一次
          const currentFmt = this._dataFormat(currentTime)
          const moveX = (movableAreaWidth - movableViewWidth) * currentTime / duration
          const percent = currentTime / duration * 100
          this.setData({
            moveX,
            percent,
            ['showTime.currentTime']: `${currentFmt.min}:${currentFmt.sec}`
          })
          currentSec = sec
          this.triggerEvent('timeUpdate', {
            currentTime
          })
        }
      })
      backgroundAudioManager.onEnded(() => {
        this.triggerEvent('musicEnd')
      })
      backgroundAudioManager.onError((res) => {
        wx.showToast({
          title: '错误：' + res.errCode,
          icon: 'none'
        })
      })
    },
    _setTime() {
      duration = backgroundAudioManager.duration
      const durationFmt = this._dataFormat(duration)
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
    },
    _dataFormat(sec) {
      let min = Math.floor(sec / 60)
      sec = Math.floor(sec % 60)
      return {
        min: this._parse0(min),
        sec: this._parse0(sec)
      }
    },
    _parse0(num) {
      return num < 10 ? '0' + num : num
    },
    initPrevState() {
      // 获取总时长
      movableViewWidth = wx.getStorageSync('movableViewWidth')
      movableAreaWidth = wx.getStorageSync('movableAreaWidth')
      movableAreaOffsetLeft = wx.getStorageSync('movableAreaOffsetLeft')
      duration = backgroundAudioManager.duration
      const currentTime = backgroundAudioManager.currentTime
      const currentFmt = this._dataFormat(currentTime)
      const totalTimeFmt = this._dataFormat(duration)
      const moveX = (movableAreaWidth - movableViewWidth) * currentTime / duration
      const percent = currentTime / duration * 100
      this.setData({
        moveX,
        percent,
        ['showTime.currentTime']: `${currentFmt.min}:${currentFmt.sec}`,
        ['showTime.totalTime']: `${totalTimeFmt.min}:${totalTimeFmt.sec}`
      })
    }
  }
})
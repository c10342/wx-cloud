// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSec = -1
let duration = 0
let isMoving = false
let movableAreaOffsetLeft = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    percent: 0,
    moveX: 0
  },
  // 组件生命周期函数写在里面
  lifetimes: {
    ready() {
      this._getMoveableDis()
      this.bindBGMEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick(event){
      isMoving = true
      this.data.moveX = event.detail.x - movableAreaOffsetLeft - movableViewWidth/2
      this.onTouchEnd()
    },
    onChange(event){
      // 拖拽产生的变动
      if (event.detail.source === 'touch'){
        isMoving = true
        this.data.moveX = event.detail.x
      }
    },
    onTouchEnd(){
      const moveX = this.data.moveX
      const percent = moveX / (movableAreaWidth - movableViewWidth) *100
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
      query.exec(function (res) {
        movableAreaOffsetLeft = res[0].left
        movableAreaWidth = res[0].width
        movableViewWidth = res[1].width
      })
    },
    // 绑定事件
    bindBGMEvent() {
      backgroundAudioManager.onPlay(()=>{
        isMoving = false
      })
      backgroundAudioManager.onCanplay(() => {
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
        if (isMoving){
          return
        }
        const currentTime = backgroundAudioManager.currentTime
        let sec = currentTime.toString().split('.')[0]
        if (sec != currentSec) {
          const currentFmt = this._dataFormat(currentTime)
          const moveX = (movableAreaWidth - movableViewWidth) * currentTime / duration
          const percent = currentTime / duration * 100
          this.setData({
            moveX,
            percent,
            ['showTime.currentTime']: `${currentFmt.min}:${currentFmt.sec}`
          })
          currentSec = sec
        }
      })
      backgroundAudioManager.onEnded(()=>{
        this.triggerEvent('musicEnd')
      })
      backgroundAudioManager.onError((res) => {
        wx.showToast({
          title: '错误：' + res.errCode,
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
    }
  }
})

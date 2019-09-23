// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist:{
      type:Object
    }
  },

// 数据监听器
  observers:{
    ['playlist.playCount'](count){
      let val = this._tranNum(count,2)
      this.setData({
        count:val
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    count:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoMusiclist(){
      wx.navigateTo({
        url: `/pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
      })
    },
    _tranNum(num,point){
      let numStr = num.toString().split('.')[0]
      if(numStr.length < 6){
        // 小于10万直接显示
        return numStr
      } else if (numStr.length >= 6 && numStr.length<=8){
        // 10万到1亿
        // 1464123.8
        // 截取转化成万之后小数点后的数字
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point) //41
        // parseInt(num / 10000)  =>  146
        // 146.41
        return parseFloat(parseInt(num / 10000) + '.' + decimal)+'万'
      }else{
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point)
        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿'
      }
    }
  }
})

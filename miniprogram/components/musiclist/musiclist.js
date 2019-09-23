// components/musiclist/musiclist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    musicId:-1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event){
      const ds = event.currentTarget.dataset
      const musicId = ds.musicid
      const index = ds.index
      this.setData({
        musicId
      })
      wx.navigateTo({
        url: `/pages/player/player?musicId=${musicId}&index=${index}`,
      })
    }
  }
})

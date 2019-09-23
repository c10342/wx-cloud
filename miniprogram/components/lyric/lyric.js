// components/lyric/lyric.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowLyric:{
      type:Boolean,
      value:false
    },
    lyric:String
  },

  observers:{
    lyric(newVal){
      console.log(newVal)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

// components/blog-card/blog-card.js
import {formatTime} from '../../utils/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog:Object
  },

  observers:{
    ['blog.createTime'](newVal){
      this.setData({
        fmtTime:formatTime(newVal)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    fmtTime:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPrevviewImg(event){
      const imgurl = event.target.dataset.imgurl
      wx.previewImage({
        urls: this.properties.blog.img,
        current:imgurl
      })
    }
  }
})

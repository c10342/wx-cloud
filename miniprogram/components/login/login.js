// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow:Boolean
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
    closeModal(){
      this.setData({
        modalShow:false
      })
    },
    bindGetUserInfo(event){
      const detail = event.detail
      if(detail.userInfo){
        this.triggerEvent('loginSuccess', detail.userInfo)
      }else{
        this.triggerEvent('loginFail')
      }
    }
  }
})

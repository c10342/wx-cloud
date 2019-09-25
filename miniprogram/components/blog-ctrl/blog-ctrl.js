// components/blog-ctrl/blog-ctrl.js
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
    loginShow: false,
    modalShow:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (info) => {
                // const userInfo = info.userInfo
                this.setData({
                  modalShow:true
                })
              }
            })
          } else {
            this.setData({
              loginShow: true
            })
          }
        }
      })
    },
    loginSuccess(){
      this.setData({
        loginShow:false,
        modalShow:true
      })
    },
    loginFail(){
      wx.showModal({
        title: '授权用户才能发表评论'
      })
    },
    closeModal(){
      this.setData({
        modalShow:false
      })
    }
  }
})

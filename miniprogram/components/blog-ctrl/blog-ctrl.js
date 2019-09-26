// components/blog-ctrl/blog-ctrl.js
import { formatTime } from '../../utils/formatTime.js'
let userInfo = null
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false,
    modalShow: false,
    value:'',
    showConfirmBar:false
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
                userInfo = info.userInfo
                this.setData({
                  modalShow: true
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
    loginSuccess(event) {
      userInfo = event.detail.userInfo
      this.setData({
        loginShow: false,
        modalShow: true
      })
    },
    loginFail() {
      wx.showModal({
        title: '授权用户才能发表评论'
      })
    },
    closeModal() {
      this.setData({
        modalShow: false
      })
    },
    // 发表评论
    onPublish(event) {
      let content = event.detail.value.textarea
      if (!content.trim()) {
        wx.showModal({
          title: '评论给内容不能为空'
        })
        return
      }
      const formId = event.detail.formId
      wx.showLoading({
        title: '发布中',
      })
      db.collection('blog-comment').add({
        data: {
          content,
          blogId: this.properties.blogId,
          createTime: db.serverDate(),
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then(() => {
        wx.cloud.callFunction({
          name: 'messageSend',
          data: {
            blogId: this.properties.blogId,
            formId,
            content,
            time: formatTime()
          }
        }).then((res) => {
          this.setData({
            modalShow: false,
            value:''
          }, () => {
            wx.showToast({
              title: '发布成功',
            })
            this.triggerEvent('commentSuccess')
          })

        }).catch(() => {
          wx.showToast({
            title: '发布失败',
            icon: 'none'
          })
        }).finally(() => {
          wx.hideLoading()
        })
      }).catch((err) => {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '发布失败',
          icon: 'none'
        })
      })
    },
    onInput(event){
      this.setData({
        value:event.detail.value
      })
    }
  }
})

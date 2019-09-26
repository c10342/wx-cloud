// pages/blog-comment/blog-comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogId:'',
    commentDetail:{},
    commentList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      blogId:options.blogId
    })
    this._getCommentDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    if (event.from == 'button') {
      const ds = event.target.dataset.blog
      console.log(ds)
      const content = ds.content
      const blogId = ds._id
      return {
        title: content,
        path: `/pages/blog-comment/blog-comment?blogId=${blogId}`
      }
    }
  },

  _getCommentDetail(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        $url:'blogdetail',
        blogId:this.data.blogId
      }
    }).then(res=>{
      const commentList = res.result.commitList
      let arr = []
      for(let i = 0,len = commentList.length;i<len;i++){
        arr.push({
          avatarUrl: commentList[i].avatarUrl,
          content: commentList[i].content,
          createTime: commentList[i].createTime,
          nickName: commentList[i].nickName,
          img: []
        })
      }
      this.setData({
        commentDetail:res.result.detail[0],
        commentList: arr,
      })
    }).catch((err)=>{
      wx.showToast({
        title: '加载出错',
        icon:'none'
      })
    }).finally(()=>{
      wx.hideLoading()
    })
  }
})
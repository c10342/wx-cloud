// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()

    const result = await cloud.openapi.templateMessage.send({
      touser: wxContext.OPENID,
      templateId: '7n4lp_SsrP0u6s-VWYlce9xPXv3VE8o89DwchlR19sg',
      page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
      formId: event.formId,
      data: {
        keyword1: {
          value: '评论完成'
        },
        keyword2: {value:event.content},
        keyword3: {value:event.time}
      }
    })

    return {
      message:'成功'
    }
  } catch (err) {
    return {
      message: '失败'
    }
  }


  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}
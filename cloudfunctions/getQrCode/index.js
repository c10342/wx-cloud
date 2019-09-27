// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 生成小程序二维码
  // 返回的是二进制数据
  const result = await cloud.openapi.wxacode.getUnlimited({
    // 二维码携带的参数
    scene: wxContext.OPENID
  })
  // 保存二维码
  const res = await cloud.uploadFile({
    fileContent: result.buffer,
    cloudPath: `qrcode/${Date.now()}-${Math.random() * 1000 + 1}.png`
  })

  return res.fileID
}
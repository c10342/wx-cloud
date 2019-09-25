// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init()

const db = cloud.database()

const blogCollection = db.collection('blog')


// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })

  app.router('bloglist', async (ctx) => {
    let w = {}
    if (event.keyWord) {
      // 模糊查询
      w = {
        content: db.RegExp({
          regexp: event.keyWord,
          options: 'i'
        })
      }
    }
    ctx.body = await blogCollection
      .where(w)
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        return res.data
      })
  })

  return app.serve()
}
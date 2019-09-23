// 云函数入口文件
const cloud = require('wx-server-sdk')

const rp = require('request-promise')

const Tcbrouter = require('tcb-router')

cloud.init()

const db = cloud.database()

const playlistCollect = db.collection('playlist')

const BASE_URL = 'http://musicapi.xiecheng.live'

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new Tcbrouter({ event })

  app.router('playlist', async (ctx) => {
    const start = event.start || 0
    const count = event.count || 15
    // 获取总数
    const total = await playlistCollect.count()
    const list = await playlistCollect
      .skip(start)
      .limit(count)
      .orderBy('createTime', 'desc')
      .get()
    ctx.body = {
      list: list.data,
      total: total.total
    }
  })

  app.router('musiclist', async (ctx) => {
    const result = await rp(`${BASE_URL}/playlist/detail?id=${event.playlistId}`)
      .then(res => {
        return JSON.parse(res)
      })
    ctx.body = result
  })

  // 获取歌曲播放地址
  app.router('musicUrl', async (ctx) => {
    const result = await rp(`${BASE_URL}/song/url?id=${event.musicId}`)
      .then(res => {
        return JSON.parse(res)
      })
    ctx.body = result
  })

  return app.serve()
}
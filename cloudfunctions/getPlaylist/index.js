// 云函数入口文件
const cloud = require('wx-server-sdk')

const rp = require('request-promise')

cloud.init()

// 初始化云数据库
const db = cloud.database()

const playlistCollect = db.collection('playlist')

const URL = 'http://musicapi.xiecheng.live/personalized'

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  // 云函数一次性最多能查出100条数据
  // const playlist = await playlistCollect.get()

  // 获取数据库中一共有几条记录
  const countResult = await playlistCollect.count()
  const total = countResult.total
  // 查询所有数据需要分几次查询
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  let task = []
  for (let i = 0; i < batchTimes; i++) {
    // skip从第几条开始取
    // limit需要取多少条
    const promise = playlistCollect.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    task.push(promise)
  }
  let playlist = {
    data: []
  }
  if (task.length > 0) {
    // 等待所有promise完成
    playlist = (await Promise.all(task)).reduce((acc, current) => {
      return {
        data: acc.data.concat(current.data)
      }
    })
  }
  const result = await rp(URL).then(res => {
    return JSON.parse(res).result
  })
  // 去重
  let newData = []
  for (let i = 0, len1 = result.length; i < len1; i++) {
    let flag = true
    for (let j = 0, len2 = playlist.data.length; j < len2; j++) {
      if (result[i].id === playlist.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(result[i])
    }
  }
  for (let i = 0, len = newData.length; i < len; i++) {
    // 插入数据
    await playlistCollect.add({
      data: {
        ...newData[i],
        // db.serverDate()数据库的时间
        createTime: db.serverDate()
      }
    }).then(res => {
      console.log('插入成功')
    }).catch(err => {
      console.log(err)
      console.log('插入失败')
    })
  }

  return newData.length
}

// 获取全局唯一的背景音乐播放管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        // 每一个访问过小程序的用户都能在云服务中看见
        traceUser: true,
      })
    }

    this.globalData = {
      playingMusicId: -1
    }
    this.checkUpdate()
  },
  setPlayingMusicId(musicId) {
    this.globalData.playingMusicId = musicId
  },
  getPlayingMusicId() {
    return this.globalData.playingMusicId
  },
  checkUpdate() {
    // 获取全局唯一的版本更新管理器，用于管理小程序更新
    const updateManager = wx.getUpdateManager()
    // 监听向微信后台请求检查更新结果事件
    // 即检查是否需要更新
    updateManager.onCheckForUpdate(res => {
      if (res.hasUpdate) {
        // 监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (result) {
              if (result.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })
  }
})

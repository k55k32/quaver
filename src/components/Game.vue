<template lang="pug">
.container
  .game-container(v-show="isStart")
    .player(:style="{bottom: `${playerBottom}px`}", ref="player")
      img(:src="`/static/img/${imgType}.png`")
    .game-main-window
      .game-wrapper(:style="{transform: `translate(${-blockPosition}px, 0)`}", ref="gameWrapper")
        .block(v-for="b in blocks", :style="b")
    .notice
      .time TIMES: {{(currentTime.getTime() - startTime.getTime()) / 1000}}
    .stop
      .btn(@click="back") BACK
    .over-mask(:style="{opacity: gameOverOpacity}")
  .game-container(v-show="!isStart")
    h1.desc 八分音符 HTML5 版本
    .btn(@click="start") 开始游戏
</template>

<script>
import AudioAPI from '../js/AudioAPI'
import GameData from './game-data'
let analyser

export default {
  data () {
    return {
      timer: '',
      isStart: false,
      isStop: false,
      voiceSize: 0,
      sensitivity: 1000,
      blocks: GameData,
      blockPosition: 0,
      currentNodeIndex: 0,
      playerBottom: 300,
      autoDown: false,
      jumpTimes: 0,
      showPlayer: false,
      imgType: 1,
      startTime: new Date(),
      currentTime: new Date(),
      flushGameTime: '',
      gameOverOpacity: 0
    }
  },
  mounted () {
    this.$nextTick(_ => {
      this.showPlayer = true
      this.$watch('voice', (val) => {
        if (this.inBlock) {
          this.imgType = val % 2 + 1
        } else {
          this.imgType = val % 2 + 4
        }
      })
    })
  },
  computed: {
    voice () {
      return parseInt(this.voiceSize / this.sensitivity)
    },
    currentNode () {
      return this.$refs.gameWrapper.childNodes[this.currentNodeIndex]
    },
    nodeStartPosition () {
      return this.currentNode.offsetLeft
    },
    nodeEndPosition () {
      return this.nodeStartPosition + this.currentNode.offsetWidth
    },
    playerEL () {
      return this.$refs.player
    },
    playerStartPosition () {
      return this.playerEL.offsetLeft + this.blockPosition
    },
    playerEndPosition () {
      return this.playerStartPosition + this.playerEL.clientWidth
    },
    currentNodeHeight () {
      return this.currentNode.clientHeight
    },
    onBlock () {
      if (this.playerStartPosition < this.nodeEndPosition &&
        this.playerEndPosition > this.nodeStartPosition) {
        return true
      }
      return false
    },
    inBlock () {
      return this.onBlock && (this.playerBottom === this.currentNodeHeight)
    }
  },
  watch: {
    playerBottom (val) {
      if (val <= -50) {
        this.gameOver()
      }
    }
  },
  methods: {
    start () {
      if (!analyser) {
        AudioAPI.start().then(a => {
          analyser = a
          this.gameStart()
        })
      } else {
        this.gameStart()
      }
      this.isStart = true
      this.isStop = false
      this.startTime = new Date()
      this.flushGameTime = setInterval(() => {
        this.currentTime = new Date()
      }, 20)
      this.$nextTick(() => {
        this.currentNodeChanged()
      })
    },
    stop () {
      this.isStop = true
      this.stopGetVoiceSize()
      this.stopAutoDown()
      clearInterval(this.flushGameTime)
    },
    gameOver () {
      this.gameOverOpacity = 1
      setTimeout(() => {
        this.gameOverOpacity = 0
        this.back()
      }, 1200)
    },
    back () {
      this.stopGetVoiceSize()
      this.stopAutoDown()
      this.isStart = false
      this.blockPosition = 0
      this.currentNodeIndex = 0
      this.playerBottom = this.$refs.gameWrapper.childNodes[this.currentNodeIndex].clientHeight
    },
    gameStart () {
      this.startGetVoiceSize()
      this.playerAutoDown()
    },
    startGetVoiceSize () {
      this.timer = setTimeout(() => {
        const voiceSize = AudioAPI.getVoiceSize(analyser)
        this.voiceSize = voiceSize
        this.voiceChanged()
        this.startGetVoiceSize()
      }, 5)
    },
    currentNodeChanged () {
      if (this.playerStartPosition > this.nodeEndPosition) {
        this.currentNodeIndex++
      }
      if (!this.onBlock && this.playerBottom < this.currentNodeHeight &&
        this.playerEndPosition >= this.nodeStartPosition) {
        this.blockPosition --
      }
    },
    stopAutoDown () {
      clearInterval(this.autoDown)
      this.autoDown = ''
    },
    playerAutoDown () {
      if (!this.autoDown) {
        this.autoDown = setInterval(() => {
          if (this.onBlock && this.playerBottom <= this.currentNodeHeight) {
            this.playerBottom = this.currentNodeHeight
          } else {
            this.playerBottom -= 1
          }
        }, 10)
      }
    },
    jumpPlayer (height) {
      this.stopAutoDown()
      this.playerBottom += height
      if (this.jumpTimes > 10) {
        this.jumpTimes = 0
        this.playerAutoDown()
      } else {
        this.jumpTimes++
      }
    },
    voiceChanged () {
      if (this.voice > 3) {
        this.blockPosition++
        this.currentNodeChanged()
        if ((this.inBlock && this.voice > 40) || this.jumpTimes) {
          this.jumpPlayer(parseInt(this.voice / 5))
        }
      }
    },
    stopGetVoiceSize () {
      clearTimeout(this.timer)
    }
  }
}
</script>

<style lang="less">
body{
  margin: 0;
  padding: 0;
  background: #eee;
}
.container{
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.game-container{
  position: relative;
  width: 800px;
  height: 500px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
}
.btn{
  cursor: pointer;
  padding:10px 15px;
  background: #eee;
}
.stop{
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.notice{
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px;
  background: #000;
  font-weight: 100;
  width: 120px;
  color: #fff;
}
.block{
  background: #000;
  float: left;
}
.game-main-window{
  position: absolute;
  height: 100%;
  left: 0;
  right: 0;
  overflow: hidden;
}
.game-wrapper{
  position: relative;
  width: 10000%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  transform: translate(0, 0);
}
.player{
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}
.over-mask{
  position: absolute;
  left: 0;
  top:0;
  background: #000;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all 1s;
}
</style>

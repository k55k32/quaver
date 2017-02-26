<template lang="pug">
.app
  a(href="https://github.com/k55k32/quaver" target="_blank")
    img(style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png")
  .app-container(v-if="isSupport")
    game
  .not-support(v-else) 暂不支持此浏览器，请用谷歌浏览器打开此链接
    a(href="http://www.google.cn/chrome/browser/desktop/index.html", target="_blank") 谷歌浏览器下载地址
</template>

<script>
import AudioAPI from './js/AudioAPI'
import Game from './components/Game'

export default {
  name: 'app',
  components: {Game},
  data () {
    return {
      isSupport: AudioAPI.isSupport,
      timer: '',
      game: {
        voice: 0
      }
    }
  }
}
</script>

<style lang="less">
.fork-me{
  position:fixed;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  a{
    background: #000;
    color: #fff;
    padding: 10px 20px;
    text-decoration: none;
    color: #fff;
  }
}
</style>

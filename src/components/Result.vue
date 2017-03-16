<template>
  <div class="result">
    <h1 v-if="success">投票成功！</h1>
    <h1 v-else>投票失敗...</h1>
    <p>即將在 {{ countDown }} 秒後自動跳到投票頁面</p>
  </div>
</template>

<script>
export default {
  props: ['success'],
  created () {
    this.startTimer()
  },
  watch: {
    '$route': 'resetTimer'
  },
  data () {
    return {
      countDown: 5,
      intervalId: 0
    }
  },
  methods: {
    startTimer () {
      this.intervalId = setInterval(() => {
        this.countDown -= 1
        if (this.countDown <= 0) {
          this.resetTimer()
          this.$router.push({name: 'Voting', params: {questionId: 1}})
        }
      }, 1000)
    },
    resetTimer () {
      clearInterval(this.intervalId)
      this.intervalId = 0
      this.countDown = 5
    }
  }
}
</script>

<style lang="less" scoped>
.result {
  h1 {
    margin-bottom: 20px;
  }
  p {
    margin: 20px 10%;
  }
  text-align: center;
}
</style>

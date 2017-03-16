<template>
  <div class="voting" v-cloak>
    <h1 v-text="title"></h1>
    <p class="explanation"><strong>說明：</strong>請點擊「餐廳名稱」以選擇想投的餐廳 (再點一次取消)，選好後點最下面的「投票」按鈕。</p>
    <p class="explanation">每個人最多 5 票。</p>
    <ul>
      <li is="choice-item" v-for="choiceItem in choiceItems" :choiceItem="choiceItem"></li>
    </ul>
    <div class="footer" @click="vote">
      <span id="vote">投票</span>
    </div>
  </div>
</template>

<script>
import { simpleApi } from '../api'
import router from '../router'
import ChoiceItem from './ChoiceItem'

const MAX_VOTES = 5

export default {
  name: 'Voting',
  components: {
    'choice-item': ChoiceItem
  },
  props: ['questionId'],
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  data () {
    return {
      choiceItems: [],
      title: ''
    }
  },
  methods: {
    confirmVote () {
      return confirm('確定要投票嗎？')
    },
    fetchData () {
      simpleApi(client => client.questions.questions_choices_list({question_pk: this.questionId}), list => {
        this.choiceItems = list
      })
      simpleApi(client => client.questions.questions_read({id: this.questionId}), question => {
        this.title = question.question_text
      })
    },
    votable () {
      let voteCount = this.$children.filter(it => it.checked === true).length
      // Less than or equal is used here because this function is called after a checkbox is clicked
      // Thus its 'checked' property is already set to
      // true.
      return voteCount < MAX_VOTES
    },
    vote () {
      if (!this.confirmVote()) {
        return
      }
      this.voteAllChecked()
        .then(() => router.push({name: 'Result', params: {success: true}}), () => router.push({name: 'Result', params: {success: false}}))
    },
    voteAllChecked () {
      let itemsToVote = this.$children
        .filter(it => it.checked === true)
        .map(it => it.choiceItem.id)
      return Promise.all(
        itemsToVote.map(choiceId => {
          simpleApi(client => client.choices.choices_vote({id: choiceId}))
        }))
    }
  }
}
</script>

<style lang="less" scoped>
@orange: #FF851B;

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.explanation {
  margin: 20px 10%;
}

.footer {
  cursor: pointer;
  text-align: center;
  position: fixed;
  left: 0px;
  bottom: 0px;
  height: 50px;
  width: 100%;
  background: @orange;

  span {
    height: 100%;
    font-size: 1.5em;
  }
}
</style>

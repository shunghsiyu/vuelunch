<template>
  <div class="voting">
    <h2 v-text="title"></h2>
    <ul>
      <li is="choice-item" v-for="choiceItem in choiceItems" :choiceItem="choiceItem"></li>
    </ul>
    <button id="vote" type="button" @click="vote">Vote</button>
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
      return confirm('Proceed with voting?')
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
      return voteCount <= MAX_VOTES
    },
    vote () {
      if (!this.confirmVote()) {
        return
      }
      this.voteAllChecked()
        .then(() => alert('Voting Sucess!'))
        .then(() => router.push('/questions'))
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

<style></style>

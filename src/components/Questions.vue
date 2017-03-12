<template>
  <div class="questions">
    <h1>Questions</h1>
    <ul>
      <li class="voting-link" v-for="question in questions">
        <router-link :to="{name: 'Voting', params: {questionId: question.id}}">
          <span v-text="question.question_text"></span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { simpleApi } from '../api'

export default {
  name: 'Question',
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  data () {
    return {
      questions: []
    }
  },
  methods: {
    fetchData () {
      simpleApi(
        client => client.questions.questions_list(),
        list => {
          this.questions = list
        })
    }
  }
}
</script>

<style scoped>
li {
  list-style: none;
}
</style>

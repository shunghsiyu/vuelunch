<template>
  <li class="choice-item">
    <input type="checkbox" ref="checkbox" @click="onClick">
    <span class="restaurant-name" v-text="restaurant.name" @click="forwardClick"></span>
  </li>
</template>

<script>
import { simpleApi } from '../api'

export default {
  props: ['choiceItem'],
  data () {
    return {
      restaurant: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    onClick (event) {
      if (!this.$parent.votable()) {
        event.preventDefault()
        window.alert('Too many votes!')
      }
    },
    forwardClick (event) {
      this.$refs.checkbox.click()
    },
    fetchData () {
      simpleApi(client => client.restaurants.restaurants_read({id: this.choiceItem.choice}),
      data => {
        this.restaurant = data
      })
    }
  },
  computed: {
    checked () {
      return this.$refs.checkbox.checked
    }
  }
}
</script>

<style scoped>
li {
  list-style: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>

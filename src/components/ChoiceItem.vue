<template>
  <li class="choice-item">
    <input type="checkbox" ref="checkbox" @click="onClick" :id="restaurantNameHash" :name="restaurantNameHash" v-model="checked">
    <label class="restaurant-name" :for="restaurantNameHash" v-text="restaurant.name"></label>
  </li>
</template>

<script>
import { checksum } from '../util'
import { simpleApi } from '../api'

export default {
  props: ['choiceItem'],
  data () {
    return {
      restaurant: {},
      checked: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    onClick (event) {
      if (!this.$parent.votable()) {
        event.preventDefault()
        this.checked = false
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
    restaurantNameHash () {
      return checksum(this.restaurant.name)
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

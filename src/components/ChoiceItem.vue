<template>
  <li v-cloak class="choice-item" :class="{checked: checked}" @click="onClick">
    <span class="restaurant-name" v-text="restaurant.name"></span>
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
      if (this.checked) {
        this.checked = false
      } else if (!this.$parent.votable()) {
        event.preventDefault()
        this.checked = false
        window.alert('不能投那麼多票喔！')
      } else {
        this.checked = true
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

<style lang="less" scoped>
@green: #2ECC40;
@olive: #3D9970;

li {
  list-style: none;
}

.choice-item {
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: center;
  margin: 15px 20%;
  border-radius: 50px;
  padding: 5px 0;
  border: 2px solid @olive;
  color: @olive;

  &.checked {
    border: 2px solid @olive;
    background-color: @olive;
    color: white;

    .restaurant-name:before {
      content: "✓ "
    }
  }
}

.restaurant-name {
  font-size: 1.3em;
}

input {
  display: none;
}
</style>

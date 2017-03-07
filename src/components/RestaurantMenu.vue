<template>
  <div class="restaurant_menu">
    <ul class="menu_items">
      <li v-for="menuItem in menuItems">
        <span class="item_name" v-text="menuItem.name"></span>
        <span class="item_price">
          <span v-text="menuItem.price"></span>
          元
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { simpleApi } from '../api'

export default {
  name: 'RestaurantMenu',
  props: ['restaurantId'],
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  data () {
    return {
      menuItems: []
    }
  },
  methods: {
    fetchData () {
      simpleApi(
        client => client.restaurants.restaurants_menuitems_list({restaurant_pk: this.restaurantId}),
        data => {
          this.menuItems = data
        })
    }
  }
}
</script>

<style scoped>
li {
  list-style: none
}
</style>

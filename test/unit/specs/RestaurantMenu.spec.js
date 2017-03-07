import Vue from 'vue'
import _ from 'lodash'
const RestaurantMenuInjector = require('!!vue-loader?inject!@/components/RestaurantMenu')

describe('RestaurantMenu.vue', function () {
  const props = {
    restaurantId: 1
  }
  let spy = null
  let RestaurantMenu = null
  let vm = null

  beforeEach(function () {
    spy = sinon.spy()
    // Mock the API call
    RestaurantMenu = RestaurantMenuInjector({
      '../api': { simpleApi: spy }
    })
    const Constructor = Vue.extend(RestaurantMenu)
    vm = new Constructor(props)
    vm.$mount()
  })

  it('should have called simpleApi', function () {
    expect(spy).to.have.been.called
  })

  it('should initially have an empty menuItems object', function () {
    expect(vm).to.have.ownProperty('menuItems')
    expect(vm.menuItems).to.eql([])
  })

  it('should correctly display menuIems object', function (done) {
    const menuItems = [
      {
        name: 'Item 1',
        price: 100
      },
      {
        name: 'Item 2',
        price: 0
      }
    ]
    vm.menuItems = menuItems
    Vue.nextTick(() => {
      const menuItemsElement = vm.$el.querySelector('.menu_items')
      expect(menuItemsElement.children).to.have.lengthOf(menuItems.length)
      const menuItemsNames = _.map(
        menuItemsElement.querySelectorAll('.item_name'),
        'textContent'
      )
      expect(menuItemsNames).to.eql(_.map(menuItems, 'name'))
      const menuItemsPrices = _.map(
        menuItemsElement.querySelectorAll('.item_price > span'),
        element => {
          return parseInt(element.textContent)
        }
      )
      expect(menuItemsPrices).to.eql(_.map(menuItems, 'price'))
      done()
    })
  })
})

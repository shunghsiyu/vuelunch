import Vue from 'vue'
import Router from 'vue-router'
const RestaurantsInjector = require('!!vue-loader?inject!@/components/Restaurants')
import _ from 'lodash'

Vue.use(Router)

describe('Restaurants.vue', () => {
  const spy = sinon.spy()
  const Restaurants = RestaurantsInjector({
    '../api': {
      simpleApi: spy
    }
  })

  it('should initially have an empty list of restaurants', () => {
    const Constructor = Vue.extend(Restaurants)
    const vm = new Constructor()
    expect(vm.restaurants).to.have.lengthOf(0)
  })

  it('should have called simpleApi', () => {
    const Constructor = Vue.extend(Restaurants)
    const vm = new Constructor()
    vm.$mount()
    expect(spy).to.have.been.called
  })

  it('should render correct header', () => {
    const Constructor = Vue.extend(Restaurants)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.restaurants h1').textContent)
      .to.equal('Restaurants')
  })

  it('should render the restaurant names correctly', (done) => {
    const routes = [
      {
        path: '/',
        component: Restaurants,
        props: true
      },
      {
        path: '/restaurants/:restaurantId',
        name: 'RestaurantDetail',
        component: {
          render: h => h('div')
        },
        props: true
      }
    ]
    const router = new Router({ routes })
    router.push('/')
    const container = new Vue({
      router,
      render: h => h('router-view')
    }).$mount()
    const vm = container.$children[0]
    const restaurants = [
      { id: 1, name: 'Restaurant 1' },
      { id: 2, name: 'Restaurant 2' },
      { id: 3, name: 'Restaurant 3' }
    ]
    vm.restaurants = restaurants
    Vue.nextTick(() => {
      const detailLinkElements = vm.$el.querySelectorAll('.restaurants .detail-link')
      expect(detailLinkElements).to.have.lengthOf(restaurants.length)
      expect(_.map(detailLinkElements, 'textContent'))
        .to.deep.equal(_.map(restaurants, 'name'))
      done()
    })
  })
})

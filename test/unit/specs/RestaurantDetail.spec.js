import Vue from 'vue'
const RestaurantDetailInjector = require('!!vue-loader?inject!@/components/RestaurantDetail')

describe('RestaurantDetail.vue', function () {
  let spy = null
  let RestaurantDetail = null
  let vm = null
  const props = {
    restaurantId: 1
  }

  beforeEach(function () {
    spy = sinon.spy()
    const injection = {
      '../api': { simpleApi: spy },
      // Replace RestaurantMenu with Div tag
      './RestaurantMenu': {
        functional: true,
        render: h => h('div')
      }
    }
    // Mock the API call
    RestaurantDetail = RestaurantDetailInjector(injection)
    let container = new Vue({
      render: h => {
        return h(RestaurantDetail, { props })
      }
    })
    container.$mount()
    vm = container.$children[0]
  })

  it('should have called simpleApi', function () {
    expect(spy).to.have.been.called
  })

  it('should initially have an empty detail object', function () {
    expect(vm).to.have.ownProperty('detail')
    expect(vm.detail).to.eql({})
  })

  it('should correctly display detail object', function (done) {
    const detail = { name: 'Restaurant 1' }
    vm.detail = detail
    Vue.nextTick(() => {
      const titleElement = vm.$el.querySelector('h1')
      expect(titleElement.textContent).to.equal(detail.name)
      done()
    })
  })
})

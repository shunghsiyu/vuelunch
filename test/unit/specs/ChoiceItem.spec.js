import Vue from 'vue'
const ChoiceItemInjector = require('!!vue-loader?inject!@/components/ChoiceItem')

describe('ChoiceItem.vue', function () {
  let spy = null
  let ChoiceItem = null
  let vm = null

  beforeEach(function () {
    spy = sinon.spy()
    // Mock the API call
    ChoiceItem = ChoiceItemInjector({
      '../api': { simpleApi: spy }
    })
    const Constructor = Vue.extend(ChoiceItem)
    vm = new Constructor()
    vm.$mount()
  })

  it('should have called simpleApi', function () {
    expect(spy).to.have.been.called
  })

  it('should initially have an empty restaurant object', function () {
    expect(vm).to.have.ownProperty('restaurant')
    expect(vm.restaurant).to.eql({})
  })

  it('displays the restaurant name', function (done) {
    const name = 'A Restaurant'
    const restaurant = { name }
    const nameElement = vm.$el.querySelector('.restaurant-name')
    vm.restaurant = restaurant
    Vue.nextTick(() => {
      expect(nameElement.textContent).to.equal(name)
      done()
    })
  })
})

import Vue from 'vue'
const ChoiceItemInjector = require('!!vue-loader?inject!@/components/ChoiceItem')

describe('ChoiceItem.vue', function () {
  let sandbox = null
  let spy = null
  let ChoiceItem = null
  let vm = null

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    spy = sandbox.spy()
    // Mock the API call
    ChoiceItem = ChoiceItemInjector({
      '../api': { simpleApi: spy }
    })
    const Constructor = Vue.extend(ChoiceItem)
    vm = new Constructor()
    vm.$mount()
    vm.$parent = {
      votable: sandbox.stub()
    }
  })

  afterEach(() => {
    sandbox.restore()
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

  describe('Restaurant Name', function () {
    let nameElement = null
    let buttonElement = null

    beforeEach(() => {
      nameElement = vm.$el.querySelector('.restaurant-name')
      buttonElement = vm.$el.querySelector('input[type="checkbox"]')
      sandbox.stub(buttonElement, 'click')
    })
    it('should forward click to Checkbox', function () {
      nameElement.click()
      expect(buttonElement.click).to.have.been.called
    })
  })

  describe('Checkbox', function () {
    let buttonElement = null

    beforeEach(() => {
      buttonElement = vm.$el.querySelector('input[type="checkbox"]')
      // Prevent alert from showing
      sandbox.stub(window, 'alert')
    })

    it('should become checked when clicked if parent is votable', function (done) {
      vm.$parent.votable.returns(true)
      buttonElement.click()
      Vue.nextTick(() => {
        expect(buttonElement.checked).to.be.ok
        done()
      })
    })

    it('should not become checked when clicked if parent is not votable', function (done) {
      vm.$parent.votable.returns(false)
      buttonElement.click()
      Vue.nextTick(() => {
        expect(buttonElement.checked).to.be.not.ok
        done()
      })
    })
  })
})

import Vue from 'vue'
const VotingInjector = require('!!vue-loader?inject!@/components/Voting')

describe('Voting.vue', function () {
  let spy = null
  let Voting = null
  let vm = null
  const props = {
    questionId: 1
  }

  beforeEach(function () {
    spy = sinon.spy()
    const injection = {
      '../api': { simpleApi: spy },
      // Replace ChoiceItem with Div tag
      './ChoiceItem': {
        render: h => h('div', {
          // Give the ChoiceItem stub a CSS class so we can
          // differentiate it from a normal Div tag
          'class': { 'fake_choice_item': true }
        }),
        // Stub the checked value so `votable` method can be
        // checked
        computed: { checked: () => true }
      }
    }
    // Mock the API call
    Voting = VotingInjector(injection)
    sinon.stub(Voting.methods, 'vote')
    let container = new Vue({
      render: h => {
        return h(Voting, { props })
      }
    })
    container.$mount()
    vm = container.$children[0]
  })

  afterEach(function () {
    Voting.methods.vote.restore()
  })

  it('should have called simpleApi', function () {
    expect(spy).to.have.been.called
  })

  it('should initially have an empty choiceItems array', function () {
    expect(vm).to.have.ownProperty('choiceItems')
    expect(vm.choiceItems).to.eql([])
  })

  it('should correctly display choiceItems array', function (done) {
    const choiceItems = [
      {
        id: 1,
        choice: 10,
        votes: 4,
        note: '',
        question: 1
      }
    ]
    vm.choiceItems = choiceItems
    Vue.nextTick(() => {
      const choiceItemElements = vm.$el.querySelectorAll('div.fake_choice_item')
      expect(choiceItemElements).to.have.lengthOf(choiceItems.length)
      done()
    })
  })

  describe('Vote button', function () {
    it('should call vote when clicked', function () {
      let voteButton = vm.$el.querySelector('#vote')
      voteButton.click()
      expect(Voting.methods.vote).to.have.been.called
    })
  })

  describe('Votable method', function () {
    it('should return true when less than 5 items is checked', function (done) {
      const choiceItems = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 }
      ]
      vm.choiceItems = choiceItems
      Vue.nextTick(() => {
        expect(vm.votable()).to.be.ok
        done()
      })
    })

    it('should return false when more than 5 items is checked', function (done) {
      // See comment in Voting.votable() for why votable()
      // return true when there is exactly 5 items.
      const choiceItems = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 }
      ]
      vm.choiceItems = choiceItems
      Vue.nextTick(() => {
        expect(vm.votable()).to.be.not.ok
        done()
      })
    })
  })
})

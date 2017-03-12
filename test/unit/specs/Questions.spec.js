import Vue from 'vue'
import Router from 'vue-router'
const QuestionsInjector = require('!!vue-loader?inject!@/components/Questions')
import _ from 'lodash'

Vue.use(Router)

describe('Questions.vue', () => {
  let spy = null
  let vm = null
  let Questions = null

  beforeEach(() => {
    spy = sinon.spy()
    Questions = QuestionsInjector({
      '../api': {
        simpleApi: spy
      }
    })
    const routes = [
      {
        path: '/',
        component: Questions
      },
      {
        path: '/voting/:questionId',
        name: 'Voting',
        component: {
          render: h => h('div')
        }
      }
    ]
    const router = new Router({ routes })
    let container = new Vue({
      router,
      render: h => {
        return h('router-view')
      }
    })
    container.$mount()
    router.push('/')
    vm = container.$children[0]
  })

  it('should initially have an empty list of questions', () => {
    expect(vm.questions).to.have.lengthOf(0)
  })

  it('should have called simpleApi', () => {
    expect(spy).to.have.been.called
  })

  it('should render correct header', () => {
    expect(vm.$el.querySelector('.questions h1').textContent)
      .to.equal('Questions')
  })

  it('should render the question names correctly', (done) => {
    const questions = [
      { id: 1, question_text: 'Question 1' },
      { id: 2, question_text: 'Question 2' },
      { id: 3, question_text: 'Question 3' }
    ]
    vm.questions = questions
    Vue.nextTick(() => {
      const votingLinkElements = vm.$el.querySelectorAll('.questions .voting-link')
      expect(votingLinkElements).to.have.lengthOf(questions.length)
      expect(_.map(votingLinkElements, 'textContent'))
        .to.deep.equal(_.map(questions, 'question_text'))
      done()
    })
  })
})

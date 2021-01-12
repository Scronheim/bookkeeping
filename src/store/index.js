import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const API_URL = 'http://localhost:3000/api'

export default new Vuex.Store({
  state: {
    categories: [
      {
        id: 1,
        icon: 'mdi-food',
        items: [
          {id: 10, title: 'Необходимая', active: false},
          {id: 11, title: 'Вкусняхи', active: false}
        ],
        title: 'Еда',
      },
      {
        id: 2,
        icon: 'mdi-party-popper',
        items: [
          {id: 20, title: 'Запланированные', active: false},
          {id: 21, title: 'Не запланированные', active: false},
        ],
        title: 'Развлечения',
      },
      {
        id: 3,
        icon: 'mdi-credit-card-outline',
        items: [
          {id: 30, title: 'Кредиты', active: false},
          {id: 31, title: 'Ипотека', active: false},
          {id: 32, title: 'Квартира', active: false},
          {id: 33, title: 'Интернет/тв', active: false},
        ],
        title: 'Платежи',
      },
      {
        id: 4,
        icon: 'mdi-hanger',
        items: [
          {id: 40, title: 'Необходимая', active: false},
          {id: 41, title: 'По приколу :)', active: false}
        ],
        title: 'Одежда',
      },
      {
        id: 5,
        icon: 'mdi-taxi',
        items: [
          {id: 50, title: 'Такси', active: false},
          {id: 51, title: 'Поездки за город', active: false},
          {id: 52, title: 'Путешествия', active: false}],
        title: 'Дорога',
      }
    ],
    expenses: []
  },
  mutations: {
    setExpenses(state, payload) {
      state.expenses = payload
    },
  },
  actions: {
    getExpenses(context) {
      axios.get(`${API_URL}/expenses`).then((response) => {
        context.commit('setExpenses', response.data.results)
      })
    },
    async clearActiveCategories(context) {
      await context.state.categories.forEach((item) => {
        item.items.forEach((child) => {
          child.active = false
        })
      })
    },
    async addExpense(context, payload) {
      return axios.post(`${API_URL}/expenses`, payload)
    }
  },
  modules: {
  },
  getters: {
    categories: state => state.categories,
    expenses: state => state.expenses
  }
})

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const API_URL = 'http://localhost:3000/api'

export default new Vuex.Store({
  state: {
    categories: [],
    incomeSources: [
      {id: 1, title: 'Зарплата'},
      {id: 2, title: 'Премия'},
      {id: 3, title: 'Долг'},
    ],
    expenses: [],
    monthExpenses: [],
    incomes: [],
    monthIncomes: []
  },
  mutations: {
    setExpenses(state, payload) {
      state.expenses = payload
    },
    setIncomes(state, payload) {
      state.incomes = payload
    },
    addCategory(state, payload) {
      state.categories.push(payload)
    },
    addSubCategory(state, payload) {
      state.categories[payload.index].items.push(payload.item)
    },
    setCategories(state, payload) {
      state.categories = payload
    }
  },
  actions: {
    getSettings(context) {
      axios.get(`${API_URL}/settings`).then((response) => {
        let categories = response.data.results.find((x) => {
          return x.title === 'categories'
        }).value

        context.commit('setCategories', JSON.parse(categories))
      })
    },
    saveCategories(context) {
      return axios.patch(`${API_URL}/settings`, {value: JSON.stringify(context.state.categories)})
    },
    getExpenses(context, payload) {
      return axios.get(`${API_URL}/monthExpenses?startDate=${payload.startDate}&endDate=${payload.endDate}`).then((response) => {
        context.commit('setExpenses', response.data.results)
      })
    },
    getIncomes(context, payload) {
      return axios.get(`${API_URL}/monthIncomes?startDate=${payload.startDate}&endDate=${payload.endDate}`).then((response) => {
        context.commit('setIncomes', response.data.results)
      })
    },
    async clearActiveCategories(context) {
      await context.state.categories.forEach((item) => {
        item.items.forEach((child) => {
          child.active = false
        })
      })
    },
    findSubCategoryId(context, id) {
      let result
      context.state.categories.forEach((cat) => {
        let temp = cat.items.find((sCat) => {
          return sCat.id === id
        })
        if (temp) result = true
      })
      return result
    },
    async addExpense(context, payload) {
      return axios.post(`${API_URL}/expenses`, payload)
    },
    async addIncome(context, payload) {
      return axios.post(`${API_URL}/incomes`, payload)
    },
    saveExpense(context, payload) {
      return axios.patch(`${API_URL}/expenses`, payload)
    },
    saveIncome(context, payload) {
      return axios.patch(`${API_URL}/incomes`, payload)
    },
    deleteExpense(context, id) {
      return axios.delete(`${API_URL}/expenses?id=${id}`)
    },
    deleteIncome(context, id) {
      return axios.delete(`${API_URL}/incomes?id=${id}`)
    }
  },
  modules: {
  },
  getters: {
    categories: state => state.categories,
    expenses: state => state.expenses,
    incomes: state => state.incomes,
    incomeSources: state => state.incomeSources
  }
})

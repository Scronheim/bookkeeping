"use strict"
const EXPENSES_TABLE = 'expenses'
const INCOMES_TABLE = 'incomes'
const SETTINGS_TABLE = 'settings'
const moment = require('moment')

class DB {
  constructor() {
    this.db = require('knex')({
      log: {
        warn(message) {
          console.log(message)
        },
        error(message) {
          console.log(message)
        },
      },
      client: 'mysql',
      connection: {
        host: '192.168.24.215',
        user: 'user',
        password: '2360087',
        database: 'bookkeeping',
        dateStrings: 'date'
      },
    });
  }

  selectSettings() {
    return this.db.select().from(SETTINGS_TABLE)
  }

  updateCategories(payload) {
    return this.db(SETTINGS_TABLE).where('id', '=', 1).update(payload)
  }

  selectExpenses() {
    return this.db.select().from(EXPENSES_TABLE).orderBy('id')
  }

  selectMonthExpenses(startDate, endDate) {
    return this.db.select().from(EXPENSES_TABLE).whereBetween('date', [startDate, endDate]).orderBy('date')
  }

  insertExpense(payload) {
    return this.db(EXPENSES_TABLE).insert(payload)
  }

  updateExpense(payload) {
    return this.db(EXPENSES_TABLE).where('id', '=', payload.id).update(payload)
  }

  deleteExpense(id) {
    return this.db(EXPENSES_TABLE).where('id', id).del()
  }

  selectIncomes() {
    return this.db.select().from(INCOMES_TABLE).orderBy('id')
  }

  selectMonthIncomes(startDate, endDate) {
    return this.db.select().from(INCOMES_TABLE).whereBetween('date', [startDate, endDate]).orderBy('date')
  }

  insertIncome(payload) {
    return this.db(INCOMES_TABLE).insert(payload)
  }

  updateIncome(payload) {
    return this.db(INCOMES_TABLE).where('id', '=', payload.id).update(payload)
  }

  deleteIncome(id) {
    return this.db(INCOMES_TABLE).where('id', id).del()
  }
}
module.exports = DB

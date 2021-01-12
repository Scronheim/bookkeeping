"use strict"
const EXPENSES_TABLE = 'expenses'
const INCOMES_TABLE = 'incomes'
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

  selectExpenses() {
    return this.db.select().from(EXPENSES_TABLE).orderBy('id')
  }

  selectMonthExpenses() {
    return this.db.select().from(EXPENSES_TABLE).whereBetween('date', [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]).orderBy('date')
  }

  insertExpense(payload) {
    return this.db(EXPENSES_TABLE).insert(payload)
  }

  selectIncomes() {
    return this.db.select().from(INCOMES_TABLE).orderBy('id')
  }

  selectMonthIncomes() {
    return this.db.select().from(INCOMES_TABLE).whereBetween('date', [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]).orderBy('date')
  }

  insertIncome(payload) {
    return this.db(INCOMES_TABLE).insert(payload)
  }
}
module.exports = DB

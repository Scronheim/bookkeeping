"use strict"
const EXPENSES_TABLE = 'expenses'

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

  selectExpanses() {
    return this.db.select().from(EXPENSES_TABLE).orderBy('id')
  }

  insertExpense(payload) {
    return this.db(EXPENSES_TABLE).insert(payload)
  }
}
module.exports = DB

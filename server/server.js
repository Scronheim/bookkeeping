"use strict";
const express = require('express');
const mysqldb = require('./mysqldb');
const bodyParser = require('body-parser');
const moment = require('moment');

const mysqlDB = new mysqldb();
const app = express();
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/api/monthExpenses', (req, res) => {
  mysqlDB.selectMonthExpenses().then((response) => {
    res.json({results: response})
  })
})

router.get('/api/monthIncomes', (req, res) => {
  mysqlDB.selectMonthIncomes().then((response) => {
    res.json({results: response})
  })
})

router.route('/api/expenses')
  .get((req, res) => {
    mysqlDB.selectExpenses().then((response) => {
      res.json({results: response})
    })
  })
  .post((req, res) => {
    mysqlDB.insertExpense(req.body).then((response) => {
      if (response.length > 0) {
        res.json({success: true})
      } else {
        res.json({success: false})
      }
    })
  })

router.route('/api/incomes')
  .get((req, res) => {
    mysqlDB.selectIncomes().then((response) => {
      res.json({results: response})
    })
  })
  .post((req, res) => {
    mysqlDB.insertIncome(req.body).then((response) => {
      if (response.length > 0) {
        res.json({success: true})
      } else {
        res.json({success: false})
      }
    })
  })

app.use(router)

let port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Express server listening on port ' + port)
});

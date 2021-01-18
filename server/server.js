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

router.route('/api/settings')
  .get((req, res) => {
    mysqlDB.selectSettings().then((response) => {
      res.json({results: response})
    })
  })
  .patch((req, res) => {
    mysqlDB.updateCategories(req.body).then((response) => {
      res.json({results: response})
    })
  })

router.get('/api/monthExpenses', (req, res) => {
  mysqlDB.selectMonthExpenses(req.query.startDate, req.query.endDate).then((response) => {
    res.json({results: response})
  })
})

router.get('/api/monthIncomes', (req, res) => {
  mysqlDB.selectMonthIncomes(req.query.startDate, req.query.endDate).then((response) => {
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
  .patch((req, res) => {
    mysqlDB.updateExpense(req.body).then((response) => {
      if (response === 1) {
        res.json({success: true})
      } else {
        res.json({success: false})
      }
    })
  })
  .delete((req, res) => {
    mysqlDB.deleteExpense(req.query.id).then((response) => {
      res.json({results: response})
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
  .patch((req, res) => {
    mysqlDB.updateIncome(req.body).then((response) => {
      if (response === 1) {
        res.json({success: true})
      } else {
        res.json({success: false})
      }
    })
  })
  .delete((req, res) => {
    mysqlDB.deleteIncome(req.query.id).then((response) => {
      res.json({results: response})
    })
  })

app.use(router)

let port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Express server listening on port ' + port)
});

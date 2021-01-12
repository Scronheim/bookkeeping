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

router.route('/api/expenses')
  .get((req, res) => {

  })
  .post((req, res) => {
    mysqlDB.insertExpanse(req.body).then((response) => {
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

/*
================================================================
    Title: employee-route.js
    Author: Carl Logan
    Date: 03/20/2023
    Description: WEB 450 - nodebucket.
================================================================
*/

const express = require('express');
// the model determines the structure of the data for employee
const Employee = require('../models/employees');

const router = express.Router();

// openapi language used to describe the API via swagger
/**
 * @openapi
 * /api/employees/{id}:
 *   get:
 *     tags:
 *       - nodebucket
 *     operationId: findEmployeeById
 *     description: API to find employees.
 *     summary: returns an object matching the employee ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       '200':
 *         description: Return a employee document.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 empId:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *       '400':
 *         description: Bad request.
 *       '404':
 *         description: Not found.
 *       '500':
 *         description: Server expectations.
 */
router.get('/:id', (req, res, next) => {
  let empId = req.params.id;
  // check empId is a number
  empId = parseInt(empId, 10);

  // if empId is not a number then inform of a "bad request"
  if(isNaN(empId)) {
    const err = new Error('Bad Request');
    err.status = 400;
    next(err);
  }
  else {
    // search the database for the employee id
    Employee.findOne({'empId': req.params.id}, (err, emp) => {
      if(err) {
        // log failure
        console.error('mongodb error: ', err);
        // send the error
        next(err);
      }
      else {
        // log success
        console.log('emp: ', emp)
        // send the record
        res.send(emp);
      }
    })
  }
});

module.exports = router;

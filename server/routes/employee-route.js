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
const { debugLogger, errorLogger } = require('../logs/logger');
const createError = require('http-errors');
const Ajv = require('ajv');
const router = express.Router();

const ajv = new Ajv();
const myFile = 'employee-route.js';

function checkNum(id) {
  id = parseInt(id, 10);
  if(isNaN(id)) {
    const err = new Error('Bad Request');
    err.status = 400;
    console.error('id could not be parsed: ', id);
    errorLogger({filename: myFile, message: `empId could not be parse ${err.message}`});
    return err;
  }
  else {
    return false;
  }
}

const taskSchema = {
  type: 'object',
  properties: {
    text: {type: 'string'}
  },
  required: ['text'],
  additionalProperties: false
}

// openapi language used to describe the API via swagger
/**
 * @openapi
 * /api/employees/{id}:
 *   get:
 *     tags:
 *       - nodebucket
 *     operationId: findEmployeeById
 *     description: API to find employees.
 *     summary: Returns an object matching the employee ID.
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
  // if empId is not a number then inform of a "bad request"
  const err = checkNum(empId);

  if(err === false) {
    // search the database for the employee id
    Employee.findOne({'empId': req.params.id}, (err, emp) => {
      if(err) {
        // log failure
        console.error('mongodb error: ', err);
        errorLogger({filename: myFile, message: `NOT FOUND: ${err.message}`});
        // send the error
        next(err);
      }
      else if('null') {
        console.log(createError(404));
        errorLogger({filename: myFile, message: createError(404)});
        next(createError(404));
      }
      else {
        // log success
        console.log('emp: ', emp)
        debugLogger({filename: myFile, message: emp});
        // send the record
        res.send(emp);
      }
    })
  }
  else {
    console.error('id could not be parse: ', empId);
    errorLogger({filename: myFile, message: `id could not be parsed: ${empId}`});
    next(err);
  }
});

// openapi language used to describe the API via swagger
/**
 * @openapi
 * /api/employees/{id}/tasks:
 *   get:
 *     tags:
 *       - nodebucket
 *     operationId: findAllTasks
 *     description: API to find employee tasks.
 *     summary: Returns an array of tasks matching the employee ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       '200':
 *         description: Return employee tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 empId:
 *                   type: integer
 *                 todo:
 *                   type: array
 *                   items:
 *                     type: string
 *                 done:
 *                   type: array
 *                   items:
 *                     type: string
 *       '400':
 *         description: Bad request.
 *       '404':
 *         description: Not found.
 *       '500':
 *         description: Server expectations.
 */
router.get('/:id/tasks', async(req, res, next) => {
  let empId = req.params.id;

  // check empId is a number
  // if empId is not a number then inform of a "bad request"
  const err = checkNum(empId);

  if(err === false) {
    try {
      const emp = await Employee.findOne({'empId': empId}, 'empId todo done');

      if(emp) {
        console.log(emp);
        debugLogger({filename: myFile, message: emp});
        res.send(emp);
      }
      else {
        console.error(createError(404));
        errorLogger({filename: myFile, message: createError(404)});
        next(createError(404));
      }
    }
    catch(err) {
      errorLogger({filename: myFile, message: errorString});
      next(err);
    }
  }
  else {
    const errorString = `req.params must be a number: ${empId}`;
    console.error(errorString);
    errorLogger({filename: myFile, message: errorString});
    next(err);
  }
});

// openapi language used to describe the API via swagger
/**
 * @openapi
 * /api/employees/{id}/tasks:
 *   post:
 *     tags:
 *       - nodebucket
 *     operationId: createTask
 *     description: Create employee tasks.
 *     summary: Adds a task to the employee todo array.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       description: Create a new task.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Create employee tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 empId:
 *                   type: integer
 *                 todo:
 *                   type: array
 *                   items:
 *                     type: string
 *                 done:
 *                   type: array
 *                   items:
 *                     type: string
 *       '400':
 *         description: Bad request.
 *       '404':
 *         description: Not found.
 *       '500':
 *         description: Server expectations.
 */
router.post('/:id/tasks', async(req, res, next) => {
  let empId = req.params.id;

  // check empId is a number
  // if empId is not a number then inform of a "bad request"
  const err = checkNum(empId);

  if(err === false) {
    try {
      let emp = await Employee.findOne({'empId': empId});
      if(emp) {
        const newTask = req.body;
        const validator = ajv.compile(taskSchema);
        const valid = validator(newTask);
        if(!valid) {
          const err = Error('Bad Request');
          err.status = 400;
          console.error('Bad Request. Unable to validate req.body against the defined schema.');
          errorLogger({filename: myFile, message: errorString});
          next(err);
        }
        else {
          emp.todo.push(newTask);
          const result = await emp.save();
          console.log(result);
          debugLogger({filename: myFile, message: result});
          res.status(204).send();
        }
      }
      else {
        console.error(createError(404));
        errorLogger({filename: myFile, message: createError(404)});
        next(createError(404));
      }
    }
    catch(err) {
      next(err);
    }
  }
  else {
    console.error('req.params.empId must be a number', empId);
    errorLogger({filename: myFile, message: `req.params.empId must be a number ${empId}`});
  }

});

module.exports = router;

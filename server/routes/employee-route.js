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
const BaseResponse = require('../models/base-response')

const ajv = new Ajv();
const myFile = 'employee-route.js';

// const { promisify } = require('util');
// const { create } = require('domain');
// const ac = new(AbortController);
// const { signal } = ac;

// const timeout = promisify(setTimeout);

// setTimeout(() => {
//   ac.abort();
// }, 500);

// router.get('/:id/allTasks', async(req, res, next) => {
//   let empId = req.params.id;
//   empId = checkNum(empId);

//   try {
//     const timer = 1000;
//     await timeout(timer, 'pausing execution', (signal));
//     const emp = await Employee.findOne({'empId': req.params.id});

//     if(emp) {
//       res.send(createError(404));
//       return;
//     }

//   } catch (err) {
//     if(err.code === 'ABORT_ERR') {
//       const err = Error('Abort Error');
//       err.status = 500;
//       next(err);
//       return;
//     }
//     next(err);
//   }
// });

function checkNum(id) {
  parsedID = parseInt(id, 10);
  if(isNaN(parsedID)) {
    const err = new Error('Bad Request');
    err.status = 400;
    console.error('id could not be parsed: ', parsedID);
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

// create a model of what the data needs to look like
const tasksSchema = {
  type: 'object',
  required: ['todo', 'done'],
  additionalProperties: false,
  properties: {
    todo: {
      type: 'array',
      additionalProperties: false,
      items: taskSchema
    },
    done: {
      type: 'array',
      additionalProperties: false,
      items: taskSchema
    }
  }
}

// get tasks from the document array
function getTask(id, tasks) {
  const task = tasks.find(item => item._id.toString() === id);
  return task;
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
router.get('/:id', async(req, res, next) => {
  let empId = req.params.id;
  console.log('empId:', empId);
  // check empId is a number
  // if empId is not a number then inform of a "bad request"
  const err = checkNum(empId);
  console.log('checkNum:', checkNum(empId));

  if(err === false) {
    try {
      const emp = await Employee.findOne({'empId': empId});

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
      errorLogger({filename: myFile, message: err.message});
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

          const task = result.todo.pop();

          const newTaskResponse = new BaseResponse(201, 'Task item added successfully.', {id: task._id});
          res.status(201).send(newTaskResponse);
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

// openapi language used to describe the API via swagger
/**
 * @openapi
 * /api/employees/{id}/tasks:
 *   put:
 *     tags:
 *       - nodebucket
 *     operationId: updateTask
 *     description: Update employee tasks.
 *     summary: Update tasks in the employee todo and done arrays.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       description: Update tasks.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               todo:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *               done:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Update employee tasks.
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
router.put('/:id/tasks', async(req, res, next) => {
  let empId = req.params.id;
  empId = parseInt(empId, 10);

  // check empId is a number
  // if empId is not a number then inform of a "bad request"
  if(isNaN(empId)) {
    const err = new Error('Bad Request');
    err.status = 400;
    console.error('id could not be parsed: ', empId);
    errorLogger({filename: myFile, message: `empId could not be parse ${err.message}`});
    next(createError(400));
    return;
  }

  try {

    // find the document in the database
    let emp = await Employee.findOne({'empId': empId});

    // if its not truthy as a document then inform "not found"
    if(!emp) {
      console.error(createError(404));
      errorLogger({filename: myFile, message: createError(404)});
      next(createError(404));
      return;
    }

    //  get the body and validate the data against the schemas
    const tasks = req.body;
    const validator = ajv.compile(tasksSchema);
    const valid = validator(tasks);

    // if the data doesn't match the model throw a bad request
    if(!valid) {
      const err = Error('Bad Request');
      err.status = 400;
      console.error('Bad Request. Unable to validate req.body schema against taskSchema');
      errorLogger({filename: myFile, message: 'Bad Request. Unable to verify req.body schema against taskSchema'});
      next(err);
      return;
    }

    // set data in the document
    emp.set({
      todo: req.body.todo,
      done: req.body.done
    });

    // save the changes to the document, log the results, and send the okay
    const result = await emp.save();
    console.log(result);
    debugLogger({filename: myFile, message: result});
    res.status(204).send();

  } catch (err) {
    next(err);
  }

});

// openapi language used to describe the API via swagger
/**
 * @openapi
 * /api/employees/{id}/tasks/{taskId}:
 *   delete:
 *     tags:
 *       - nodebucket
 *     operationId: deleteTask
 *     description: Delete employee tasks.
 *     summary: Delete tasks in the employee todo and done arrays.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Delete employee tasks.
 *       '400':
 *         description: Bad request.
 *       '404':
 *         description: Not found.
 *       '500':
 *         description: Server expectations.
 */
router.delete('/:id/tasks/:taskId', async(req, res, next) => {
  let taskId = req.params.taskId;
  let empId = req.params.id;

  // check empId is a number
  // if empId is not a number then inform of a "bad request"
  empId = parseInt(empId, 10);
  if(isNaN(empId)) {
    const err = new Error('Input must be number');
    err.status = 400;
    console.error('req.params.id must be a number: ', empId);
    errorLogger({filename: myFile, message: `req.params.id must be a number: ${empId}`});
    next(err);
    return;
  }

  try {
    // find the document in the database
    let emp = await Employee.findOne({'empId': empId});

    // if its not truthy as a document then inform "not found"
    if(!emp) {
      next(createError(404));
      console.error(createError(404));
      errorLogger({fileName: myFile, message: createError(404)});
      next(err);
      return;
    }

    // retrieve task items
    const todoTask = getTask(taskId, emp.todo);
    const doneTask = getTask(taskId, emp.done);

    // remove tasks
    if(todoTask !== undefined) {
      emp.todo.id(todoTask._id).remove();
    }

    // remove tasks
    if(doneTask !== undefined) {
      emp.done.id(doneTask._id).remove();
    }

    // if there are no tasks to delete then throw an error
    if(todoTask === undefined && doneTask == undefined) {
      const err = new Error('Not Found');
      err.status = 404;
      console.error('TaskId not found', taskId);
      errorLogger({filename: myFile, message: `TaskId not found: ${taskId}`});
      next(err);
      return;
    }

    // save the changes to the document, log the results, and send the okay
    const result = await emp.save();
    debugLogger({filename: myFile, message: result});
    res.status(204).send();
  }
  catch (error) {
    next(err);
  }

});

module.exports = router;

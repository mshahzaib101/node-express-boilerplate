const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const employeesController = require('../../controllers/employees.controller');
const createEmployee = require('../../validations/employees.validation');

const router = express.Router();

router.route('/create').post(auth(), validate(createEmployee.createEmployee), employeesController.createEmployee);
router.route('/:name').delete(auth(), validate(createEmployee.deleteEmployee), employeesController.deleteEmployee);

router.route('/getStatistics').get(auth(), validate(createEmployee.getEmployeesSS), employeesController.getEmployeesSS);
router
  .route('/getStatisticsByDepartment')
  .get(auth(), validate(createEmployee.getEmployeesSS), employeesController.getEmployeesSSByDepartment);
router
  .route('/getStatisticsBySubDepartment')
  .get(auth(), validate(createEmployee.getEmployeesSS), employeesController.getEmployeesSSBySubDepartment);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employees management and statistics
 */

/**
 * @swagger
 * /employees/create:
 *   post:
 *     summary: Create a new employee
 *     description: Only authroized users can create new employees. Each employee should have a unique name.
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - salary
 *               - currency
 *               - department
 *               - sub_department
 *               - on_contract
 *
 *             properties:
 *               name:
 *                 type: string
 *               salary:
 *                 type: number
 *               department:
 *                 type: string
 *               sub_department:
 *                 type: string
 *               on_contract:
 *                 type: boolean
 *               currency:
 *                  type: string
 *                  enum: [USD, INR, EUR]
 *             example:
 *               name: Jane
 *               salary: 24000
 *               department: Engineering
 *               sub_department: Platform
 *               on_contract: true
 *               currency: USD
 *     responses:
 *       "201":
 *         description: Employee added successfully
 */

/**
 * @swagger
 * /employees/{name}:
 *   delete:
 *     summary: Delete an employee
 *     description:  Only authroized users can delete employees. You need to pass the employee name to delete him.
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: User name
 *     responses:
 *       "200":
 *         description: Employee data deleted successfully
 */

/**
 * @swagger
 * /employees/getStatistics:
 *   get:
 *     summary: Get employees salary statistics
 *     description: Only authroized users can use this api to fetch mean, max and min from the employees dataset.
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *         description: currency
 *       - in: query
 *         name: on_contract
 *         schema:
 *           type: boolean
 *         description: on_contract
 *     responses:
 *       "200":
 *         description: stats
 */

/**
 * @swagger
 * /employees/getStatisticsByDepartment:
 *   get:
 *     summary: Get employees salary statistics grouped in departments
 *     description: Only authroized users can use this api to fetch mean, max and min from the employees dataset. The stats will be grouped by the departments.
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *         description: currency
 *       - in: query
 *         name: on_contract
 *         schema:
 *           type: boolean
 *         description: on_contract
 *     responses:
 *       "200":
 *         description: stats
 */

/**
 * @swagger
 * /employees/getStatisticsBySubDepartment:
 *   get:
 *     summary: Get employees salary statistics grouped in sub-departments
 *     description: Only authroized users can use this api to fetch mean, max and min from the employees dataset. The stats will be grouped by the sub departments.
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *         description: currency
 *       - in: query
 *         name: on_contract
 *         schema:
 *           type: boolean
 *         description: on_contract
 *     responses:
 *       "200":
 *         description: stats
 */

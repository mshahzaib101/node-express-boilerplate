const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { employeesDB, addEmployee, deleteEmployee: deleteEmployeeDB } = require('../inMemoryDatabase/employees');

const createEmployee = catchAsync(async (req, res) => {
  //checking duplicates
  let duplicateIndex = employeesDB.findIndex((x) => x.name.toLowerCase() === req.body.name.toLowerCase());
  if (duplicateIndex !== -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee with this name already exits');
  }

  addEmployee(req.body);

  res.status(httpStatus.CREATED).send({ message: 'Employee added successfully' });
});

const getStats = (arr) => {
  let min = Math.min(...arr.map((item) => item.salary));
  let max = Math.max(...arr.map((item) => item.salary));
  let mean = arr.reduce((total, next) => total + next.salary, 0) / arr.length;

  return {
    min,
    max,
    mean,
  };
};

const filterEmployees = (query) => {
  let filteredEmployees = employeesDB.filter(function (item) {
    for (var key in query) {
      if (item[key] === undefined || item[key] != query[key]) return false;
    }
    return true;
  });

  return filteredEmployees;
};

const getEmployeesSS = catchAsync(async (req, res) => {
  let filteredEmployees = filterEmployees(req.query);
  let stats = getStats(filteredEmployees);

  res.send({
    stats: stats,
  });
});

const getEmployeesSSByDepartment = catchAsync(async (req, res) => {
  let filteredEmployees = filterEmployees(req.query);

  let filteredEmployeesByDepartment = {};
  filteredEmployees.map((ele) => {
    if (!filteredEmployeesByDepartment[ele.department]) {
      filteredEmployeesByDepartment[ele.department] = [];
    }
    filteredEmployeesByDepartment[ele.department].push(ele);
  });

  Object.keys(filteredEmployeesByDepartment).map((key) => {
    let stats = getStats(filteredEmployeesByDepartment[key]);
    filteredEmployeesByDepartment[key] = stats;
  });

  res.send({
    stats: filteredEmployeesByDepartment,
  });
});

const getEmployeesSSBySubDepartment = catchAsync(async (req, res) => {
  let filteredEmployees = filterEmployees(req.query);

  let filteredEmployeesByDepartment = {};
  filteredEmployees.map((ele) => {
    if (!filteredEmployeesByDepartment[ele.department]) {
      filteredEmployeesByDepartment[ele.department] = {};
    }
    if (!filteredEmployeesByDepartment[ele.department][ele.sub_department]) {
      filteredEmployeesByDepartment[ele.department][ele.sub_department] = [];
    }
    filteredEmployeesByDepartment[ele.department][ele.sub_department].push(ele);
  });

  Object.keys(filteredEmployeesByDepartment).map((departmentKey) => {
    Object.keys(filteredEmployeesByDepartment[departmentKey]).map((sub_departmentKey) => {
      let stats = getStats(filteredEmployeesByDepartment[departmentKey][sub_departmentKey]);
      filteredEmployeesByDepartment[departmentKey][sub_departmentKey] = stats;
    });
  });

  res.send({
    stats: filteredEmployeesByDepartment,
  });
});

const deleteEmployee = catchAsync(async (req, res) => {
  console.log('delete start');
  let duplicateIndex = employeesDB.findIndex((x) => x.name.toLowerCase() === req.params.name.toLowerCase());
  if (duplicateIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee with this name not exits');
  }
  deleteEmployeeDB(duplicateIndex);
  res.send({ message: 'Employee data deleted successfully' });
});

module.exports = {
  createEmployee,
  getEmployeesSS,
  getEmployeesSSByDepartment,
  getEmployeesSSBySubDepartment,
  deleteEmployee,
};

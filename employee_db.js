var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "",

  // Your password
  password: "",
  database: "employee_db",
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "whatDo",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all employees by Department",
        "View all employees by Manager",
        "View all roles",
        "View all departments",
        new inquirer.Separator(),
        "Add employee",
        "Add role",
        "Add department",
        new inquirer.Separator(),
        "Remove employee",
        "Remove role",
        "Remove department",
        new inquirer.Separator(),
        "Update employee role",
        "Update employee manager",
        new inquirer.Separator(),
        "EXIT",
        new inquirer.Separator(),
      ],
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.whatDo === "View all employees") {
        viewAll();
      } else if (answer.whatDo === "View all employees by Department") {
        viewAllDept();
      } else if (answer.whatDo === "View all employees by Manager") {
        viewAllMgr();
      } else if (answer.whatDo === "View all roles") {
        viewAllRoles();
      } else if (answer.whatDo === "View all departments") {
        viewAllDepts();
      } else if (answer.whatDo === "Add employee") {
        addEmployee();
      } else if (answer.whatDo === "Add department") {
        addDepartment();
      } else if (answer.whatDo === "Add role") {
        addRole();
      } else if (answer.whatDo === "Remove employee") {
        removeEmployee();
      } else if (answer.whatDo === "Remove role") {
        removeRole();
      } else if (answer.whatDo === "Remove department") {
        removeDept();
      } else if (answer.whatDo === "Update employee role") {
        updateRole();
      } else if (answer.whatDo === "Update employee manager") {
        updateMgr();
      } else if (answer.whatDo === "EXIT") {
        connection.end();
      }
    });
}

// functions that add to db start!
// function to add Employee to db
function addEmployee() {
  connection.query("SELECT * FROM jobrole", (err, res) => {
    if (err) throw err;
    const roles = res.map(object => {
      return {
        name: `${object.title}`,
        value: object.id,
      };
    });
    roles.unshift({
      name: "N/A",
      value: null,
    });

    connection.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err;
      const employees = res.map(object => {
        return {
          name: `${object.firstname} ${object.lastname}`,
          value: object.id,
        };
      });
      employees.unshift({
        name: "no manager",
        value: null,
      });
      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?",
          },
          {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?",
          },
          {
            name: "role_id",
            type: "list",
            message: "what is the employee's role?",
            choices: roles,
          },
          {
            name: "manager",
            type: "list",
            message: "Who is the employee's manager?",
            choices: employees,
          },
        ])
        .then(function(answer) {
          console.log(answer);
          // when finished prompting, insert a new item into the db with that info
          connection.query(
            "INSERT INTO employee SET ?",
            {
              firstname: answer.firstName,
              lastname: answer.lastName,
              role_id: answer.role_id,
              manager_id: answer.manager,
            },
            function(err) {
              if (err) throw err;
            },
            start(),
          );
        });
    });
  });
}

// function to add a department to db
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What department would yo like to add?",
      },
    ])
    .then(function(answer) {
      console.table(answer);
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO department SET ?",
        {
          departmentName: answer.department,
        },
        function(err) {
          if (err) throw err;
        },
        start(),
      );
    });
}

// function to add a role to db
function addRole() {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    const departments = res.map(object => {
      return {
        name: `${object.departmentName}`,
        value: object.id,
      };
    });

    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What role would you like to add?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the starting salary for this role?",
        },
        {
          name: "department_id",
          type: "list",
          message: "what department does this role belong to?",
          choices: departments,
        },
      ])
      .then(function(answer) {
        console.log(answer);
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO jobrole SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department_id,
          },
          function(err) {
            if (err) throw err;
          },
          start(),
        );
      });
  });
}
// functions that add to db end!

// functions to view db info start!
// function to view all employees, with name, title, salary, department
function viewAll() {
  // query the database for all employees
  connection.query(
    "SELECT employee.firstname, employee.lastname, jobrole.title, jobrole.salary, department.departmentName FROM employee INNER JOIN jobrole ON employee.role_id = jobrole.id INNER JOIN department ON jobrole.department_id = department.id;",
    function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
    },
  );
}

// view all available roles
function viewAllRoles() {
  connection.query("SELECT title FROM jobrole;", (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
}

// view all available departments
function viewAllDepts() {
  connection.query("SELECT departmentName FROM department;", (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
}

// view all employees and their respective departments
function viewAllDept() {
  // query the database for all employees
  connection.query(
    "SELECT employee.firstname, employee.lastname, department.departmentName FROM employee INNER JOIN jobrole ON employee.role_id = jobrole.id INNER JOIN department ON jobrole.department_id = department.id;",
    function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
    },
  );
}

// view all employees by manager
function viewAllMgr() {
  console.log("!!! This function is under construction !!!");
  start();
  // connection.query(
  //   "SELECT e.id, e.firstname, e.lastname, e.manager_id, m.firstname, m.lastname FROM employee e INNER JOIN employee m ON e.manager_id = m.id ;",

  //   (err, results) => {
  //     if (err) throw err;
  //     console.table(results);
  //     start();
  //   },
  // );
}
// view functions end!

// functions to update existing db items
// update employee role
function updateRole() {
  // collect all available job roles for inquirer below
  connection.query("SELECT * FROM jobrole", (err, res) => {
    if (err) throw err;
    const roles = res.map(object => {
      return {
        name: `${object.title}`,
        value: object.id,
      };
    });
    // collect all available employees for inquirer below
    connection.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err;
      const employees = res.map(object => {
        return {
          name: `${object.firstname} ${object.lastname}`,
          value: object.id,
        };
      });
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Which employee would you like to change roles for?",
            choices: employees,
          },
          {
            name: "newRole",
            type: "list",
            message: "What is the employee's new role?",
            choices: roles,
          },
        ])
        .then(function(answer) {
          // when finished prompting, insert a new item into the db with that info
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: answer.newRole,
              },
              {
                id: answer.employee,
              },
            ],
            function(err) {
              if (err) throw err;
            },
            start(),
          );
        });
    });
  });
}

function updateMgr(){
  console.log("!!! This feature is under construction !!!");
  start();
}

// functions to delete from db
// delete employee
function removeEmployee() {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    const employees = res.map(object => {
      return {
        name: `${object.firstname} ${object.lastname}`,
        value: object.id,
      };
    });
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Which employee would you like to remove?",
          choices: employees,
        },
      ])
      .then(function(answer) {
        connection.query(
          "DELETE FROM employee WHERE ?",
          [
            {
              id: answer.employee,
            },
          ],
          function(err) {
            if (err) throw err;
          },
          console.log("The employee was removed from the database!"),
          start(),
        );
      });
  });
}

// delete role
function removeRole() {
  connection.query("SELECT * FROM jobrole", (err, res) => {
    if (err) throw err;
    const roles = res.map(object => {
      return {
        name: `${object.title}`,
        value: object.id,
      };
    });
    inquirer
      .prompt([
        {
          name: "role",
          type: "list",
          message: "Which role would you like to remove?",
          choices: roles,
        },
      ])
      .then(function(answer) {
        connection.query(
          "DELETE FROM jobrole WHERE ?",
          [
            {
              id: answer.role,
            },
            {
              title: answer.role,
            },
          ],
          function(err) {
            if (err) throw err;
          },
          start(),
        );
      });
  });
}

// delete department
function removeDept() {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    const departments = res.map(object => {
      return {
        name: `${object.departmentName}`,
        value: object.id,
      };
    });
    inquirer
      .prompt([
        {
          name: "department",
          type: "list",
          message: "Which department would you like to remove?",
          choices: departments,
        },
      ])
      .then(function(answer) {
        connection.query(
          "DELETE FROM department WHERE ?",
          [
            {
              id: answer.department,
            },
            {
              departmentName: answer.department,
            },
          ],
          function(err) {
            if (err) throw err;
          },
          start(),
        );
      });
  });
}

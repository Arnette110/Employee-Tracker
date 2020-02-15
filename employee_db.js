var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "mysqlroot",
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
        "Add employee",
        "Remove employee",
        "Update employee role",
        "Update employee manager",
        "View all roles",
        "Add role",
        "Remove role",
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
      } else if (answer.whatDo === "Add employee") {
        addEmployee();
      } else if (answer.whatDo === "Remove employee") {
        removeEmployee();
      } else if (answer.whatDo === "Update employee role") {
        updateRole();
      } else if (answer.whatDo === "Update employee manager") {
        updateMgr();
      } else if (answer.whatDo === "View all roles") {
        viewAllRoles();
      } else if (answer.whatDo === "Add role") {
        addRole();
      } else if (answer.whatDo === "Remove role") {
        removeRole();
      } else {
        connection.end();
      }
    });
}

// function to handle posting new items up for auction
function addEmployee() {
  connection.query(
    "SELECT jobrole.title FROM employee INNER JOIN jobrole ON employee.role_id = jobrole.id",
    (err, result) => {
      if (err) throw err;
      
      result.forEach(element => {
        let title = element.title;
        return title;
      });
      // inquirer
      //   .prompt([
      //     {
      //       name: "firstName",
      //       type: "input",
      //       message: "What is the employee's first name?",
      //     },
      //     {
      //       name: "lastName",
      //       type: "input",
      //       message: "What is the employee's last name?",
      //     },
      //     {
      //       name: "role_id",
      //       type: "list",
      //       message: "what is the employee's role?",
      //       choices: ["HR Lady", "Scientist", "Lawyer"],
      //     },
      //   ])
      //   .then(function(answer) {
      //     // when finished prompting, insert a new item into the db with that info
      //     connection.query(
      //       "INSERT INTO employee SET ?",
      //       {
      //         firstname: answer.firstName,
      //         lastname: answer.lastName,
      //       },
      //       "INSERT INTO jobrole SET ?",
      //       {
      //         jobrole: answer.title,
      //       },
      //       function(err) {
      //         if (err) throw err;
      //         console.log("successfully added an employee");
      //         // re-prompt the user for if they want to bid or post
      //         start();
      //       },
      //     );
      //   });
    }
  );
    
  // "prompt for info about the item being put up for auction"
  
};

function viewAll() {
  // query the database for all items being auctioned
  connection.query(
    "SELECT employee.firstname, employee.lastname, jobrole.title, jobrole.salary, department.departmentName FROM employee INNER JOIN jobrole ON employee.role_id = jobrole.id INNER JOIN department ON jobrole.department_id = department.id;",
    function(err, results) {
      if (err) throw err;
      // console.log(results);
      let db = results;
      // console.log(db);
      console.table(db);
      start();
    }
  );
};

function viewAllDept(){
  connection.query(
    "SELECT employee.firstname, employee.lastname,department.departmentName FROM employee INNER JOIN jobrole ON employee.role_id = jobrole.id INNER JOIN department ON jobrole.department_id = department.id;",
    (err, results) => {
      if (err) throw err;
      console.table(results);
      start();
    }
  );
};

// function viewAllMgr() {
//   connection.query(
//     "SELECT employee.firstname, employee.lastname FROM employee INNER JOIN employee AS manager ON employee.manager_id = employee.id",
//     (err, results) => {
//       if (err) throw err;
//       console.table(results);
//     }
//   );
// }

// function addEmployee() {
//   connection.query(

//   )
// }
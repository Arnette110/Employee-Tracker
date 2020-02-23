DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  departmentName VARCHAR(30) NULL,
  PRIMARY KEY (id)
);
CREATE TABLE jobRole (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,2) NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id),
  PRIMARY KEY (id)
);
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  firstname VARCHAR(30) NOT NULL,
  lastname VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT DEFAULT NULL,
  FOREIGN KEY (role_id) REFERENCES jobRole(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id),
  PRIMARY KEY (id)
);
INSERT INTO department (departmentName)
VALUES ("Human Resources"), ("R&D"), ("Legal");

INSERT INTO jobRole (title, salary, department_id)
VALUES ("HR Admin", 100000, 1), ("Scientist", 60000, 2), ("Lawyer", 5000, 3);

INSERT INTO employee (firstname, lastname, role_id, manager_id)
VALUES ("First", "Employee", 1, null),("Second", "Person", 1, 1),("Third", "Test", 1, 2);
DROP DATABASE IF EXISTS EmpData;
CREATE database EmpData;

USE EmpData;

CREATE TABLE department(
    id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);


CREATE TABLE role(
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(20,2) NOT NULL,
    department_id INT,
    primary key(id),
    foreign key(department_id)
    references department(id) ON DELETE CASCADE
);


CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    foreign key(role_id)
    references role(id) ON DELETE CASCADE,
	foreign key(manager_id)
    references employee(id) ON DELETE SET NULL
);
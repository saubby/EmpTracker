const inquirer = require('inquirer');
const mysql = require("mysql2");
const consoleTable = require('console.table');

const conn = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '$Auban27',
    database: 'empdata',


});

conn.connect(err => {

    if (err) throw err;

    console.log("MySql Connected");

    firstp();

});


function firstp() {
    inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            message: 'Select action you want to be performed:',
            choices: [
                'View all employees',
                'View all departments',
                'View all roles',
                'Add an employee',
                'Add a department',
                'Add a role',
                'Update an employee role',
                'Exit'
            ]
        }
    ])
        .then(response => {
            console.log(response.choice);

            switch (response.choice) {

                case 'View all employees':
                    viewEmployees()
                    break;

                case 'View all departments':
                    viewDepartments()
                    break;

                case 'View all roles':
                    viewRoles()
                    break;

                case 'Add an employee':
                    addEmployee()
                    break;

                case 'Add a department':
                    addDepartment()
                    break;

                case 'Add a role':
                    addRole()
                    break;

                case 'Update an employee role':
                    updateRole()
                    break;

                case 'Exit':
                    conn.end()
                    break;

            }

        })
    //.catch(err =>
    //  console.error(err));
}



function viewEmployees() {
    console.log('Employee View');
    conn.query('SELECT * FROM employee', (error, result) => {
        if (error) throw error;
        console.table(result);
        firstp();
    })
};

function viewDepartments() {
    //console.log("Department View");
    conn.query('SELECT * FROM department', (error, result) => {
        if (error) throw error;
        console.table(result);
        firstp();
    })

};


function viewRoles() {
    //console.log("Role View");
    conn.query('SELECT * FROM role', (error, result) => {
        if (error) throw error;
        console.table(result);
        firstp();
    })
};



async function addEmployee() {
    const [roles] = await conn.promise().query("SELECT * FROM role")
    let rolearr = roles.map(role => (
        {
            name: role.title,
            value: role.id
        }
    ))

    const [employees] = await conn.promise().query("SELECT * FROM employee")
    let managerarr = employees.map(employee => (
        {
            name: employee.first_name + " " + employee.last_name,
            value: employee.id
        }
    ))

    inquirer.prompt([

        {
            name: 'firstName',
            type: 'input',
            message: 'Enter first name of an employee:'
        },

        {
            name: 'lastName',
            type: 'input',
            message: 'Enter last name of an employee'
        },

        {
            name: 'role',
            type: 'list',
            message: 'Select employee role',
            choices: rolearr
        },

        {
            name: 'manager',
            type: 'list',
            message: 'Select manager.',
            choices: managerarr
        }

    ])
    .then(function (response) {
        conn.query("INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?, ?, ?, ?)",
        [response.firstName, response.lastName, response.role, response.manager], 
        function (error) {
            if (error) throw error;
            console.log('The new employee entered has been added successfully to the database.');

            conn.query(`SELECT * FROM employee`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    firstp();
                }
                console.table(result);
                firstp();
            });
        })
});
}



function addDepartment() {

    inquirer.prompt([

        {
            type: "input",
            name: "adddept",
            message: "Enter department name you want to add."
        },

    ]).then(result => {
        conn.query(`INSERT INTO department(department_name) VALUE(?)`,
            result.adddept,
            (err, res) => {
                if (err) {
                    console.log(err)
                }
                else {
                    conn.query(`SELECT * FROM department`,
                        (err, res) => {
                            err ? console.error(err) : console.table(res);
                            firstp();
                        })
                }
            })
    })
}


async function addRole() {

    const [addroles] = await conn.promise().query("SELECT * FROM role")
    let addrolearr = addroles.map(role => (
        {
            name: role.title,
            value: role.id
        }
    ))

    const [departments] = await conn.promise().query("SELECT * FROM department")
    let deptarr = departments.map(department => (
        {
            name: department.department_name,
            value: department.id
        }
    ))

    //conn.query("SELECT role.title AS title, role.salary AS salary, role.department_id AS department_id  FROM role", function (err, res) {
        inquirer.prompt([
            {
                name: "title",
                type: "list",
                message: "What is the title of the role?",
                choices: addrolearr
            },
            {
                name: "salary",
                type: "input",
                message: "What is the Salary fot this role?"

            },
            {
                name: "department_name",
                type: "list",
                message: "Enter the department name for this role",
                choices: deptarr
                
            }

        ]).then(function (res) {
            conn.query("INSERT INTO role SET ?",
                {
                    title: res.title,
                    salary: res.salary,
                    department_id: res.department_id
                },
                function (err) {
                    if (err) throw err
                    console.table(res);
                    firstp();
                }
            )
        });
    }
   // )
//}

function updateRole() {

    inquirer.prompt([

        {
            type: "input",
            name: "first_name",
            message: "Enter first name of an employee you want to update."
        },
        {
            type: "input",
            name: "role_id",
            message: "Enter role id of an employee to be updated."
        }

    ]).then(result => {

        conn.query(`UPDATE Employee SET role_id =? WHERE first_name =?`,
            [result.role_id, result.first_name],

            function (err, data) {
                if (err) throw err;
                console.log('Role is updated successfully');

                conn.query(`SELECT * FROM Employee`, (err, res) => {
                    if (err) {
                        res.status(500).json({ err: err.message })
                        startPrompt();
                    }
                    console.table(result);
                    firstp();
                });
            })
    })
}


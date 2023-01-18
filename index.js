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
                viewEmployees();
                break;

            case 'View all departments':
                viewDepartments();
                break;

            case 'View all roles':
                viewRoles();
                break;

            case 'Add an employee':
                addEmployee();
                break;

            case 'Add a department':
                addDepartment();
                break;

            case 'Add a role':
                addRole();
                break;

            case 'Update an employee role':
                updateRole();
                break;

            case 'Exit':
                conn.end();
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



function addEmployee() {

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
            message: 'Enter role',
            //choices: getRoles()
        },

        {
            name: 'manager',
            type: 'list',
            message: 'Select manager',
            //choices: getManagers()
        }

    ])
        .then(response => {

            conn.query('INSERT INTO employee SET ?', {
                first_name: response.firstName,
                last_name: response.lastName,
                role_id: response.role,
                manager_id: response.manager
        },
        
            (err, res) => {
                if (err) throw err;
                // {
                  //  console.log(err)
                //}

                //else {
                   // conn.query = 'SELECT * FROM Employee',  (err, res) => {
                     //       if (err) throw err; 
                       //     console.table(res);
                            firstp();
                        }
                //}
            )
    })
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


function addRole() {
    

    const choicedept = () =>
        conn.promise().query(`SELECT * FROM department`)
            .then((rows) => {
                let arraynm = rows[0].map(obj => obj.name);
                return arraynm
            })
    inquirer.prompt([

        {
            type: "input",
            name: "title",
            message: "Enter name of new role"
        },

        {
            type: "input",
            name: "salary",
            message: "Enter salary for this role"
        },

        {
            type: "choice",
            name: "department_id",
            message: "Department id for this role is?",
            choice: choicedept()
        }
    ]).then(result => {
        conn.promise().query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", 
        [result.title, result.salary, result.department_id])

            /*.then(ans => {
                let mapId = ans[0].map(obj => obj.id);
                return mapId[0]
            })*/

            .then((mapId) => {
                conn.promise().query(`INSERT INTO role(title, salary, department_id) VALUE(?,?,?)`,
                    [result.title, result.salary, mapId]);
                firstp()
            })
    })
}

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


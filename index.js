const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

require('dotenv').config()

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const questions = [
    {
        type: 'rawlist',
        name: 'choose',
        messageL: 'What would you like to do?',
        choices: ['View All Employees',
            'View All Roles',
            'View All Departments',
            'View Employees By Manager',
            'View Employees By Department',
            'View Department Budgets',
            'Add Employee',
            'Add Role',
            'Add Department',
            'Update An Employee Role',
            'Update An Employee Manager',
            'Delete A Employee',
            'Delete A Role',
            'Delete A Department',
            'Exit']
    }
];

//cover title
init = () =>{

    console.log('\x1b[33m%s\x1b[0m','*---------------------------------*')
    console.log('\x1b[33m%s\x1b[0m','|                                 |')
    console.log('\x1b[33m%s\x1b[0m','|        EMPLOYEE TRACKER         |')
    console.log('\x1b[33m%s\x1b[0m','|                                 |')
    console.log('\x1b[33m%s\x1b[0m','*---------------------------------*')

    userChoose()
}



userChoose = () =>{

    inquirer.prompt(questions)
    .then((answers) => {

        const { choose } = answers; 

        if (choose === "View All Employees") {
            ViewEmployee();
        }

        if (choose === "View All Roles") {
            ViewRoles();
        }

        if (choose === "View All Departments") {
            ViewDepartments();
        }

        if (choose === "View Employees By Manager") {
            ViewEmployeeM();
        }

        if (choose === "View Employees By Department") {
            ViewEmployeeD();
        }

        if (choose === "View Department Budgets") {
            ViewBudgets();
        }

        if (choose === "Add Employee") {
            AddEmployee();
        }

        if (choose === "Add Role") {
            AddRole();
        }

        if (choose === "Add Department") {
            AddDepartment();
        }

        if (choose === "Update An Employee Role") {
            UpdateRole();
        }

        if (choose === "Update An Employee Manager") {
            UpdateManager();
        }

        if (choose === "Delete A Employee") {
            DeleteEmployee();
        }

        if (choose === "Delete A Role") {
            DeleteRole();
        }

        if (choose === "Delete A Department") {
            DeleteDepartment();
        }

        if (choose === "Exit") {
            connection.end()
        }

    });
};


ViewEmployee = () =>{
    console.log('All Employees: \n');
    const sql = `SELECT employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS department,
    role.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`

    connection.query(sql, (err, res) => {
        if (err) throw err; 
        console.table(res);
        userChoose();
    });
};

ViewRoles=()=>{
    console.log('All Roles: \n');
    const sql =`SELECT role.title, 
    role.id, 
    department.name AS department, 
    role.salary
    FROM role
    INNER JOIN department ON role.department_id = department.id`

    connection.query(sql, (err, res) => {
        if (err) throw err; 
        console.table(res);
        userChoose();
    });
};

ViewDepartments=()=>{
    console.log('All Departments: \n');
    const sql =`SELECT * FROM department`

    connection.query(sql, (err, res) => {
        if (err) throw err; 
        console.table(res);
        userChoose();
    });
};

ViewEmployeeM = () =>{
    console.log('View Employees by Manager: \n');
    const sql = `SELECT CONCAT (employee.first_name, " ", employee.last_name) AS employee_Name,
    CONCAT (manager.first_name, " ", manager.last_name) AS Manager_Name
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    INNER JOIN employee manager ON employee.manager_id = manager.id`

    connection.query(sql, (err, res) => {
        if (err) throw err; 
        console.table(res);
        userChoose();
    });
}

ViewEmployeeD = () => {
    console.log('View Employees by Department: \n');
    const sql = `SELECT department.name AS department,
    CONCAT(employee.first_name, " ", employee.last_name) AS employee_Name
    FROM employee
    join role on employee.role_id = role.id
    join department on role.department_id = department.id`

    connection.query(sql, (err, res) => {
        if (err) throw err; 
        console.table(res);
        userChoose();
    });

}

ViewBudgets = () =>{
    console.log('Department Budgets: \n');
    const sql = `SELECT 
    department.name AS department,
    SUM(salary) AS budget
    FROM role  
    JOIN department ON role.department_id = department.id GROUP BY department_id`;

    connection.query(sql, (err, res) => {
    if (err) throw err; 
    console.table(res);

    userChoose();
    });
};

AddEmployee = () =>{
    inquirer.prompt([
        {
            type: 'input',
            name: 'fistName',
            message: "Please enter the employee's first name:",
            validate: value => {
                if (value) {
                    return true;
                } else {
                    console.log('(Request information😳) Please enter the first name of this employee');
                    return false;
                }
            }
        },

        {
            type: 'input',
            name: 'lastName',
            message: "Please enter the employee's last name:",
            validate: value => {
                if (value) {
                    return true;
                } else {
                    console.log('(Request information😳) Please enter the last name of this employee');
                    return false;
                }
            }
        },
    ])
    .then(answers =>{
        const newData = [answers.fistName, answers.lastName]
        const sql =`SELECT role.title, role.id FROM role`;

        connection.query(sql,(err,res)=>{
           if (err) throw err;

           const roles =res.map(({title,id})=>({name:title, value:id}));

           inquirer.prompt([
            {
                type: 'rawlist',
                name: 'role',
                message: "Please choose the role for this employee",
                choices: roles  
            }
           ])
           .then(answer=>{
                const role = answer.role
                newData.push(role);

                inquirer.prompt([
                    {
                        type:'confirm',
                        name:'hasManager',
                        message:'Does this employee has manager?'
                    }
                   ])
                   .then( answer =>{
                    // console.log(answer)
                    if(answer.hasManager){
                        const sql = `SELECT * FROM employee`;

                        connection.query(sql,(err,res)=>{
                            if(err) throw err
                            const employee = res.map(({ first_name, last_name,id})=>({
                                name:`${first_name} ${last_name}`, value:id
                            }))

                        inquirer.prompt([
                                {
                                    type: 'rawlist',
                                    name: 'manager',
                                    message: "Please choose the manager for this employee",
                                    choices: employee 
                                }
                            ])
                            .then(answer=>{
                                const m_id = answer.manager
                                newData.push(m_id);

                                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                VALUES (?, ?, ?, ?)`;
                
                                connection.query(sql,newData,(err,res)=>{
                                    if (err) throw err
                                    console.log('Employee has been added')
                                
                                ViewEmployee();

                                })

                            })
                        })
                    }
                    else{
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, NULL)`;
        
                        connection.query(sql,newData,(err,res)=>{
                            if (err) throw err
                            console.log('Employee has been added')
                        
                        ViewEmployee();
                        })
                    }
                   }
                    
                   )
           })


        })

    })
};

AddRole = () =>{
    inquirer.prompt([
        {
            type: 'input', 
            name: 'role',
            message:'Please enter a role that you want to add:',
            validate: value => {
                if (value) {
                    return true;
                } else {
                    console.log('(Request information😳) Please enter the role');
                    return false;
                }
            }
        },
        {
            type: 'input', 
            name: 'salary',
            message:'Please enter the salary of this role:',
            validate: value => {
                if (value) {
                    return true;
                } else {
                    console.log('(Request information😳) Please enter the salary');
                    return false;
                }
            }
        }

    ])
    .then(answer=>{
        const newData = [answer.role,answer.salary];

        const sql = `SELECT * FROM department`

        connection.query(sql,(err,res)=>{
            if(err)throw err;
            const department = res.map(({id,name})=>({name:name,value:id}))

            inquirer.prompt([
                {
                    type:'rawlist',
                    name:'department',
                    message:'Please choose the department for this role:',
                    choices:department
                }
            ])
            .then(answer=>{
                const dChoose = answer.department;
                newData.push(dChoose);

                const sql =`INSERT INTO role (title, salary, department_id) 
                VALUES (?, ?, ?)`

                connection.query(sql,newData,(err,res)=>{
                    if(err)throw err;
                    console.log('The role has been added')
                    ViewRoles();
                })
            })
        })
    })
};

AddDepartment = () =>{
    inquirer.prompt([
        {
            type: 'input', 
            name: 'department',
            message:'Please enter the department that you want to add:',
            validate: value => {
                if (value) {
                    return true;
                } else {
                    console.log('(Request information😳) Please enter the department');
                    return false;
                }
            }
        }

    ])
    .then(answer=>{
        const newData = [answer.department];

        const sql = `INSERT INTO department (name) VALUES (?)`

        connection.query(sql,newData,(err,res)=>{
            if(err)throw err;
            console.log('The department has been added')
            ViewDepartments();
        })
    })
};

DeleteEmployee = () =>{
    const sql = `SELECT * FROM employee`

    connection.query(sql,(err,res)=>{
        if(err) throw err
        const employee = res.map(({id,first_name,last_name})=>({name:`${first_name} ${last_name}`, value:id}))

        inquirer.prompt([
            {
                type:'rawlist',
                name:'eName',
                message:'Please choose which employee you want to delete:',
                choices:employee
            }
        ])
        .then(answer=>{
            const eName= answer.eName;

            const sql =`DELETE FROM employee WHERE id = ?`

            connection.query(sql,eName,(err,res)=>{
                if(err) throw err
                console.log('The Employee has been deleted')
                ViewEmployee();
            })
        })
    })
};

DeleteRole= () =>{
    const sql = `SELECT * FROM role`

    connection.query(sql,(err,res)=>{
        if(err) throw err
        const role = res.map(({id,title})=>({name:title, value:id}))

        inquirer.prompt([
            {
                type:'rawlist',
                name:'role',
                message:'Please choose which role you want to delete:',
                choices:role
            }
        ])
        .then(answer=>{
            const role= answer.role;

            const sql =`DELETE FROM role WHERE id = ?`

            connection.query(sql,role,(err,res)=>{
                if(err) throw err
                console.log('The role has been deleted')
                ViewRoles();
            })
        })
    })
};

DeleteDepartment= () =>{
    const sql = `SELECT * FROM department`

    connection.query(sql,(err,res)=>{
        if(err) throw err
        const department = res.map(({id,name})=>({name:name, value:id}))

        inquirer.prompt([
            {
                type:'rawlist',
                name:'department',
                message:'Please choose which department you want to delete:',
                choices:department
            }
        ])
        .then(answer=>{
            const department= answer.department;

            const sql =`DELETE FROM department WHERE id = ?`

            connection.query(sql,department,(err,res)=>{
                if(err) throw err
                console.log('The department has been deleted')
                ViewDepartments();
            })
        })
    })
};

UpdateRole = () =>{
    const sql = `SELECT * FROM employee`

    connection.query(sql,(err,res)=>{
        if(err) throw err
        const employee = res.map(({id,first_name,last_name})=>({name:`${first_name} ${last_name}`, value:id}))
        inquirer.prompt([
            {
              type: 'rawlist',
              name: 'eName',
              message: `Please choose which employee's role you want to update:`,
              choices: employee
            }
          ])
        .then(answer=>{
            const eName = answer.eName
            const newData = []
            newData.push(eName);
    
            const sql = `SELECT * FROM role`
    
            connection.query(sql, (err, data) => {
                if (err) throw err; 
      
                const roles = data.map(({ id, title }) => ({ name: title, value: id }));
                
                  inquirer.prompt([
                    {
                      type: 'rawlist',
                      name: 'role',
                      message: `Please choose the new role for this employee`,
                      choices: roles
                    }
                  ])
                      .then(answer => {
                      const role = answer.role;
                      newData.push(role); 
                      
                      let e_id = newData[0]
                      console.log(newData)
                      newData[0] = role
                      console.log(newData)
                      newData[1] = e_id 
                      console.log(newData)
                      
      
                      const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
      
                      connection.query(sql, newData, (err, result) => {
                        if (err) throw err;
                      console.log("The employee has been updated!");
                    
                      ViewEmployee();
            })

            })
          })
        })
        
    })
};
UpdateManager = () =>{
    const sql = `SELECT * FROM employee`

    connection.query(sql,(err,res)=>{
        if(err) throw err
        const employee = res.map(({id,first_name,last_name})=>({name:`${first_name} ${last_name}`, value:id}))
        inquirer.prompt([
            {
              type: 'rawlist',
              name: 'eName',
              message: `Please choose which employee's manager you want to update:`,
              choices: employee
            }
          ])
        .then(answer=>{
            const eName = answer.eName
            const newData = []
            newData.push(eName);
    
            const sql = `SELECT * FROM employee`
    
            connection.query(sql, (err, data) => {
                if (err) throw err; 
      
                const manger = data.map(({id,first_name,last_name})=>({name:`${first_name} ${last_name}`, value:id}));
                
                  inquirer.prompt([
                    {
                        type: 'rawlist',
                        name: 'manager',
                        message: "Please choose the manager for this employee",
                        choices: manger 
                    }
                  ])
                      .then(answer => {
                      const manger = answer.manager;
                      newData.push(manger); 
                      
                      let e_id = newData[0]
                      console.log(newData)
                      newData[0] = manger
                      console.log(newData)
                      newData[1] = e_id 
                      console.log(newData)
                      
      
                      const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
      
                      connection.query(sql, newData, (err, result) => {
                        if (err) throw err;
                      console.log("The employee's manager has been updated!");
                    
                      ViewEmployee();
            })

            })
          })
        })
        
    })
};



init();

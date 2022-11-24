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

        if (choose === "Update An Employee Manager") {
            UpdateManager();
        }

        if (choose === "Update An Employee Manager") {
            UpdateManager();
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
    console.log('Employees: \n');
    const query = ``

}


const inquirer = require('inquirer');

const mysql = require('mysql2');

const questions = [
    {
        type:'list',
        name:'choose',
        messageL:'What would you like to do?',
        choices:['View All Employees','Add Employee','View all Roles','Add Role','View All Departments','Add Department','Update An Employee Role','Exit']
    }
];

inquirer.prompt(questions)
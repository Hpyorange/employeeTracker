INSERT INTO department (name)
VALUES
('Marketing'),
('IT'),
('Sales'),
('Finance');

INSERT INTO role (title,salary,department_id)
VALUES
('Product Manager', 120000,1),
('Senior UI/UX Designer',96250,1),
('Marketing Specialist',58000,1),
('Front-End Developer',77495,2),
('Back-End Developer',81342,2),
('Full Stack Developer',82695,2),
('Sales Manager',83460,3),
('Sales Executive',66652,3),
('Financial Manager',95839,4),
('Financial Analyst',67045,4),
('Accountant',65388,4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Jasper','Cheng',4,NULL),
('Alfred','Hayward',1,1),
('Jack','Song',2,NULL),
('Joshua','Robert',3,NULL),
('Mario','Burke',5,NULL),
('Don','Ahmad',7,7),
('Darren','Wolfe',9,9),
('Micheal','Samson',8,NULL),
('Norman','Ford',8,NULL),
('Austin','Coates',10,NULL),
('Helen','Carey',11,NULL);












INSERT INTO department(department_name) VALUES
('Management'), ('HR'), ('Admin'), ('Reception'), ('Technical');

INSERT INTO role(title, salary, department_id) VALUES
('Manager',34555,1),
('Team Lead',70000,2),
('CEO',500000,1),
('Sr. Developer',50000,5),
('Jr. Developer',35000,5),
('Intern',15000,5),
('Receptionist',30000,4),
('Admin',35000,3),
('HR',40000,2);

INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES
('Alemin','Malek',1,null),
('Sauban','Malek',2,1),
('Arsh','Malek',3,1),
('Sahewin','Pataudi',4,1),
('Harsh','Beniwal',4,null),
('Janvi','Patel',5,null),
('Mittal','Purshottam',6,1),
('Gokul','Prajapati',7,null),
('Vivek','Sharma',8,null),
('Arti','Bhatt',9,1),
('Ovesh','Khan',6,null),
('Sahil','Rana',6,null),
('Hussain','Memon',6,null),
('Smith','Panchal',6,null),
('Salmaan','Pathan',6,1);
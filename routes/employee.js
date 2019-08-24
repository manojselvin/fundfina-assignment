const express = require('express');
const router = express();
const {check, validationResult} = require('express-validator');
 
router.set('view engine', 'ejs');
// SHOW LIST OF EMPLOYEES
router.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM employees ORDER BY id DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('employee/list', {
                    title: 'Employees List', 
                    data: ''
                })
            } else {
                // render to views/employee/list.ejs template file
                res.render('employee/list', {
                    title: 'Employees List', 
                    data: rows
                })
            }
        })
    })
})
 
// SHOW ADD EMPLOYEE FORM
router.get('/add', function(req, res, next){    
    // render to views/employee/add.ejs
    res.render('employee/add', {
        title: 'Add New Employees',
        name: '',
        age: '',
		email: '',
		salary: '',
		dept: ''        
    })
})
 
// ADD NEW EMPLOYEE POST ACTION
router.post('/add', [
	check('name', 'Employee Name is required').not().isEmpty(),
    check('age', 'Employee Age is required').not().isEmpty(),
    check('email', 'Employee valid email is required').isEmail(),
    check('salary', 'Employee salary is required').not().isEmpty(),
    check('dept', 'Employee Dept is required').not().isEmpty(),
 
], function(req, res, next){    
    
	var errors = validationResult(req).array();
	
    if( errors.length == 0 ) {   //No errors
        let employee = {
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            salary: req.body.salary,
            dept: req.body.dept
        };
        
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO employees SET ?', employee, function(err, result) {
				//if(err) throw err
				console.log(err, error, result);
                if (err) {
					console.log("Manoj", err);
                    req.flash('error', err)
                    
                    // render to views/employee/add.ejs
                    res.render('employee/add', {
                        title: 'Add New Employees',
                        name: employee.name,
                        age: employee.age,
                        email: employee.email,                    
                        salary: employee.salary,                    
                        dept: employee.dept,                    
                    })
                } else {                
                    req.flash('success', 'Employee added!')
                    
                    // render to views/employee/add.ejs
                    res.render('employee/add', {
                        title: 'Add New Employees',
                        name: '',
                        age: '',
						email: '',
						salary: '',
						dept: ''                    
                    })
                }
            })
        })
    }
    else {   //Display other errors
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        res.render('employee/add', { 
            title: 'Add New Employees',
            name: req.body.name,
            age: req.body.age,
			email: req.body.email,
			salary: req.body.salary,
            dept: req.body.dept
        })
	}
})
 
// SHOW EDIT FORM
router.get('/edit/:id', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM employees WHERE id = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err
            
            // if employee not found
            if (rows.length <= 0) {
                req.flash('error', 'Employees not found with id = ' + req.params.id)
                res.redirect('/employees')
            }
            else { // if employee found
                // render to views/employee/edit.ejs template file
                res.render('employee/edit', {
                    title: 'Edit Employees', 
                    //data: rows[0],
                    id: rows[0].id,
                    name: rows[0].name,
                    age: rows[0].age,
					email: rows[0].email,      
					salary: rows[0].salary,               
					dept: rows[0].dept,               
                })
            }            
        })
    })
})
 
// EDIT EMPLOYEE POST ACTION
router.post('/edit/:id', [
	[
		check('name', 'Employee Name is required').not().isEmpty(),
		check('age', 'Employee Age is required').not().isEmpty(),
		check('email', 'Employee valid email is required').isEmail(),
		check('salary', 'Employee salary is required').not().isEmpty(),
		check('dept', 'Employee Dept is required').not().isEmpty(),
	 
	]
],  function(req, res, next) {
 
	var errors = validationResult(req).array();

	if(errors.length == 0 ) {   //No errors

        let employee = {
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            salary: req.body.salary,
            dept: req.body.dept
        };

        req.getConnection(function(error, conn) {
            conn.query('UPDATE employees SET ? WHERE id = ' + req.params.id, employee, function(err, result) {
                //if(err) throw err
                if (err) {
					req.flash('error', err)
					console.log(err);
                    
                    // render to views/employee/add.ejs
					res.render('employee/add', {
                        title: 'Add New Employees',
                        name: employee.name,
                        age: employee.age,
                        email: employee.email,                    
                        salary: employee.salary,                    
                        dept: employee.dept,                    
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')
                    
                    // render to views/employee/add.ejs
                    res.render('employee/edit', {
                        title: 'Edit Employees',
                        id: req.params.id,
                        name: req.body.name,
						age: req.body.age,
						email: req.body.email,
                        salary: req.body.salary,
                        dept: req.body.dept
                    })
                }
            })
        })
    }
    else {   //Display errors to employee
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
    
        res.render('employee/edit', { 
            title: 'Edit Employees',            
            id: req.params.id,
			name: req.body.name,
			age: req.body.age,
			email: req.body.email,
			salary: req.body.salary,
			dept: req.body.dept
        })
    }
})
 
// DELETE EMPLOYEE
router.post('/delete/(:id)', function(req, res, next) {
    var employee = { id: req.params.id }
    
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM employees WHERE id = ' + req.params.id, employee, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to employees list page
                res.redirect('/employees')
            } else {
                req.flash('success', 'Employees deleted successfully! id = ' + req.params.id)
                // redirect to employees list page
                res.redirect('/employees')
            }
        })
    })
})
 
module.exports = router;
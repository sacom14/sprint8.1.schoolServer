const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

app.use(bodyParser.json());

const PORT = 4000;

const connection = mysql.createConnection(
    {
        host: 'localhost',
        database: 'school',
        user: 'root',
        password: '',
    }
);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});

connection.connect(error => {
    if (error) throw error
    console.log("Conexión exitosa a la base de datos");
});

app.get('/', (req, res) => {
    res.send('API');
});

//endpoints
//obtener lista de estudiantes
app.get('/api/student', (req, res) => {
    const query = `SELECT * FROM school.student`
    connection.query(query, (error, result) => {
        if (error) return console.log(error.message);

        if (result.length > 0) {
            res.json(result);
        } else {
            res.json('No hay registros')
        }
    });
});

//obtener con id
app.get('/api/student/:id', (req, res) => {
    const { id } = req.params //desestructuramos el id que recibimos

    const query = `SELECT * FROM school.student WHERE id_Student = ${id}`;
    connection.query(query, (error, result) => {
        if (error) return console.log(error.message);

        if (result.length > 0) {
            res.json(result);
        } else {
            res.json('No hay registros con ese id')
        }
    })
});

//agregar estudiantes
app.post('/api/student/add', (req, res) => {
    const student = {
        name_Student: req.body.name_Student,
        last_Name_Student: req.body.last_Name_Student,
        class_Student: req.body.class_Student,
        email_Student: req.body.email_Student,
        dni_Student: req.body.dni_Student,
        birthdate_Student: req.body.birthdate_Student,
    }

    const query = `INSERT INTO school.student SET ?`
    connection.query(query, student, (error, result) => {
        if (error) return console.log(error.message);

        res.json(`Se añadió correctament el estudiante`)
    })
});

//update student
app.put('/api/student/update/:id', (req, res) => {
    const { id } = req.params;
    const { name_Student, last_Name_Student, class_Student, email_Student, dni_Student, birthdate_Student } = req.body;
    
    const query = `UPDATE school.student SET name_Student ='${name_Student}', last_Name_Student ='${last_Name_Student}', class_Student ='${class_Student}', email_Student ='${email_Student}', dni_Student = '${dni_Student}', birthdate_Student = '${birthdate_Student}' WHERE id_Student ='${id}'`;

    connection.query(query, (error, result) => {
        if (error) return console.log(error.message);

        res.json(`Los datos del estudiante ${name_Student} ${last_Name_Student} se actualizaron correctamente`);
    });
});

//delete student
app.delete('/api/student/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM school.student WHERE id_Student = ${id}`;
    connection.query(query, (error, result) => {
        if (error) return console.log(error.message);

        res.json(`Los datos del estudiante se eliminaron correctamente`);
    });
});
